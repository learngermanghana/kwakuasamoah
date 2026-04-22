import { getServiceData } from "@/lib/data";
import { PackageCard } from "@/components/package-card";

export default async function ServicesPage() {
  const services = await getServiceData();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-4xl font-bold">Services</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {services.map((service) => <PackageCard key={service.id} item={service} />)}
      </div>
    </section>
  );
}
