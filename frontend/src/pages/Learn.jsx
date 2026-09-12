import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Star, Play, Check, Trophy } from "lucide-react";
import { UNITS } from "../data/course";
import Mascot from "../components/Mascot";
import { useAuth } from "../lib/auth";

function nodeState(lesson, user, unitLessons, index) {
  const completed = user?.completedLessons || [];
  const mastered = user?.masteredLessons || [];
  if (mastered.includes(lesson.id)) return "mastered";
  if (completed.includes(lesson.id)) return "completed";
  if (index === 0) return "available";
  const prev = unitLessons[index - 1];
  if (completed.includes(prev.id)) return "available";
  return "locked";
}

export default function Learn() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) return null;

  const dailyProgress = Math.min(100, ((user.questProgress?.xp_today || 0) / (user.dailyGoalXp || 30)) * 100);

  return (
    <div className="space-y-8" data-testid="learn-page">
      {/* Greeting */}
      <div className="rounded-3xl bg-gradient-to-br from-[var(--ll-burgundy)] to-[#8C2840] text-white p-6 sm:p-8 shadow-lg border-b-8 border-[var(--ll-burgundy-shadow)] relative overflow-hidden">
        <div className="flex items-center gap-5">
          <Mascot size={92} mood={user.streak > 0 ? "fire" : "happy"} className="wiggle" />
          <div className="flex-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-black">Good day, {user.name?.split(" ")[0]}!</h1>
            <p className="text-white/80 text-sm mt-1">"LegalLingo provides general educational information, not legal advice."</p>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-sm font-heading font-bold">
                🔥 {user.streak}-day streak
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-36 h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--ll-gold)]" style={{ width: `${dailyProgress}%` }} />
                </div>
                <span className="font-heading font-bold">{user.questProgress?.xp_today || 0}/{user.dailyGoalXp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Path */}
      {UNITS.map((unit, uIdx) => {
        const unlockedUnit = uIdx === 0 || UNITS[uIdx - 1].lessons.every(l => (user.completedLessons || []).includes(l.id));
        return (
          <section key={unit.id} data-testid={`unit-${unit.id}`}>
            {/* Unit banner */}
            <div className={`rounded-3xl px-6 py-5 mb-8 flex items-center justify-between text-white shadow-md border-b-8 ${unit.color === "burgundy" ? "bg-[var(--ll-burgundy)] border-[var(--ll-burgundy-shadow)]" : "bg-[var(--ll-emerald)] border-[var(--ll-emerald-shadow)]"}`}>
              <div>
                <div className="text-xs uppercase font-heading font-bold tracking-widest opacity-80">Unit {uIdx + 1}</div>
                <div className="font-heading text-xl sm:text-2xl font-black">{unit.title}</div>
                <div className="text-sm opacity-80">{unit.subtitle}</div>
              </div>
              {!unlockedUnit && <Lock size={28} />}
            </div>

            {/* Nodes in curved path */}
            <div className="relative flex flex-col items-center gap-6 pb-6">
              {unit.lessons.map((lesson, i) => {
                const state = unlockedUnit ? nodeState(lesson, user, unit.lessons, i) : "locked";
                const sway = ["translate-x-0", "translate-x-16", "translate-x-24", "translate-x-16", "translate-x-0", "-translate-x-16", "-translate-x-24", "-translate-x-16"][i % 8];
                const disabled = state === "locked";
                return (
                  <div key={lesson.id} className={`flex items-center gap-3 transform ${sway}`}>
                    <button
                      data-testid={`node-${lesson.id}`}
                      disabled={disabled}
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      className={`node-btn ${state === "locked" ? "node-locked" : state === "available" ? "node-available node-pulse" : state === "in-progress" ? "node-inprogress" : state === "completed" ? "node-completed" : "node-mastered"}`}
                      title={lesson.title}>
                      {state === "locked" && <Lock size={26} />}
                      {state === "available" && <Play size={26} className="fill-white ml-1" />}
                      {state === "completed" && <Check size={30} strokeWidth={3} />}
                      {state === "mastered" && <Star size={26} className="fill-white" />}
                    </button>
                    <div className={`hidden sm:block max-w-[220px] ${disabled ? "opacity-50" : ""}`}>
                      <div className="font-heading font-bold text-sm">{lesson.title}</div>
                      <div className="text-xs text-[var(--ll-text-muted)]">{lesson.description}</div>
                    </div>
                  </div>
                );
              })}
              {/* Checkpoint */}
              <div className="mt-4 flex items-center gap-3">
                <button className="node-btn node-mastered" data-testid={`checkpoint-${unit.id}`} onClick={() => alert("Complete all lessons for checkpoint")}><Trophy size={28} /></button>
                <div className="font-heading font-bold text-sm">Unit Checkpoint</div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
