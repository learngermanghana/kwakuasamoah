import { getWhatsAppLink, type ServiceItem } from "@/lib/data";
import Link from "next/link";

const MAX_DESCRIPTION_LENGTH = 120;

export function PackageCard({ item }: { item: ServiceItem }) {
  const isLongDescription = item.description.length > MAX_DESCRIPTION_LENGTH;
  const shortDescription = isLongDescription
    ? `${item.description.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`
    : item.description;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <img src={item.image} alt={item.serviceName} className="h-56 w-full object-cover" />
      <div className="p-5">
        <p className="text-sm font-semibold text-emerald-700">{item.category}</p>
        <h3 className="mt-1 text-xl font-bold">{item.serviceName}</h3>
        {isLongDescription ? (
          <details className="mt-2 text-sm text-slate-600">
            <summary className="cursor-pointer list-none font-medium text-emerald-700">{shortDescription} Read more</summary>
            <p className="mt-2">{item.description}</p>
          </details>
        ) : (
          <p className="mt-2 text-sm text-slate-600">{shortDescription}</p>
        )}
        <p className="mt-3 text-sm text-slate-500">Starting from {item.priceLabel}</p>
        <div className="mt-4 flex gap-3">
          <a
            href={getWhatsAppLink(`Hello, I want to ask about ${item.serviceName}.`)}
            target="_blank"
            className="rounded-xl border px-4 py-2 text-sm font-medium"
          >
            WhatsApp
          </a>
          <Link
            href={`/book?serviceName=${encodeURIComponent(item.serviceName)}`}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
