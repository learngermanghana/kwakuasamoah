import Link from "next/link";
import { packages } from "@/lib/site-content";

export default function PackagesPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Packages</h1>
        <p>Productized offers designed for clear outcomes, transparent scope, and faster decisions.</p>
      </section>

      <div className="grid cards-2">
        {packages.map((pkg) => (
          <article key={pkg.name} className="card stack">
            <h2>{pkg.name}</h2>
            <p>{pkg.outcome}</p>
            <p>
              <strong>Best for:</strong> {pkg.bestFor}
            </p>
            <p className="muted">Price: {pkg.price}</p>
          </article>
        ))}
      </div>

      <Link className="button" href="/book-consultation">
        Discuss the Right Package
      </Link>
    </section>
  );
}
