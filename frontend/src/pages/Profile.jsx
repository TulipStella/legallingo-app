import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import Mascot from "../components/Mascot";
import { ACHIEVEMENTS, UNITS } from "../data/course";
import { Flame, Gem, Zap, Trophy, Sparkles } from "lucide-react";
import PremiumModal from "./Premium";

export default function Profile() {
  const { user } = useAuth();
  const [premiumOpen, setPremiumOpen] = useState(false);
  if (!user) return null;
  
  const completed = user.completedLessons?.length || 0;
  const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const accuracy = 87;
  const unlocked = ACHIEVEMENTS.filter(a => a.check(user));

  return (
    <>
      <div className="space-y-6" data-testid="profile-page">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--ll-emerald)] to-[var(--ll-emerald-bright)] text-white p-6 border-b-8 border-[var(--ll-emerald-shadow)] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Mascot size={100} mood="idle" />
            <div>
              <h1 className="font-heading text-3xl font-black">{user.name}</h1>
              <div className="text-white/80 text-sm">{user.email}</div>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/15 text-sm font-heading font-bold">Level {user.level}</div>
            </div>
          </div>
          {!user.isPremium && (
            <button onClick={() => setPremiumOpen(true)} data-testid="profile-premium-btn" className="px-4 py-2 rounded-2xl bg-white text-[var(--ll-emerald)] font-heading font-bold uppercase tracking-wide text-xs hover:shadow-lg transition flex items-center gap-2">
              <Sparkles size={16} /> Go Premium
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon={<Zap className="text-[var(--ll-gold)]"/>} label="Total XP" value={user.xp} />
          <Stat icon={<Flame className="text-[var(--ll-fire)]"/>} label="Current Streak" value={`${user.streak}d`} />
          <Stat icon={<Trophy className="text-[var(--ll-burgundy)]"/>} label="Longest" value={`${user.longestStreak}d`} />
          <Stat icon={<Gem className="text-[var(--ll-gem)]"/>} label="Gems" value={user.gems} />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Stat label="Lessons completed" value={`${completed}/${total}`} big />
          <Stat label="Accuracy" value={`${accuracy}%`} big />
        </div>

        <div>
          <h2 className="font-heading text-xl font-black mb-3">Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACHIEVEMENTS.map(a => {
              const has = unlocked.find(u => u.id === a.id);
              return (
                <div key={a.id} data-testid={`ach-${a.id}`}
                  className={`p-4 rounded-2xl border-2 border-b-4 text-center ${has ? "bg-[var(--ll-burgundy-light)] border-[var(--ll-burgundy)]" : "bg-white border-[var(--ll-border)] opacity-60"}`}>
                  <div className="text-3xl">{a.icon}</div>
                  <div className="font-heading font-bold text-sm mt-1">{a.title}</div>
                  <div className="text-xs text-[var(--ll-text-muted)]">{a.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </>
  );
}

function Stat({ icon, label, value, big }) {
  return (
    <div className={`rounded-2xl bg-white border-2 border-b-4 border-[var(--ll-border)] p-4 ${big ? "flex justify-between items-center" : ""}`} data-testid={`stat-${label}`}>
      <div className="flex items-center gap-2">{icon}<div className="text-xs text-[var(--ll-text-muted)] font-heading font-bold uppercase tracking-wide">{label}</div></div>
      <div className={`font-heading font-black ${big ? "text-2xl" : "text-2xl mt-1"} text-[var(--ll-burgundy)]`}>{value}</div>
    </div>
  );
}
