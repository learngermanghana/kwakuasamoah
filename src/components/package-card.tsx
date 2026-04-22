import { getWhatsAppLink, type ServiceItem } from "@/lib/data";
import Link from "next/link";

const MAX_DESCRIPTION_LENGTH = 120;

export function PackageCard({ item }: { item: ServiceItem }) {
  const description = item.description?.trim() || "";
  const isLongDescription = description.length > MAX_DESCRIPTION_LENGTH;
  const shortDescription = isLongDescription
    ? `${description.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`
    : description;

  const showPrice = Boolean(item.priceLabel && item.priceLabel.toLowerCase() !== "not provided");
  const priceText = item.priceLabel?.toLowerCase().startsWith("contact")
    ? item.priceLabel
    : `Starting from ${item.priceLabel}`;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="bg-slate-50 p-3">
        <img src={item.image} alt={item.serviceName} className="h-56 w-full rounded-xl object-contain" />
      </div>
      <div className="p-5">
        {item.category ? <p className="text-sm font-semibold text-emerald-700">{item.category}</p> : null}
        <h3 className="mt-1 text-xl font-bold">{item.serviceName}</h3>
        {description ? isLongDescription ? (
          <details className="mt-2 text-sm text-slate-600">
            <summary className="cursor-pointer list-none font-medium text-emerald-700">{shortDescription} Read more</summary>
            <p className="mt-2 whitespace-pre-line">{description}</p>
          </details>
        ) : (
          <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{shortDescription}</p>
        ) : null}
        {showPrice ? <p className="mt-3 text-sm text-slate-500">{priceText}</p> : null}
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
