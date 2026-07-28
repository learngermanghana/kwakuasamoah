"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: string;
  createdAt: string;
};

type Package = {
  id: string;
  serviceName: string;
  category?: string;
  durationDays?: number;
  priceLabel?: string;
  price?: number;
  description?: string;
  includes?: string;
  image: string;
  imageAlt: string;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
};

type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  caption: string;
};

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "packages" | "blogs" | "gallery" | "settings">("overview");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  // DB State
  const [settings, setSettings] = useState<Settings | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Search & Filters
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");

  // Edit / Add States
  const [editPkg, setEditPkg] = useState<Package | null>(null);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [editGal, setEditGal] = useState<GalleryItem | null>(null);

  useEffect(() => {
    // Fetch CRM DB data
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin");
      if (!response.ok) {
        if (response.status === 401) {
          setAuthError(true);
          router.push("/admin/login");
        }
        return;
      }
      const data = await response.json();
      setSettings(data.settings);
      setPackages(data.packages || []);
      setBlogs(data.blogs || []);
      setGallery(data.gallery || []);
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Fetch DB failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin?action=logout", { method: "POST" });
    router.push("/admin/login");
  };

  const saveDBSection = async (action: string, data: any) => {
    try {
      const res = await fetch(`/api/admin?action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to save changes");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
  };

  // BOOKINGS HANDLERS
  const updateBookingStatus = (id: string, newStatus: "pending" | "confirmed" | "cancelled") => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    saveDBSection("update_bookings", updated);
  };

  const deleteBooking = (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    saveDBSection("update_bookings", updated);
  };

  // PACKAGES HANDLERS
  const savePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPkg) return;
    let updated;
    if (packages.some((p) => p.id === editPkg.id)) {
      updated = packages.map((p) => (p.id === editPkg.id ? editPkg : p));
    } else {
      updated = [...packages, editPkg];
    }
    setPackages(updated);
    saveDBSection("update_packages", updated);
    setEditPkg(null);
  };

  const deletePackage = (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    const updated = packages.filter((p) => p.id !== id);
    setPackages(updated);
    saveDBSection("update_packages", updated);
  };

  // BLOG HANDLERS
  const saveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBlog) return;
    let updated;
    if (blogs.some((b) => b.id === editBlog.id)) {
      updated = blogs.map((b) => (b.id === editBlog.id ? editBlog : b));
    } else {
      updated = [...blogs, editBlog];
    }
    setBlogs(updated);
    saveDBSection("update_blogs", updated);
    setEditBlog(null);
  };

  const deleteBlog = (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    saveDBSection("update_blogs", updated);
  };

  // GALLERY HANDLERS
  const saveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGal) return;
    let updated;
    if (gallery.some((g) => g.id === editGal.id)) {
      updated = gallery.map((g) => (g.id === editGal.id ? editGal : g));
    } else {
      updated = [...gallery, editGal];
    }
    setGallery(updated);
    saveDBSection("update_gallery", updated);
    setEditGal(null);
  };

  const deleteGalleryItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    saveDBSection("update_gallery", updated);
  };

  // SETTINGS HANDLER
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      saveDBSection("update_settings", settings);
      alert("Settings updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7F5] text-slate-800">
        <div className="text-center font-semibold">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B6B3A] mx-auto mb-4"></div>
          Loading CRM Dashboard...
        </div>
      </div>
    );
  }

  if (authError) {
    return null;
  }

  // Bookings filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesFilter = bookingFilter === "all" ? true : b.status === bookingFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-800 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
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
            {[
              { id: "overview", label: "📊 Overview" },
              { id: "bookings", label: "📅 Bookings" },
              { id: "packages", label: "📦 Packages & Services" },
              { id: "blogs", label: "✍️ Blog Posts" },
              { id: "gallery", label: "🖼️ Gallery" },
              { id: "settings", label: "⚙️ Site Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditPkg(null);
                  setEditBlog(null);
                  setEditGal(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition duration-150 ${
                  activeTab === tab.id
                    ? "bg-[#1B6B3A] text-white shadow-sm"
                    : "text-emerald-100 hover:bg-emerald-900/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-emerald-950 text-xs text-emerald-500">
          Logged in as Admin<br />
          v1.0.0
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1B6B3A]">System Overview</h1>
                <p className="text-slate-500 mt-1">Real-time statistics & website configuration status</p>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Total Bookings", val: bookings.length, color: "border-l-[#F5C518]" },
                { label: "Pending Requests", val: bookings.filter((b) => b.status === "pending").length, color: "border-l-amber-500" },
                { label: "Services Provided", val: packages.length, color: "border-l-[#1B6B3A]" },
                { label: "Blog Updates", val: blogs.length, color: "border-l-sky-500" },
              ].map((card, idx) => (
                <div key={idx} className={`bg-white p-6 rounded-xl border-l-4 shadow-sm ${card.color}`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</span>
                  <p className="text-3xl font-extrabold mt-2 text-slate-800">{card.val}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Settings Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1B6B3A]">Manage Bookings</h1>
              <p className="text-slate-500 mt-1">Review requests, modify booking status, or remove items</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <input
                type="text"
                placeholder="Search by customer name, email or service..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1B6B3A]"
              />
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1B6B3A]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Bookings table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Requested Service</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        No bookings found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{b.customerName}</div>
                          <div className="text-xs text-slate-500">{b.customerEmail}</div>
                          <div className="text-xs text-slate-500">{b.customerPhone}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{b.serviceName}</td>
                        <td className="p-4 text-slate-700">
                          <div>📅 {b.bookingDate}</div>
                          <div>🕒 {b.bookingTime}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              b.status === "confirmed"
                                ? "bg-emerald-100 text-[#1B6B3A]"
                                : b.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => updateBookingStatus(b.id, "confirmed")}
                            className="px-2 py-1 text-xs font-semibold bg-[#1B6B3A] text-white rounded hover:bg-[#2A8F52]"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(b.id, "cancelled")}
                            className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="px-2 py-1 text-xs font-semibold bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PACKAGES TAB */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1B6B3A]">Travel & Support Packages</h1>
                <p className="text-slate-500 mt-1">Configure study routes, visa support packages, or travel offers</p>
              </div>
              {!editPkg && (
                <button
                  onClick={() =>
                    setEditPkg({
                      id: "pkg-" + Date.now(),
                      serviceName: "",
                      category: "",
                      durationDays: 30,
                      priceLabel: "GHS ",
                      price: 0,
                      description: "",
                      includes: "",
                      image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop",
                      imageAlt: "",
                    })
                  }
                  className="px-4 py-2 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow"
                >
                  + Add Package
                </button>
              )}
            </div>

            {editPkg ? (
              <form onSubmit={savePackage} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-2xl">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
                  {packages.some((p) => p.id === editPkg.id) ? "Edit Package" : "Create New Package"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500">Service Name</label>
                    <input
                      type="text"
                      required
                      value={editPkg.serviceName}
                      onChange={(e) => setEditPkg({ ...editPkg, serviceName: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500">Destination/Category</label>
                    <input
                      type="text"
                      value={editPkg.category || ""}
                      onChange={(e) => setEditPkg({ ...editPkg, category: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500">Price (GHS)</label>
                    <input
                      type="number"
                      value={editPkg.price || 0}
                      onChange={(e) => setEditPkg({ ...editPkg, price: Number(e.target.value), priceLabel: `GHS ${e.target.value}` })}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500">Duration (Days)</label>
                    <input
                      type="number"
                      value={editPkg.durationDays || 30}
                      onChange={(e) => setEditPkg({ ...editPkg, durationDays: Number(e.target.value) })}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500">Features Included (Comma separated)</label>
                    <input
                      type="text"
                      value={editPkg.includes || ""}
                      onChange={(e) => setEditPkg({ ...editPkg, includes: e.target.value })}
                      placeholder="e.g. Visa checklist, Application guidance"
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500">Description Summary</label>
                    <textarea
                      value={editPkg.description || ""}
                      onChange={(e) => setEditPkg({ ...editPkg, description: e.target.value })}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500">Image URL</label>
                    <input
                      type="text"
                      value={editPkg.image}
                      onChange={(e) => setEditPkg({ ...editPkg, image: e.target.value, imageAlt: editPkg.serviceName })}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setEditPkg(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col justify-between">
                    <img src={pkg.image} alt={pkg.serviceName} className="h-44 w-full object-cover bg-slate-50" />
                    <div className="p-5 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5C518] bg-[#0F1A14] px-2 py-0.5 rounded-full">{pkg.category}</span>
                      <h4 className="text-lg font-bold text-slate-800 mt-2">{pkg.serviceName}</h4>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{pkg.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                        <span className="text-[#1B6B3A]">{pkg.priceLabel || `GHS ${pkg.price}`}</span>
                        <span className="text-slate-400">⏱️ {pkg.durationDays} Days</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 border-t flex gap-2 justify-end">
                      <button
                        onClick={() => setEditPkg(pkg)}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#1B6B3A] text-white rounded hover:bg-[#2A8F52]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BLOGS TAB */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1B6B3A]">Blog Posts</h1>
                <p className="text-slate-500 mt-1">Manage travel tips, news and guide articles</p>
              </div>
              {!editBlog && (
                <button
                  onClick={() =>
                    setEditBlog({
                      id: "post-" + Date.now(),
                      title: "",
                      slug: "",
                      content: "",
                      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop",
                      publishedAt: new Date().toISOString().split("T")[0],
                    })
                  }
                  className="px-4 py-2 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow"
                >
                  + Add Post
                </button>
              )}
            </div>

            {editBlog ? (
              <form onSubmit={saveBlog} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
                  {blogs.some((b) => b.id === editBlog.id) ? "Edit Blog Post" : "Create New Blog Post"}
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Post Title</label>
                  <input
                    type="text"
                    required
                    value={editBlog.title}
                    onChange={(e) =>
                      setEditBlog({
                        ...editBlog,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500">Slug</label>
                    <input
                      type="text"
                      required
                      value={editBlog.slug}
                      onChange={(e) => setEditBlog({ ...editBlog, slug: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500">Published Date</label>
                    <input
                      type="date"
                      required
                      value={editBlog.publishedAt}
                      onChange={(e) => setEditBlog({ ...editBlog, publishedAt: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Header Image URL</label>
                  <input
                    type="text"
                    value={editBlog.imageUrl}
                    onChange={(e) => setEditBlog({ ...editBlog, imageUrl: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">HTML Content</label>
                  <textarea
                    value={editBlog.content}
                    onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                    rows={10}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none font-mono text-sm"
                    placeholder="<p>Write your article here...</p>"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setEditBlog(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52]"
                  >
                    Save Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border divide-y">
                {blogs.length === 0 ? (
                  <p className="p-6 text-center text-slate-400">No blog posts configured yet.</p>
                ) : (
                  blogs.map((blog) => (
                    <div key={blog.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <img src={blog.imageUrl} alt="" className="h-16 w-24 object-cover bg-slate-50 rounded" />
                        <div>
                          <h4 className="font-bold text-slate-800">{blog.title}</h4>
                          <span className="text-xs text-slate-400">Published on {blog.publishedAt} | /{blog.slug}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditBlog(blog)}
                          className="px-3 py-1.5 text-xs font-semibold bg-[#1B6B3A] text-white rounded hover:bg-[#2A8F52]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1B6B3A]">Gallery Collection</h1>
                <p className="text-slate-500 mt-1">Manage public travel photographs and testimonial images</p>
              </div>
              {!editGal && (
                <button
                  onClick={() =>
                    setEditGal({
                      id: "img-" + Date.now(),
                      url: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop",
                      alt: "",
                      caption: "",
                    })
                  }
                  className="px-4 py-2 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow"
                >
                  + Add Image
                </button>
              )}
            </div>

            {editGal ? (
              <form onSubmit={saveGalleryItem} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
                  {gallery.some((g) => g.id === editGal.id) ? "Edit Photo" : "Add Photo to Gallery"}
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Image URL</label>
                  <input
                    type="text"
                    required
                    value={editGal.url}
                    onChange={(e) => setEditGal({ ...editGal, url: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Caption / Label</label>
                  <input
                    type="text"
                    value={editGal.caption}
                    onChange={(e) => setEditGal({ ...editGal, caption: e.target.value, alt: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:border-[#1B6B3A]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setEditGal(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52]"
                  >
                    Save Image
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white rounded-xl overflow-hidden border shadow-sm">
                    <img src={g.url} alt={g.alt} className="h-40 w-full object-cover bg-slate-50" />
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-700 truncate">{g.caption || "No Caption"}</p>
                      <div className="mt-3 flex gap-2 justify-end">
                        <button
                          onClick={() => setEditGal(g)}
                          className="px-2 py-1 text-[11px] bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteGalleryItem(g.id)}
                          className="px-2 py-1 text-[11px] bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && settings && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-3xl font-bold text-[#1B6B3A]">System Configurations</h1>
              <p className="text-slate-500 mt-1">Configure brand details, social URLs, and scheduling links</p>
            </div>

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
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500">Business Description</label>
                  <textarea
                    value={settings.businessDescription}
                    onChange={(e) => setSettings({ ...settings, businessDescription: e.target.value })}
                    rows={2}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
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
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Bookings / Support Email</label>
                  <input
                    type="email"
                    value={settings.bookingsEmail}
                    onChange={(e) => setSettings({ ...settings, bookingsEmail: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Phone</label>
                  <input
                    type="text"
                    value={settings.publicPhone}
                    onChange={(e) => setSettings({ ...settings, publicPhone: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
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
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Instagram Link</label>
                  <input
                    type="text"
                    value={settings.instagram}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Youtube Link</label>
                  <input
                    type="text"
                    value={settings.youtube}
                    onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500">Facebook Link</label>
                  <input
                    type="text"
                    value={settings.facebook}
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow"
                >
                  Save Configurations
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
