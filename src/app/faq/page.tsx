import { faqs } from "@/lib/site-content";

export default function FAQPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Frequently Asked Questions</h1>
        <p>Answers to the most common questions about process, timelines, and support scope.</p>
      </section>

      <div className="stack">
        {faqs.map((faq) => (
          <article key={faq.question} className="card stack">
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
