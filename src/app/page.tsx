import Link from "next/link";
import { destinations, packages, services, testimonials } from "@/lib/site-content";

export default function HomePage() {
  return (
    <section className="stack-lg">
      <section className="hero card">
        <p className="eyebrow">Personal Brand Travel Platform</p>
        <h1>Relocate, Travel, and Explore Europe with Confidence</h1>
        <p>
          Trusted guidance from Kwaku for students, first-time travelers, and families who want to plan
          Europe journeys with clarity.
        </p>
        <div className="row wrap gap">
          <Link className="button" href="/book-consultation">
            Book Consultation
          </Link>
          <Link className="button secondary" href="/services">
            Explore Services
          </Link>
        </div>
      </section>

      <section className="stack">
        <h2>Featured Services</h2>
        <div className="grid cards-2">
          {services.map((service) => (
            <article key={service.title} className="card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p className="muted">Starting from {service.priceFrom}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>Popular Packages</h2>
        <div className="grid cards-2">
          {packages.map((item) => (
            <article key={item.name} className="card">
              <h3>{item.name}</h3>
              <p>{item.outcome}</p>
              <p className="muted">Ideal for: {item.bestFor}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>Focus Destinations</h2>
        <div className="chips">
          {destinations.map((country) => (
            <span key={country.name} className="chip">
              {country.name}
            </span>
          ))}
        </div>
      </section>

      <section className="stack">
        <h2>Recent Success Stories</h2>
        <div className="grid cards-3">
          {testimonials.map((story) => (
            <article key={story.name} className="card">
              <p>“{story.quote}”</p>
              <p className="muted">
                {story.name} — {story.result}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
