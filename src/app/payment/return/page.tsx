import { siteConfig } from "@/lib/site-config";

export default function PaymentReturnPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Thanks — we received your booking details.</h1>
      <p className="mt-4 text-zinc-700">
        Your checkout session has returned successfully. A confirmation email with your booking details will be sent shortly.
      </p>
      <p className="mt-4 text-zinc-700">
        If you have further enquiries, contact us on WhatsApp or email:
        {" "}
        <a href={`https://wa.me/${siteConfig.whatsapp}`} className="font-medium text-zinc-900 underline underline-offset-2">
          WhatsApp
        </a>
        {" "}
        or
        {" "}
        <a href={`mailto:${siteConfig.email}`} className="font-medium text-zinc-900 underline underline-offset-2">
          {siteConfig.email}
        </a>
        .
      </p>
      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-lg font-semibold text-zinc-900">Tips to prepare for your booking day</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
          <li>Keep your booking reference and a valid ID ready.</li>
          <li>Check your email (including spam/junk) for updates from our team.</li>
          <li>Arrive early and bring any required travel or support documents.</li>
          <li>Have your phone on and reachable in case our team needs to contact you.</li>
        </ul>
      </div>
    </main>
  );
}
