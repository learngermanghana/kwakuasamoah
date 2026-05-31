import Link from "next/link";
import { getServiceData, type ServiceItem } from "@/lib/data";

const MAX_DESCRIPTION_LENGTH = 110;

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

function getShortDescription(service: ServiceItem) {
  const description = service.description?.trim() || "";

  if (!description) return "Open to read the full service details.";

  const plainText = description
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= MAX_DESCRIPTION_LENGTH) return plainText;

  return `${plainText.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`;
}

export default async function ServicesPage() {
  const services = removeDuplicateServices(await getServiceData());

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
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

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const serviceHref = `/services/${encodeURIComponent(service.id)}`;

          return (
            <article
              key={service.id}
              className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#d8d6cf] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Link href={serviceHref} className="block bg-[#f8f4ea] p-4">
                <div className="rounded-[1.25rem] bg-white p-3 shadow-sm">
                  <img
                    src={service.image}
                    alt={service.imageAlt || service.serviceName}
                    className="h-52 w-full rounded-2xl object-contain transition duration-300 hover:scale-[1.03]"
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                {service.category ? (
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0d6f73]">
                    {service.category}
                  </p>
                ) : null}

                <h2 className="mt-2 text-2xl font-black leading-snug text-[#0b2d4f]">
                  {service.serviceName}
                </h2>

                <p className="mt-2 text-sm font-bold text-[#0d6f73]">
                  {formatPriceLabel(service)}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {getShortDescription(service)}
                </p>

                <Link
                  href={serviceHref}
                  className="mt-auto inline-flex w-full justify-center rounded-2xl bg-[#0d6f73] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0a585c]"
                >
                  Open
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
