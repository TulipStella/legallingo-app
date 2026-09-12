from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import hashlib
import secrets
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, date, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'legallingo')

if not mongo_url:
    raise ValueError("MONGO_URL environment variable is required")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI(title="LegalLingo API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# ---------- Helpers ----------
def hash_password(pw: str) -> str:
    salt = "legallingo_salt_v1"
    return hashlib.sha256((salt + pw).encode()).hexdigest()

def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def today_str() -> str:
    return datetime.now(timezone.utc).date().isoformat()

# ---------- Models ----------
class SignupInput(BaseModel):
    email: EmailStr
    password: str
    name: str

class LoginInput(BaseModel):
    email: EmailStr
    password: str

class OnboardingInput(BaseModel):
    interests: List[str] = []
    dailyMinutes: int = 10
    goal: str = "know_rights"

class LessonCompleteInput(BaseModel):
    lessonId: str
    unitId: str
    score: int
    xpEarned: int
    correctCount: int
    totalCount: int
    idempotencyKey: str

class SpendInput(BaseModel):
    kind: str
    amount: int

# ---------- Auth Dependency ----------
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing auth token")
    token = authorization.replace("Bearer ", "")
    session = await db.sessions.find_one({"token": token})
    if not session:
        raise HTTPException(401, "Invalid session")
    user = await db.users.find_one({"id": session["userId"]}, {"_id": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return user

# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "LegalLingo API", "status": "ok", "version": "1.0.0"}

@api_router.post("/auth/signup")
async def signup(payload: SignupInput):
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(400, "Email already registered")
    user = {
        "id": str(uuid.uuid4()),
        "email": payload.email.lower(),
        "name": payload.name,
        "passwordHash": hash_password(payload.password),
        "createdAt": utc_now_iso(),
        "avatar": "eagle",
        "level": 1,
        "xp": 0,
        "gems": 50,
        "energy": 5,
        "energyMax": 5,
        "streak": 0,
        "longestStreak": 0,
        "lastActive": None,
        "streakDates": [],
        "league": "Trial League",
        "leagueXp": 0,
        "onboarded": False,
        "interests": [],
        "dailyGoalXp": 30,
        "goal": "know_rights",
        "completedLessons": [],
        "masteredLessons": [],
        "conceptScores": {},
        "questProgress": {},
        "achievements": [],
        "friends": [],
        "isAdmin": False,
        "isPremium": False,
    }
    await db.users.insert_one(dict(user))
    token = secrets.token_urlsafe(32)
    await db.sessions.insert_one({"token": token, "userId": user["id"], "createdAt": utc_now_iso()})
    user.pop("passwordHash", None)
    user.pop("_id", None)
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(payload: LoginInput):
    user = await db.users.find_one({"email": payload.email.lower()}, {"_id": 0})
    if not user or user["passwordHash"] != hash_password(payload.password):
        raise HTTPException(401, "Invalid credentials")
    token = secrets.token_urlsafe(32)
    await db.sessions.insert_one({"token": token, "userId": user["id"], "createdAt": utc_now_iso()})
    user.pop("passwordHash", None)
    return {"token": token, "user": user}

@api_router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        await db.sessions.delete_one({"token": token})
    return {"ok": True}

@api_router.get("/me")
async def me(user=Depends(get_current_user)):
    user.pop("passwordHash", None)
    return user

@api_router.post("/me/onboarding")
async def save_onboarding(payload: OnboardingInput, user=Depends(get_current_user)):
    goal_to_xp = {"5": 20, "10": 30, "15": 50, "20": 80}
    daily_xp = goal_to_xp.get(str(payload.dailyMinutes), 30)
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {
            "onboarded": True,
            "interests": payload.interests,
            "dailyMinutes": payload.dailyMinutes,
            "goal": payload.goal,
            "dailyGoalXp": daily_xp,
        }}
    )
    return {"ok": True}

@api_router.post("/lessons/complete")
async def complete_lesson(payload: LessonCompleteInput, user=Depends(get_current_user)):
    existing = await db.xp_transactions.find_one({"idempotencyKey": payload.idempotencyKey})
    if existing:
        fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "passwordHash": 0})
        return {"user": fresh, "duplicate": True}

    now = datetime.now(timezone.utc)
    today = now.date().isoformat()
    yesterday = (now.date() - timedelta(days=1)).isoformat()
    last_active = user.get("lastActive")

    new_streak = user.get("streak", 0)
    streak_dates = user.get("streakDates", [])
    if last_active != today:
        if last_active == yesterday:
            new_streak = new_streak + 1
        else:
            new_streak = 1
        if today not in streak_dates:
            streak_dates.append(today)
            streak_dates = streak_dates[-60:]

    longest = max(user.get("longestStreak", 0), new_streak)

    completed = list(user.get("completedLessons", []))
    if payload.lessonId not in completed:
        completed.append(payload.lessonId)

    mastered = list(user.get("masteredLessons", []))
    if payload.score >= 95 and payload.lessonId not in mastered:
        mastered.append(payload.lessonId)

    qp = dict(user.get("questProgress", {}))
    qp["lessons_today"] = qp.get("lessons_today", 0) + 1
    qp["xp_today"] = qp.get("xp_today", 0) + payload.xpEarned
    if payload.score >= 80:
        qp["accurate_today"] = qp.get("accurate_today", 0) + 1
    qp["day"] = today

    total_xp = user.get("xp", 0) + payload.xpEarned
    level = 1 + total_xp // 200
    league_xp = user.get("leagueXp", 0) + payload.xpEarned

    gems_add = 5 + (10 if payload.score >= 95 else 0)
    new_gems = user.get("gems", 0) + gems_add

    new_energy = max(0, user.get("energy", 5) - 1)

    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {
            "xp": total_xp,
            "level": level,
            "streak": new_streak,
            "longestStreak": longest,
            "lastActive": today,
            "streakDates": streak_dates,
            "completedLessons": completed,
            "masteredLessons": mastered,
            "questProgress": qp,
            "leagueXp": league_xp,
            "gems": new_gems,
            "energy": new_energy,
        }}
    )

    await db.xp_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "userId": user["id"],
        "lessonId": payload.lessonId,
        "unitId": payload.unitId,
        "xp": payload.xpEarned,
        "score": payload.score,
        "idempotencyKey": payload.idempotencyKey,
        "createdAt": utc_now_iso(),
    })

    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "passwordHash": 0})
    return {"user": fresh, "duplicate": False}

