import Link from "next/link";
import { destinations } from "@/lib/site-content";

export default function DestinationsPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Destinations</h1>
        <p>Country-specific planning support for travel, studies, and relocation transitions.</p>
      </section>

      <div className="grid cards-3">
        {destinations.map((destination) => (
          <article key={destination.name} className="card stack">
            <h2>{destination.name}</h2>
            <p>{destination.highlights}</p>
            <p className="muted">Typical budget: {destination.averageBudget}</p>
          </article>
        ))}
      </div>

      <section className="card stack">
        <h2>Not sure where to start?</h2>
        <p>
          We can compare destination options based on your budget, timeline, and travel purpose.
        </p>
        <Link className="button" href="/book-consultation">
          Get Destination Guidance
        </Link>
      </section>
    </section>
  );
}
