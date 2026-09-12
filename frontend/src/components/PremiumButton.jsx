import React from "react";
import { Sparkles } from "lucide-react";

export default function PremiumButton({ onClick }) {
  return (
    <button onClick={onClick} data-testid="btn-premium-entry"
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#6B1D2F] to-[#8C2840] text-white font-heading font-bold uppercase tracking-wide text-sm hover:shadow-lg transition">
      <Sparkles size={16} className="fill-white" />
      Premium
    </button>
  );
}