@api_router.post("/me/spend")
async def spend_gems(payload: SpendInput, user=Depends(get_current_user)):
    if user.get("gems", 0) < payload.amount:
        raise HTTPException(400, "Not enough gems")
    updates = {"$inc": {"gems": -payload.amount}}
    if payload.kind == "energy_refill":
        updates["$set"] = {"energy": user.get("energyMax", 5)}
    await db.users.update_one({"id": user["id"]}, updates)
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "passwordHash": 0})
    return {"user": fresh}

@api_router.post("/me/energy/regen")
async def energy_regen(user=Depends(get_current_user)):
    await db.users.update_one({"id": user["id"]}, {"$set": {"energy": user.get("energyMax", 5)}})
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "passwordHash": 0})
    return {"user": fresh}

@api_router.get("/leaderboard")
async def leaderboard(user=Depends(get_current_user)):
    league = user.get("league", "Trial League")
    real_users = await db.users.find(
        {"league": league},
        {"_id": 0, "id": 1, "name": 1, "leagueXp": 1, "streak": 1, "avatar": 1}
    ).sort("leagueXp", -1).to_list(100)
    return {"league": league, "entries": real_users, "me": user["id"]}

@api_router.get("/friends/suggestions")
async def friend_suggestions(user=Depends(get_current_user)):
    others = await db.users.find(
        {"id": {"$ne": user["id"]}},
        {"_id": 0, "id": 1, "name": 1, "xp": 1, "streak": 1, "avatar": 1, "level": 1}
    ).limit(20).to_list(20)
    return {"users": others}

@api_router.post("/friends/add/{friend_id}")
async def add_friend(friend_id: str, user=Depends(get_current_user)):
    friends = list(user.get("friends", []))
    if friend_id not in friends:
        friends.append(friend_id)
    await db.users.update_one({"id": user["id"]}, {"$set": {"friends": friends}})
    return {"ok": True, "friends": friends}

@api_router.get("/friends")
async def get_friends(user=Depends(get_current_user)):
    ids = user.get("friends", [])
    if not ids:
        return {"friends": []}
    friends = await db.users.find(
        {"id": {"$in": ids}},
        {"_id": 0, "id": 1, "name": 1, "xp": 1, "streak": 1, "avatar": 1, "level": 1}
    ).to_list(100)
    return {"friends": friends}

# ---------- Seed demo users ----------
DEMO_USERS = [
    ("aisha@demo.com", "Aisha Kapoor", 1240, 12, 7),
    ("rahul@demo.com", "Rahul Verma", 1180, 8, 5),
    ("maya@demo.com", "Maya Iyer", 980, 15, 4),
    ("kabir@demo.com", "Kabir Singh", 870, 6, 3),
    ("priya@demo.com", "Priya Nair", 810, 4, 2),
    ("arjun@demo.com", "Arjun Mehra", 720, 9, 3),
    ("neha@demo.com", "Neha Rao", 650, 11, 2),
    ("vikram@demo.com", "Vikram Desai", 590, 3, 1),
    ("ishita@demo.com", "Ishita Bose", 520, 7, 1),
    ("aarav@demo.com", "Aarav Sharma", 1105, 12, 8),
]

@app.on_event("startup")
async def seed_data():
    try:
        count = await db.users.count_documents({})
        if count == 0:
            for email, name, xp, streak, level in DEMO_USERS:
                u = {
                    "id": str(uuid.uuid4()),
                    "email": email,
                    "name": name,
                    "passwordHash": hash_password("demo1234"),
                    "createdAt": utc_now_iso(),
                    "avatar": "eagle",
                    "level": level,
                    "xp": xp,
                    "gems": 485 if email == "aarav@demo.com" else 200,
                    "energy": 5,
                    "energyMax": 5,
                    "streak": streak,
                    "longestStreak": streak,
                    "lastActive": today_str(),
                    "streakDates": [today_str()],
                    "league": "Appellate League" if xp > 1000 else "District Conference",
                    "leagueXp": xp // 2,
                    "onboarded": email == "aarav@demo.com",
                    "interests": ["consumer", "renting", "workplace"],
                    "dailyGoalXp": 30,
                    "goal": "know_rights",
                    "completedLessons": [],
                    "masteredLessons": [],
                    "conceptScores": {},
                    "questProgress": {},
                    "achievements": [],
                    "friends": [],
                    "isAdmin": email == "aarav@demo.com",
                    "isPremium": False,
                }
                await db.users.insert_one(u)
            logging.info("Seeded demo users")
    except Exception as e:
        logging.error(f"Seed error: {e}")

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
