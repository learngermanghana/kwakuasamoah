"use client";

import { useState } from "react";

export function MailingList() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API registration delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSuccess(true);
    setLoading(false);
    setEmail("");
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-950 bg-[#0B1510] developer-grid-dark p-8 md:p-12 text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-npontu-green/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-npontu-gold">Join the Community</span>
        <h3 className="text-3xl font-extrabold tracking-tight">Stay Updated on Relocation & Visa News</h3>
        <p className="text-sm text-emerald-100/70 leading-relaxed">
          Sign up to get instant alerts on study guidelines, travel updates, and visa checklist changes sent directly to your inbox.
        </p>

        {success ? (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-sm text-emerald-400 font-bold animate-in fade-in duration-200">
            🎉 Welcome! You have successfully joined our mailing list.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-npontu-gold focus:ring-1 focus:ring-npontu-gold transition duration-150"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-npontu-gold hover:bg-npontu-gold-warm text-npontu-surface-dark px-6 py-3 font-bold text-sm transition duration-150 whitespace-nowrap"
            >
              {loading ? "Joining..." : "Subscribe Now"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
