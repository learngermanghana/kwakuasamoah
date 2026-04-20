import Link from "next/link";
import { siteSettings } from "@/lib/site-settings";

export default function ContactPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Contact</h1>
        <p>Reach out for partnerships, support questions, or booking help.</p>
      </section>

      <section className="card stack">
        <p>
          <strong>Email:</strong> {siteSettings.supportEmail}
        </p>
        <p>
          <strong>WhatsApp:</strong> {siteSettings.whatsappDisplay}
        </p>
        <p>
          <strong>Hours:</strong> Monday - Saturday, 09:00 - 18:00 {siteSettings.timezone}
        </p>
        <Link className="button" href="/book-consultation">
          Book Consultation
        </Link>
      </section>
    </section>
  );
}
