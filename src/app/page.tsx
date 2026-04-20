import Link from "next/link";
import { destinations, packages, services } from "@/lib/site-content";

export default function HomePage() {
  return (
    <section className="stack">
      <p className="eyebrow">Personal Brand Travel Platform</p>
      <h1>Relocate, Travel, and Explore Europe with Confidence</h1>
      <p>
        Guidance, bookings, and trusted travel updates from Kwaku for students, first-time travelers,
        and families planning their Europe journey.
      </p>
      <div className="row wrap gap">
        <Link className="button" href="/book-consultation">
          Book Consultation
        </Link>
        <Link className="button secondary" href="/services">
          View Services
        </Link>
      </div>

      <h2>Featured Services</h2>
      <ul>
        {services.slice(0, 4).map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>

      <h2>Popular Packages</h2>
      <ul>
        {packages.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Focus Destinations</h2>
      <div className="chips">
        {destinations.map((country) => (
          <span key={country} className="chip">
            {country}
          </span>
        ))}
      </div>
    </section>
  );
}
