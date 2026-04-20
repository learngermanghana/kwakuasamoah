import Link from "next/link";
import { mediaChannels } from "@/lib/site-content";

export default function MediaPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Media & Social Hub</h1>
        <p>Follow recent videos, reels, and travel education content across social platforms.</p>
      </section>

      <div className="grid cards-2">
        {mediaChannels.map((channel) => (
          <article key={channel.name} className="card stack">
            <h2>{channel.name}</h2>
            <p>{channel.handle}</p>
            <a href={channel.href} target="_blank" rel="noreferrer" className="button secondary">
              Visit Channel
            </a>
          </article>
        ))}
      </div>

      <Link className="button" href="/book-consultation">
        Start Your Process
      </Link>
    </section>
  );
}
