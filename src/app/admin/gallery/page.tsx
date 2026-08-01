"use client";

import { useState, useEffect } from "react";

type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  caption: string;
};

export default function GalleryManager() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editGal, setEditGal] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setGallery(data.gallery || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveGalleryList = async (list: GalleryItem[]) => {
    await fetch("/api/admin?action=update_gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    fetchGallery();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGal) return;
    let updated;
    if (gallery.some((g) => g.id === editGal.id)) {
      updated = gallery.map((g) => (g.id === editGal.id ? editGal : g));
    } else {
      updated = [...gallery, editGal];
    }
    setGallery(updated);
    saveGalleryList(updated);
    setEditGal(null);
  };

  const deleteGalleryItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    saveGalleryList(updated);
  };

  if (loading) {
    return <div className="text-center py-12">Loading Gallery Manager...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B6B3A] tracking-tight">Gallery Collection</h1>
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
            className="px-4 py-2.5 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow transition duration-150"
          >
            + Add Image
          </button>
        )}
      </div>

      {editGal ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl">
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
            <div key={g.id} className="bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition">
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
  );
}
