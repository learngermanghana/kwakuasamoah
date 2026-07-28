"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication on route changes
    fetch("/api/admin?action=check-auth")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authorized) {
          // If not authorized and not on login page, redirect to login
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
        } else {
          setAuthorized(true);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
        setLoading(false);
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/admin?action=logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7F5] text-slate-800">
        <div className="text-center font-semibold">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B6B3A] mx-auto mb-4"></div>
          Loading Admin CRM...
        </div>
      </div>
    );
  }

  // If on login page, do not display side navigation wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { href: "/admin", label: "📊 Overview" },
    { href: "/admin/bookings", label: "📅 Bookings" },
    { href: "/admin/packages", label: "📦 Packages" },
    { href: "/admin/blogs", label: "✍️ Blog Posts" },
    { href: "/admin/gallery", label: "🖼️ Gallery" },
    { href: "/admin/settings", label: "⚙️ Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-800 font-sans flex flex-col md:flex-row">
      {/* Shared Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F1A14] text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-emerald-950 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#F5C518]">Kwaku CRM</h2>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">Admin Panel</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs bg-emerald-900/40 hover:bg-red-900/40 hover:text-red-400 p-2 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full block px-4 py-3 rounded-lg text-sm font-medium transition duration-150 ${
                    isActive
                      ? "bg-[#1B6B3A] text-white shadow-sm"
                      : "text-emerald-100 hover:bg-emerald-900/30"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-emerald-950 text-xs text-emerald-500">
          Logged in as Admin<br />
          v1.1.0
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
