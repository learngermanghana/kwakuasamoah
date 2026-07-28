"use client";

import { useState, useEffect } from "react";

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

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveBookings = async (list: Booking[]) => {
    await fetch("/api/admin?action=update_bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    fetchBookings();
  };

  const updateBookingStatus = (id: string, status: "pending" | "confirmed" | "cancelled") => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    saveBookings(updated);
  };

  const deleteBooking = (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    saveBookings(updated);
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? true : b.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="text-center py-12">Loading Bookings Manager...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B6B3A] tracking-tight">Manage Bookings</h1>
        <p className="text-slate-500 mt-1">Review requests, modify booking status, or remove items</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Search by customer name, email or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1B6B3A]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1B6B3A]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
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
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => updateBookingStatus(b.id, "confirmed")}
                      className="px-2 py-1.5 text-xs font-semibold bg-[#1B6B3A] text-white rounded hover:bg-[#2A8F52] transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, "cancelled")}
                      className="px-2 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="px-2 py-1.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition"
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
  );
}
