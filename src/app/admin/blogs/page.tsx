"use client";

import { useState, useEffect } from "react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
};

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveBlogsList = async (list: Blog[]) => {
    await fetch("/api/admin?action=update_blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    fetchBlogs();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBlog) return;
    let updated;
    if (blogs.some((b) => b.id === editBlog.id)) {
      updated = blogs.map((b) => (b.id === editBlog.id ? editBlog : b));
    } else {
      updated = [...blogs, editBlog];
    }
    setBlogs(updated);
    saveBlogsList(updated);
    setEditBlog(null);
  };

  const deleteBlog = (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    saveBlogsList(updated);
  };

  if (loading) {
    return <div className="text-center py-12">Loading Blogs Manager...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B6B3A] tracking-tight">Blog Posts</h1>
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
            className="px-4 py-2.5 bg-[#1B6B3A] text-white font-semibold rounded-lg hover:bg-[#2A8F52] shadow transition duration-150"
          >
            + Add Post
          </button>
        )}
      </div>

      {editBlog ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-3xl">
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
              <div key={blog.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-slate-50/50 transition">
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
  );
}
