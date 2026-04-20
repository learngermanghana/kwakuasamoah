import Link from "next/link";
import { testimonials } from "@/lib/site-content";

export default function TestimonialsPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Testimonials & Success Stories</h1>
        <p>Real feedback from people supported through travel preparation and relocation planning.</p>
      </section>

      <div className="grid cards-3">
        {testimonials.map((story) => (
          <article key={story.name} className="card stack">
            <p>“{story.quote}”</p>
            <p className="muted">
              {story.name} — {story.result}
            </p>
          </article>
        ))}
      </div>

      <section className="card stack">
        <h2>Want results like these?</h2>
        <p>Start with a consultation and get a clear next-step roadmap for your case.</p>
        <Link className="button" href="/book-consultation">
          Book Consultation
        </Link>
      </section>
    </section>
  );
}
