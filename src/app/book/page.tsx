import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { getServiceData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Choose a Sedifex service and submit your travel or relocation booking request."
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
    category: service.category
  }));

  return (
    <section className="bg-[#fffdf8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="inline-flex rounded-full bg-[#d8f2f1] px-3 py-1 text-sm font-semibold text-[#0d6f73]">
            Sedifex booking integration
          </p>
          <h1 className="mt-4 text-4xl font-bold text-[#0b2d4f] md:text-5xl">Book a Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Pick a service pulled from Sedifex, choose your preferred date and time, and submit your request. The booking will be saved directly into Sedifex for admin follow-up and confirmation.
          </p>

          <div className="mt-8 rounded-3xl border border-[#d8d6cf] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0b2d4f]">What happens after you submit?</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3"><span className="font-bold text-[#0d6f73]">1.</span><span>Your booking request is saved in Sedifex.</span></li>
              <li className="flex gap-3"><span className="font-bold text-[#0d6f73]">2.</span><span>The team reviews your selected service and preferred time.</span></li>
              <li className="flex gap-3"><span className="font-bold text-[#0d6f73]">3.</span><span>You receive follow-up instructions for confirmation or payment where needed.</span></li>
            </ol>
          </div>
        </div>

        <div>
          <BookingForm
            serviceOptions={serviceOptions}
            prefilledServiceId={params.serviceId}
            prefilledServiceName={params.serviceName}
          />
        </div>
      </div>
    </section>
  );
}
