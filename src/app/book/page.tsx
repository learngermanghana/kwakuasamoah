export default function BookPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Book a Consultation</h1>
      <form action="/api/inquiries" method="post" className="mt-8 space-y-4">
        <input name="name" placeholder="Full Name" className="w-full rounded-xl border px-4 py-3" required />
        <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border px-4 py-3" required />
        <input name="phone" placeholder="Phone / WhatsApp" className="w-full rounded-xl border px-4 py-3" required />
        <input name="destination" placeholder="Preferred Destination" className="w-full rounded-xl border px-4 py-3" />
        <input name="travelDates" placeholder="Travel Dates" className="w-full rounded-xl border px-4 py-3" />
        <textarea name="message" placeholder="Tell us what you need help with" className="min-h-40 w-full rounded-xl border px-4 py-3" required></textarea>
        <button type="submit" className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white">
          Submit Inquiry
        </button>
      </form>
    </section>
  );
}
