"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const socialLinks = [
  { label: "TikTok", href: siteConfig.socials.tiktok },
  { label: "Instagram", href: siteConfig.socials.instagram },
  { label: "Facebook", href: siteConfig.socials.facebook },
  { label: "YouTube", href: siteConfig.socials.youtube },
  { label: "X", href: siteConfig.socials.x }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(data.error || "Failed to submit inquiry.");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-npontu-surface-light developer-grid min-h-[90vh] py-16">
      <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        {/* Info Area */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-npontu-green/10 border border-npontu-green/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-npontu-green">
              Contact Kwaku
            </span>
            <h1 className="text-4xl font-extrabold text-npontu-green tracking-tight md:text-5xl">
              Let&apos;s plan your next travel move.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Reach out for consultation, visa guidance, document support and planning for your international travel experience.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800">Support & Booking Channels</h2>
              <div className="h-0.5 w-10 bg-npontu-gold rounded-full" />
            </div>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-npontu-green font-bold hover:underline">
                  {siteConfig.email}
                </a>
              </p>
              <p>
                <strong>Phone/WhatsApp:</strong>{" "}
                <a href={`https://wa.me/${siteConfig.whatsapp}`} className="text-npontu-green font-bold hover:underline">
                  {siteConfig.phone}
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Visa Mock Coaching & SOP Reviews</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              For visa coaching, mock interview preparation, Statement of Purpose (SOP) guidance, and resume edits, write to us directly. We will assign a mentor to your application pathway.
            </p>
          </div>
        </div>

        {/* Contact Form Area */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-tr from-npontu-green to-npontu-gold opacity-10 blur-xl rounded-3xl" />
          <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-npontu-green">Send a Quick Message</h2>
            <p className="text-sm text-slate-500">Provide details of your destination/deadlines, and we will get back to you.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-500">Full Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-npontu-green focus:ring-2 focus:ring-npontu-green/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-500">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-npontu-green focus:ring-2 focus:ring-npontu-green/20"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-500">Phone / WhatsApp</label>
                  <input
                    type="text"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-npontu-green focus:ring-2 focus:ring-npontu-green/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-500">Your Message Details</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-npontu-green focus:ring-2 focus:ring-npontu-green/20"
                  placeholder="Share details of your travel purpose, destination, deadlines..."
                />
              </div>

              {success && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-250 p-4 text-sm text-emerald-800 animate-in fade-in duration-200">
                  🎉 Thank you! Your message has been sent successfully. We will follow up shortly.
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-250 p-4 text-sm text-red-800">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-npontu-green hover:bg-npontu-green-light py-3.5 font-bold text-white transition duration-150 disabled:opacity-50 shadow-sm"
              >
                {loading ? "Sending Message..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
