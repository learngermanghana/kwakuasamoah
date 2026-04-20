import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="stack-lg">
      <section className="card stack">
        <h1>About Kwaku</h1>
        <p>
          Kwaku is a Ghanaian creator who relocated to the Netherlands through studies and now helps
          others navigate travel and relocation with practical, honest guidance.
        </p>
        <p>
          The mission is simple: turn confusion into a step-by-step action plan for people moving or
          traveling to Europe.
        </p>
      </section>

      <section className="card stack">
        <h2>Who We Support</h2>
        <ul>
          <li>Students preparing for study routes in Europe</li>
          <li>First-time travelers planning Schengen applications</li>
          <li>Families and professionals planning relocation transitions</li>
        </ul>
      </section>

      <section className="card stack">
        <h2>Trust & Transparency</h2>
        <p>
          Guidance and preparation support are provided based on experience and planning frameworks.
          Visa decisions are always made by official authorities.
        </p>
        <p className="muted">
          Disclaimer: No service provided here guarantees visa approvals.
        </p>
        <Link className="button" href="/book-consultation">
          Start With a Consultation
        </Link>
      </section>
    </section>
  );
}
