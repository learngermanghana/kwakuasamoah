import { formatBlogContent } from "@/lib/blog-format.js";
import { notFound } from "next/navigation";
import { getCachedBlogPosts } from "@/lib/cached-content";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;
export const maxDuration = 10;

export async function generateStaticParams() {
  return [];
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const posts = await getCachedBlogPosts(slug);
  const post = posts[0];

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#0d6f73]">Blog Post</p>
      <h1 className="mt-3 text-3xl sm:text-4xl leading-tight font-bold text-[#0b2d4f]">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</p>

      {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="mt-8 w-full rounded-2xl border object-cover" /> : null}

      <article className="blogArticle mt-8 break-words" dangerouslySetInnerHTML={{ __html: formatBlogContent(post.content) }} />

      {post.linkUrl ? (
        <a href={post.linkUrl} target="_blank" className="mt-8 inline-block text-sm font-semibold text-[#0d6f73]">
          Related link
        </a>
      ) : null}
    </main>
  );
}
