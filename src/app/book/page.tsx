import { BookingForm } from "@/components/booking-form";
import { getServiceData } from "@/lib/data";

export default async function BookPage({
  searchParams
}: {
  searchParams: Promise<{ serviceName?: string }>;
}) {
  const params = await searchParams;
  const services = await getServiceData();

  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.serviceName
  }));

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Book a Consultation</h1>
      <p className="mt-3 text-zinc-600">Choose to pay immediately via secure checkout or submit a manual payment booking request.</p>
      <BookingForm serviceOptions={serviceOptions} prefilledServiceName={params.serviceName} />
    </section>
  );
}
