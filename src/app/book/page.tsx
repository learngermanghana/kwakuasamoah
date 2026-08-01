import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { getServiceData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Choose a service and submit your travel or relocation booking request."
};

export default async function BookPage({
  searchParams
}: {
  searchParams: Promise<{ serviceId?: string; serviceName?: string }>;
}) {
  const params = await searchParams;
  const services = await getServiceData();
  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.serviceName,
    priceLabel: service.priceLabel,
    price: service.price,
    category: service.category
  }));

  return (
    <section className="bg-npontu-surface-light developer-grid min-h-[80vh] py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-npontu-green/10 border border-npontu-green/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-npontu-green">
            Consultation booking
          </p>
          <h1 className="text-4xl font-extrabold text-npontu-green md:text-5xl tracking-tight">Book a Consultation</h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Pick a service, choose your preferred date and time, and submit your request. The team will review your booking for follow-up and confirmation.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">What happens after you submit?</h2>
            <div className="h-0.5 w-12 bg-npontu-gold my-3 rounded-full" />
            <ol className="mt-4 space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="font-bold text-npontu-green">1.</span>
                <span>Your booking request is securely logged in our system.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-npontu-green">2.</span>
                <span>The team reviews your selected service, notes, and preferred time window.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-npontu-green">3.</span>
                <span>You receive confirmation instructions and follow-up updates via email/WhatsApp.</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-tr from-npontu-green to-npontu-gold opacity-10 blur-xl rounded-3xl" />
          <div className="relative">
            <BookingForm
              serviceOptions={serviceOptions}
              prefilledServiceId={params.serviceId}
              prefilledServiceName={params.serviceName}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
