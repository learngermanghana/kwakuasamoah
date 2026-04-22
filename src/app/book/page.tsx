export default async function BookPage({
  searchParams
}: {
  searchParams: Promise<{ serviceName?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Book a Consultation</h1>
      <form action="/api/integration-bookings" method="post" className="mt-8 space-y-4">
        <input name="customerName" placeholder="Full Name" className="w-full rounded-xl border px-4 py-3" required />
        <input name="customerEmail" type="email" placeholder="Email" className="w-full rounded-xl border px-4 py-3" />
        <input name="customerPhone" placeholder="Phone / WhatsApp" className="w-full rounded-xl border px-4 py-3" required />
        <input
          name="serviceName"
          placeholder="Service Needed"
          defaultValue={params.serviceName || ""}
          className="w-full rounded-xl border px-4 py-3"
        />
        <input name="bookingDate" placeholder="Travel Date" className="w-full rounded-xl border px-4 py-3" />
        <textarea name="notes" placeholder="Tell us what you need help with" className="min-h-40 w-full rounded-xl border px-4 py-3" required></textarea>
        <button type="submit" className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white">
          Book on Sedifex
        </button>
      </form>
    </section>
  );
}
