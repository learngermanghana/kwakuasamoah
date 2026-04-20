const faqs = [
  "Can you guarantee visa approval?",
  "Do you help with Netherlands and Schengen applications?",
  "Do you provide paid 1-on-1 consultations?",
  "What is your refund or cancellation policy?",
];

export default function FAQPage() {
  return (
    <section className="stack">
      <h1>Frequently Asked Questions</h1>
      <ul>
        {faqs.map((faq) => (
          <li key={faq}>{faq}</li>
        ))}
      </ul>
    </section>
  );
}
