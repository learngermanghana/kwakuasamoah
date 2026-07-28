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
    <section className="bg-npontu-surface-light developer-grid min-h-[85vh] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-npontu-gold-warm">
            Services
          </p>
          <h1 className="text-4xl font-extrabold text-npontu-green tracking-tight">
            Choose a service
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Open any service to read the full description and continue to booking.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const serviceHref = `/services/${encodeURIComponent(service.id)}`;

            return (
              <article
                key={service.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5"
              >
                <Link href={serviceHref} className="block bg-[#f8f4ea] p-4">
                  <div className="rounded-xl overflow-hidden bg-white p-2 shadow-sm">
                    <img
                      src={service.image}
                      alt={service.imageAlt || service.serviceName}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6 space-y-3">
                  {service.category ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-npontu-gold-warm">
                      {service.category}
                    </span>
                  ) : null}

                  <h2 className="text-xl font-bold leading-snug text-slate-800 group-hover:text-npontu-green transition duration-150">
                    {service.serviceName}
                  </h2>

                  <p className="text-sm font-semibold text-npontu-green">
                    {formatPriceLabel(service)}
                  </p>

                  <div className="mt-auto pt-4">
                    <Link
                      href={serviceHref}
                      className="inline-flex w-full justify-center rounded-xl bg-npontu-green hover:bg-npontu-green-light py-3 text-sm font-bold text-white transition duration-150"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
