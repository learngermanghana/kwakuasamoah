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
      <p className="mt-3 text-zinc-600">For enquiries, please use WhatsApp or email. Booking is a paid service and payment is used to secure your consultation and provide further information on your selected service. Please read our Terms and Conditions and Privacy Policy before booking.</p>
      <BookingForm serviceOptions={serviceOptions} prefilledServiceName={params.serviceName} />
    </section>
  );
}
