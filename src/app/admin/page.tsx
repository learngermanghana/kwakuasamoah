"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  customerName: string;
  status: string;
};

type Package = {
  id: string;
};

type Blog = {
  id: string;
};

type Settings = {
  displayName: string;
  publicEmail: string;
  bookingsEmail: string;
  calLink: string;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [packagesCount, setPackagesCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setSettings(data.settings);
        setPackagesCount((data.packages || []).length);
        setBlogsCount((data.blogs || []).length);
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B6B3A] mx-auto mb-4"></div>
        Loading dashboard overview...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B6B3A] tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-1">Real-time statistics & configuration status</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Bookings", val: bookings.length, color: "border-l-[#F5C518]", href: "/admin/bookings" },
          { label: "Pending Requests", val: bookings.filter((b) => b.status === "pending").length, color: "border-l-amber-500", href: "/admin/bookings" },
          { label: "Services Provided", val: packagesCount, color: "border-l-[#1B6B3A]", href: "/admin/packages" },
          { label: "Blog Updates", val: blogsCount, color: "border-l-sky-500", href: "/admin/blogs" },
        ].map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${card.color} hover:shadow-md transition duration-150 block`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</span>
            <p className="text-3xl font-extrabold mt-2 text-slate-800">{card.val}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Settings Summary</h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Business Display Name:</span>
              <p className="font-semibold">{settings?.displayName}</p>
            </div>
            <div>
              <span className="text-slate-500">Support / Booking Email:</span>
              <p className="font-semibold">{settings?.bookingsEmail}</p>
            </div>
            <div>
              <span className="text-slate-500">Contact Email:</span>
              <p className="font-semibold">{settings?.publicEmail}</p>
            </div>
            <div>
              <span className="text-slate-500">Cal.com Link:</span>
              <p className="font-semibold text-sky-600 truncate">{settings?.calLink}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Shortcuts</h3>
            <p className="text-xs text-slate-500 mb-4">Jump straight into managing sections of the website</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/packages"
              className="text-center rounded-lg border border-slate-200 py-3 text-xs font-bold hover:bg-slate-50 transition"
            >
              Configure Packages
            </Link>
            <Link
              href="/admin/blogs"
              className="text-center rounded-lg border border-slate-200 py-3 text-xs font-bold hover:bg-slate-50 transition"
            >
              Write Blog Post
            </Link>
            <Link
              href="/admin/gallery"
              className="text-center rounded-lg border border-slate-200 py-3 text-xs font-bold hover:bg-slate-50 transition"
            >
              Upload Images
            </Link>
            <Link
              href="/admin/settings"
              className="text-center rounded-lg border border-slate-200 py-3 text-xs font-bold hover:bg-slate-50 transition"
            >
              Update Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
