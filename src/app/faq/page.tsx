const faqs = [
  { q: "Do you guarantee visa approval?", a: "No. Guidance improves preparation, but no genuine service can guarantee approval." },
  { q: "Do you help with Netherlands relocation?", a: "Yes, especially for study route and travel guidance." },
  { q: "Can I book through WhatsApp?", a: "Yes. WhatsApp is one of the fastest support channels on this site." }
];

export default function FAQPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-2xl border p-5">
            <h2 className="text-lg font-semibold">{item.q}</h2>
            <p className="mt-2 text-slate-600">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
