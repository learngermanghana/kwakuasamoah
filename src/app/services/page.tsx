import Link from "next/link";
import { services } from "@/lib/site-content";

export default function ServicesPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Services</h1>
        <p>Pick the support option that matches your destination, timeline, and confidence level.</p>
      </section>

      <div className="grid cards-2">
        {services.map((service) => (
          <article key={service.title} className="card stack">
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <ul>
              {service.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="muted">Starting from {service.priceFrom}</p>
          </article>
        ))}
      </div>

      <section className="cta card row between wrap gap">
        <div>
          <h2>Need a custom plan?</h2>
          <p>Book a strategy consultation and get a personalized action roadmap.</p>
        </div>
        <Link className="button" href="/book-consultation">
          Book Consultation
        </Link>
      </section>
    </section>
  );
}
