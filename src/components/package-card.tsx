import { type ServiceItem } from "@/lib/data";
import Link from "next/link";

const MAX_DESCRIPTION_LENGTH = 120;

function normalizePriceLabel(label: string) {
  return label
    .trim()
    .replace(/^(from|starting\s+from|starting)\s+/i, "")
    .replace(/^price\s*/i, "")
    .replace(/^service\s+(price|fee)\s*:?\s*/i, "");
}

function formatPriceLabel(item: ServiceItem) {
  if (item.priceLabel?.trim()) {
    return `Service price: ${normalizePriceLabel(item.priceLabel)}`;
  }

  if (typeof item.price === "number") {
    return `Service price: GHS ${item.price.toLocaleString()}`;
  }

  return "Service price confirmed after review";
}

export function PackageCard({ item }: { item: ServiceItem }) {
  const description = item.description?.trim() || "";
  const shortDescription =
    description.length > MAX_DESCRIPTION_LENGTH
      ? `${description.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`
      : description;
  const serviceHref = `/services/${encodeURIComponent(item.id)}`;
  const bookHref = `/book?serviceId=${encodeURIComponent(item.id)}&serviceName=${encodeURIComponent(item.serviceName)}`;
  const priceLabel = formatPriceLabel(item);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={serviceHref} className="block bg-[#f8f4ea] p-3">
        <img
          src={item.image}
          alt={item.serviceName}
          className="h-56 w-full rounded-xl object-cover transition duration-300 hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {item.category ? (
          <p className="text-xs font-bold uppercase tracking-wider text-npontu-gold-warm">{item.category}</p>
        ) : null}
        <Link href={serviceHref} className="mt-1 text-xl font-bold text-slate-800 transition hover:text-npontu-green">
          {item.serviceName}
        </Link>
        <p className="mt-2 text-sm font-semibold text-npontu-green">{priceLabel}</p>
        {description ? (
          <p className="mt-2 whitespace-pre-line text-sm text-slate-500">
            {shortDescription}
          </p>
        ) : null}
        <div className="mt-auto flex gap-3 pt-4">
          <Link
            href={serviceHref}
            className="rounded-xl border border-npontu-green/25 bg-npontu-surface-light px-4 py-2 text-sm font-bold text-npontu-green transition hover:bg-npontu-green/5"
          >
            Details
          </Link>
          <Link
            href={bookHref}
            className="rounded-xl bg-npontu-green px-4 py-2 text-sm font-bold text-white transition hover:bg-npontu-green-light"
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
