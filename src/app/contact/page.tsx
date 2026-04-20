import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Contact</h1>
        <p>Reach out for partnerships, support questions, or booking help.</p>
      </section>

      <section className="card stack">
        <p>
          <strong>Email:</strong> hello@kwakutravels.com
        </p>
        <p>
          <strong>WhatsApp:</strong> +31 600 000 000
        </p>
        <p>
          <strong>Hours:</strong> Monday - Saturday, 09:00 - 18:00 CET
        </p>
        <Link className="button" href="/book-consultation">
          Book Consultation
        </Link>
      </section>
    </section>
  );
}
