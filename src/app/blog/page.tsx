import Link from "next/link";
import { blogPosts } from "@/lib/site-content";

export default function BlogPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Travel Updates Blog</h1>
        <p>Practical guides based on real relocation and visa preparation questions.</p>
      </section>

      <div className="grid cards-2">
        {blogPosts.map((post) => (
          <article key={post.title} className="card stack">
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <p className="muted">Full article coming soon.</p>
          </article>
        ))}
      </div>

      <Link className="button" href="/book-consultation">
        Ask About Your Situation
      </Link>
    </section>
  );
}
