import Link from "next/link";

export default async function PaymentReturnPage({
  searchParams
}: {
  searchParams: Promise<{ reference?: string; clientOrderId?: string; bookingId?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Payment received.</h1>
      <p className="mt-4 text-zinc-700">
        Payment received. We are confirming your payment status. Please wait for confirmation.
      </p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
        <p><span className="font-semibold text-zinc-900">Reference:</span> {params.reference || "Not provided"}</p>
        <p><span className="font-semibold text-zinc-900">Client Order ID:</span> {params.clientOrderId || "Not provided"}</p>
        <p><span className="font-semibold text-zinc-900">Booking ID:</span> {params.bookingId || "Not provided"}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/book" className="rounded-lg bg-zinc-900 px-4 py-2 text-white">Book again</Link>
        <Link href="/contact" className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900">Contact support</Link>
      </div>
    </main>
  );
}
