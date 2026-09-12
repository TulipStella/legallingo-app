import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Swords, Trophy, Target, Users, BookOpen, User, Settings, LogOut, ShoppingBag, Shield } from "lucide-react";
import { useAuth } from "../lib/auth";
import Mascot from "./Mascot";
import TopBar from "./TopBar";
import PremiumButton from "./PremiumButton";

const NAV = [
  { to: "/learn", icon: Home, label: "Learn", testid: "nav-learn" },
  { to: "/challenges", icon: Swords, label: "Challenges", testid: "nav-challenges" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard", testid: "nav-leaderboard" },
  { to: "/quests", icon: Target, label: "Quests", testid: "nav-quests" },
  { to: "/friends", icon: Users, label: "Friends", testid: "nav-friends" },
  { to: "/practice", icon: BookOpen, label: "Practice", testid: "nav-practice" },
  { to: "/shop", icon: ShoppingBag, label: "Shop", testid: "nav-shop" },
  { to: "/profile", icon: User, label: "Profile", testid: "nav-profile" },
];

const MOBILE_NAV = [
  { to: "/learn", icon: Home, label: "Learn" },
  { to: "/practice", icon: BookOpen, label: "Practice" },
  { to: "/challenges", icon: Swords, label: "Challenges" },
  { to: "/leaderboard", icon: Trophy, label: "Board" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function AppShell({ children, onOpenPremium }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--ll-cream)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-[var(--ll-border)] bg-white/80 backdrop-blur px-5 py-6 z-40">
        <button onClick={() => navigate("/learn")} className="flex items-center gap-2 mb-8 text-left" data-testid="sidebar-logo">
          <Mascot size={44} />
          <div>
            <div className="font-heading text-2xl font-bold text-[var(--ll-burgundy)] leading-none">LegalLingo</div>
            <div className="text-xs text-[var(--ll-text-muted)] mt-0.5">Learn the law.</div>
          </div>
        </button>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map(({ to, icon: Icon, label, testid }) => (
            <NavLink key={to} to={to} data-testid={testid}
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-2xl font-heading font-semibold uppercase tracking-wide text-sm transition ${isActive ? "bg-[var(--ll-burgundy-light)] text-[var(--ll-burgundy)]" : "text-[var(--ll-text-muted)] hover:bg-[var(--ll-cream-2)]"}`}>
              <Icon size={20} /> {label}
            </NavLink>
          ))}
          {user?.isAdmin && (
            <NavLink to="/admin" data-testid="nav-admin"
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-2xl font-heading font-semibold uppercase tracking-wide text-sm transition ${isActive ? "bg-[var(--ll-emerald-light)] text-[var(--ll-emerald)]" : "text-[var(--ll-text-muted)] hover:bg-[var(--ll-cream-2)]"}`}>
              <Shield size={20} /> Admin
            </NavLink>
          )}
        </nav>
        <div className="border-t border-[var(--ll-border)] pt-4 space-y-2">
          <div className="px-1">
            <PremiumButton onClick={onOpenPremium} />
          </div>
          <NavLink to="/settings" data-testid="nav-settings" className="flex items-center gap-3 px-3 py-2 rounded-2xl text-sm text-[var(--ll-text-muted)] hover:bg-[var(--ll-cream-2)]">
            <Settings size={18} /> Settings
          </NavLink>
          <button onClick={logout} data-testid="btn-logout" className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-sm text-[var(--ll-text-muted)] hover:bg-[var(--ll-cream-2)]">
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="lg:ml-64 pb-24 lg:pb-8">
        <TopBar onOpenPremium={onOpenPremium} />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-16">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[var(--ll-border)] z-40 flex justify-around py-2">
        {MOBILE_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} data-testid={`mnav-${label.toLowerCase()}`}
            className={({isActive}) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl ${isActive ? "text-[var(--ll-burgundy)]" : "text-[var(--ll-text-muted)]"}`}>
            <Icon size={22} />
            <span className="text-[10px] font-heading font-bold uppercase">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
