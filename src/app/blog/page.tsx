import Link from "next/link";
import { getCachedBlogPosts } from "@/lib/cached-content";

export const revalidate = 60 * 60;
export const maxDuration = 10;

function getExcerpt(html: string, maxLength = 180) {
  const plainText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

export default async function BlogPage() {
  const posts = await getCachedBlogPosts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#0b2d4f]">Blog</h1>
      <p className="mt-3 text-slate-600">Latest published blog posts synced from Sedifex.</p>

      {posts.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="h-52 w-full object-cover" /> : null}
              <div className="p-5">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{getExcerpt(post.content)}</p>
                <p className="mt-3 text-xs text-slate-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</p>
                <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-[#0d6f73]">
                  Read post
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-slate-600">No published posts available right now.</p>
      )}
    </main>
  );
}
