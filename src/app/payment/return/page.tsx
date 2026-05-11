export default function PaymentReturnPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Thanks — we received your booking details.</h1>
      <p className="mt-4 text-zinc-700">
        Your checkout session has returned successfully. We are now waiting for Sedifex payment confirmation via webhook before marking your
        booking as paid.
      </p>
      <p className="mt-4 text-zinc-700">
        If you need help, contact our team on WhatsApp or email and share your booking reference for faster support.
      </p>
    </main>
  );
}
