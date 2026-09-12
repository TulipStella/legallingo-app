import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./lib/auth";
import AppShell from "./components/AppShell";
import { Landing, AuthForm } from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Learn from "./pages/Learn";
import Lesson from "./pages/Lesson";
import Quests from "./pages/Quests";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Practice from "./pages/Practice";
import Shop from "./pages/Shop";
import Challenges from "./pages/Challenges";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import PremiumModal from "./pages/Premium";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--ll-text-muted)]">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.onboarded && location.pathname !== "/onboarding") return <Navigate to="/onboarding" replace />;
  return children;
}

function Shell({ children }) { 
  const [premiumOpen, setPremiumOpen] = useState(false);
  return (
    <>
      <AppShell onOpenPremium={() => setPremiumOpen(true)}>{children}</AppShell>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthForm mode="login" />} />
            <Route path="/signup" element={<AuthForm mode="signup" />} />
            <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
            <Route path="/learn" element={<Protected><Shell><Learn /></Shell></Protected>} />
            <Route path="/lesson/:lessonId" element={<Protected><Lesson /></Protected>} />
            <Route path="/quests" element={<Protected><Shell><Quests /></Shell></Protected>} />
            <Route path="/leaderboard" element={<Protected><Shell><Leaderboard /></Shell></Protected>} />
            <Route path="/profile" element={<Protected><Shell><Profile /></Shell></Protected>} />
            <Route path="/friends" element={<Protected><Shell><Friends /></Shell></Protected>} />
            <Route path="/practice" element={<Protected><Shell><Practice /></Shell></Protected>} />
            <Route path="/shop" element={<Protected><Shell><Shop /></Shell></Protected>} />
            <Route path="/challenges" element={<Protected><Shell><Challenges /></Shell></Protected>} />
            <Route path="/settings" element={<Protected><Shell><Settings /></Shell></Protected>} />
            <Route path="/admin" element={<Protected><Shell><Admin /></Shell></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
