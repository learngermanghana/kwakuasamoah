"use client";

import { useState, useEffect } from "react";

type Settings = {
  displayName: string;
  tagline: string;
  businessDescription: string;
  publicPhone: string;
  whatsappNumber: string;
  publicEmail: string;
  bookingsEmail: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  x: string;
  linkedin: string;
  calLink: string;
};

export default function SettingsManager() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch("/api/admin?action=update_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert("Settings updated successfully!");
        fetchSettings();
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading Configuration Settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B6B3A] tracking-tight">System Configurations</h1>
        <p className="text-slate-500 mt-1">Configure brand details, social URLs, and scheduling links</p>
      </div>

      {settings && (
        <form onSubmit={handleSettingsSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 border-b pb-2">
              <h3 className="font-bold text-[#1B6B3A] text-sm">General Branding</h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Business Display Name</label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500">Business Description</label>
              <textarea
                value={settings.businessDescription}
                onChange={(e) => setSettings({ ...settings, businessDescription: e.target.value })}
                rows={2}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>

            <div className="col-span-2 border-b pb-2 pt-2">
              <h3 className="font-bold text-[#1B6B3A] text-sm">Contact Information</h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Public Contact Email</label>
              <input
                type="email"
                value={settings.publicEmail}
                onChange={(e) => setSettings({ ...settings, publicEmail: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Bookings / Support Email</label>
              <input
                type="email"
                value={settings.bookingsEmail}
                onChange={(e) => setSettings({ ...settings, bookingsEmail: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Phone</label>
              <input
                type="text"
                value={settings.publicPhone}
                onChange={(e) => setSettings({ ...settings, publicPhone: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>

            <div className="col-span-2 border-b pb-2 pt-2">
              <h3 className="font-bold text-[#1B6B3A] text-sm">Integrations & Socials</h3>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500">Cal.com Scheduling URL</label>
              <input
                type="text"
                value={settings.calLink}
                onChange={(e) => setSettings({ ...settings, calLink: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Tiktok Link</label>
              <input
                type="text"
                value={settings.tiktok}
                onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Instagram Link</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Youtube Link</label>
              <input
                type="text"
                value={settings.youtube}
                onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500">Facebook Link</label>
              <input
                type="text"
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow transition"
            >
              Save Configurations
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
