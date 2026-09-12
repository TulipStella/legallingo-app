import React, { useState } from "react";
import { X, Check, Sparkles, Lock, BookOpen, Users, Award, Shield, Zap } from "lucide-react";
import Mascot from "../components/Mascot";

export default function PremiumModal({ open, onClose }) {
  const [plan, setPlan] = useState(null);

  if (!open) return null;

  const features = [
    { icon: BookOpen, title: "Advanced Legal Courses", desc: "Access more advanced and specialised legal-learning levels beyond the basics" },
    { icon: Users, title: "Advanced Scenario Simulations", desc: "Interactive 'What would you do?' legal situations with complex decision-making" },
    { icon: Lock, title: "Regional Lingo", desc: "Access legal-learning content in regional Indian languages" },
    { icon: Award, title: "Verified Certificates", desc: "Complete qualifying pathways and earn LegalLingo credentials" },
    { icon: Sparkles, title: "Legal Skill Profile", desc: "Build a record of demonstrated legal aptitude for professional showcase" },
    { icon: Zap, title: "Premium Practice", desc: "Additional practice questions, scenarios and mistake-based learning" },
    { icon: Shield, title: "Streak Protection", desc: "Protect your learning streak when you miss a day" },
    { icon: Sparkles, title: "Ad-Free Learning", desc: "Remove advertisements from the LegalLingo learning experience" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-2xl w-full max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()} data-testid="premium-modal">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#6B1D2F] to-[#8C2840] text-white px-6 sm:px-8 py-10 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="font-heading text-3xl sm:text-4xl font-black">Unlock more with LegalLingo Premium</h1>
            <p className="text-white/80 mt-2 text-sm sm:text-base">Learn more, practise more, and build your legal skills beyond the basics.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition" data-testid="close-premium">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8">
          {/* Mascot celebration */}
          <div className="text-center mb-8">
            <Mascot size={120} mood="celebrate" className="mx-auto wiggle" />
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <h2 className="font-heading text-xl font-black text-[#2C221E] mb-4">Premium Includes</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-[#F3EDE4] border-2 border-[#E6DEC3] hover:border-[#6B1D2F] transition" data-testid={`feature-${i}`}>
                    <div className="flex items-start gap-3">
                      <Icon size={20} className="text-[#6B1D2F] flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-heading font-bold text-sm text-[#2C221E]">{f.title}</div>
                        <div className="text-xs text-[#6E625A] mt-1">{f.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-[#F9EBEF] to-[#FAF7F2] p-6 sm:p-8 rounded-3xl border-2 border-b-4 border-[#6B1D2F] shadow-lg">
            <div className="text-center">
              <h3 className="font-heading text-2xl font-black text-[#6B1D2F]">LegalLingo Premium</h3>
              <div className="mt-3">
                <div className="font-heading text-4xl font-black text-[#6B1D2F]">₹499</div>
                <div className="text-sm text-[#6E625A] font-heading font-bold uppercase tracking-wide">/ month or ₹4,999 / year</div>
              </div>
              <div className="mt-4 text-xs text-[#6E625A]">7-day free trial. Cancel anytime.</div>
            </div>

            {/* Checkmarks */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {["Advanced courses", "Scenario simulations", "Regional Lingo", "Certificates & credentials", "Legal skill profile", "Premium practice", "Streak protection", "Ad-free experience"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 font-body font-semibold text-[#2C221E]">
                  <Check size={18} className="text-[#10B981] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="px-6 sm:px-8 py-6 bg-[#FAF7F2] border-t border-[#E6DEC3] flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} data-testid="btn-maybe-later" className="flex-1 btn-3d btn-muted text-base font-heading font-bold uppercase tracking-wide">
            Maybe Later
          </button>
          <button data-testid="btn-get-premium" className="flex-1 btn-3d border-b-4 bg-[#6B1D2F] text-white border-[#3D0E19] hover:bg-[#541523] font-heading font-bold uppercase tracking-wide text-base">
            Get Premium
          </button>
        </div>
      </div>
    </div>
  );
}
