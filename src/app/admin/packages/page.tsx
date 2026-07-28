"use client";

import { useState, useEffect } from "react";

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

export default function PackagesManager() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPkg, setEditPkg] = useState<Package | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePackagesList = async (list: Package[]) => {
    await fetch("/api/admin?action=update_packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    fetchPackages();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPkg) return;
    let updated;
    if (packages.some((p) => p.id === editPkg.id)) {
      updated = packages.map((p) => (p.id === editPkg.id ? editPkg : p));
    } else {
      updated = [...packages, editPkg];
    }
    setPackages(updated);
    savePackagesList(updated);
    setEditPkg(null);
  };

  const deletePackage = (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    const updated = packages.filter((p) => p.id !== id);
    setPackages(updated);
    savePackagesList(updated);
  };

  if (loading) {
    return <div className="text-center py-12">Loading Packages Manager...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B6B3A] tracking-tight">Packages & Services</h1>
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
            className="px-4 py-2.5 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow transition duration-150"
          >
            + Add Package
          </button>
        )}
      </div>

      {editPkg ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-2xl">
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
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-200">
              <img src={pkg.image} alt={pkg.serviceName} className="h-44 w-full object-cover bg-slate-50" />
              <div className="p-5 flex-1 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-npontu-gold bg-[#0F1A14] px-2 py-0.5 rounded-full">{pkg.category}</span>
                <h4 className="text-lg font-bold text-slate-800 mt-2">{pkg.serviceName}</h4>
                <p className="text-sm text-slate-500 line-clamp-2">{pkg.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm font-semibold pt-2">
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
  );
}
