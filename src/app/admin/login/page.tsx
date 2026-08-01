"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    fetch("/api/admin?action=check-auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authorized) {
          router.push("/admin");
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1A14] px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-950 bg-[#1A2E22] p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B6B3A] text-2xl text-[#F5C518] shadow-md shadow-[#F5C518]/10">
            🔒
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Kwaku CRM</h1>
          <p className="mt-2 text-sm text-emerald-300">Enter password to manage portfolio & bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-emerald-100" htmlFor="password">
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-lg border border-emerald-800 bg-[#0F1A14] px-4 py-3 text-white placeholder-emerald-800 outline-none transition focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/50 border border-red-900/50 px-4 py-3 text-sm text-red-400">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1B6B3A] py-3 font-semibold text-white transition hover:bg-[#2A8F52] active:bg-[#12492A] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
