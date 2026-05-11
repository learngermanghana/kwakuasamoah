export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-zinc-700">
        We respect your privacy. Any information you share with Kwaku Lotteryy is used only to provide consultation,
        booking support, and service updates.
      </p>

      <div className="mt-8 space-y-6 text-zinc-700">
        <div>
          <h2 className="text-xl font-semibold">Information we collect</h2>
          <p className="mt-2">
            We may collect your name, email, phone/WhatsApp number, selected service, and any details you provide
            during inquiries or booking.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">How we use your information</h2>
          <p className="mt-2">
            Your information helps us respond to inquiries, process paid bookings, and provide further details
            about your selected service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Data sharing</h2>
          <p className="mt-2">
            We do not sell your personal information. Data is only shared when necessary to deliver services or
            complete payment-related processes.
          </p>
        </div>
      </div>
    </section>
  );
}
