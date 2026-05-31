import Link from "next/link";
import { getServiceData, type ServiceItem } from "@/lib/data";

function normalizeServiceKey(service: ServiceItem) {
  return service.serviceName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function removeDuplicateServices(services: ServiceItem[]) {
  const seen = new Set<string>();

  return services.filter((service) => {
    const key = normalizeServiceKey(service);

    if (!key) return true;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function normalizePriceLabel(label: string) {
  return label
    .trim()
    .replace(/^(from|starting\s+from|starting)\s+/i, "")
    .replace(/^price\s*/i, "")
    .replace(/^service\s+(price|fee)\s*:?\s*/i, "");
}

function formatPriceLabel(service: ServiceItem) {
  if (service.priceLabel?.trim()) {
    return `Service price: ${normalizePriceLabel(service.priceLabel)}`;
  }

  if (typeof service.price === "number") {
    return `Service price: GHS ${service.price.toLocaleString()}`;
  }

  return "Service price confirmed after review";
}

export default async function ServicesPage() {
  const services = removeDuplicateServices(await getServiceData());

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0d6f73]">
          Services
        </p>
        <h1 className="mt-3 text-4xl font-black text-[#0b2d4f]">
          Choose a service
        </h1>
        <p className="mt-3 text-slate-600">
          Open any service to read the full description and continue to booking.
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {services.map((service) => {
          const serviceHref = `/services/${encodeURIComponent(service.id)}`;

          return (
            <article
              key={service.id}
              className="rounded-[1.5rem] border border-[#d8d6cf] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:flex md:items-center md:justify-between md:gap-6"
            >
              <div>
                {service.category ? (
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0d6f73]">
                    {service.category}
                  </p>
                ) : null}
                <h2 className="mt-2 text-2xl font-black text-[#0b2d4f]">
                  {service.serviceName}
                </h2>
                <p className="mt-2 text-sm font-bold text-[#0d6f73]">
                  {formatPriceLabel(service)}
                </p>
              </div>

              <Link
                href={serviceHref}
                className="mt-5 inline-flex rounded-2xl bg-[#0d6f73] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0a585c] md:mt-0"
              >
                Open
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
