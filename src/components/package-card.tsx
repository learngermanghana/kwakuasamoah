import Link from "next/link";
import { getWhatsAppLink } from "@/lib/data";
import type { TravelPackage } from "@/data/packages";

export function PackageCard({ item }: { item: TravelPackage }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
      <div className="p-5">
        <p className="text-sm font-semibold text-emerald-700">{item.destination}</p>
        <h3 className="mt-1 text-xl font-bold">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
        <p className="mt-3 text-sm text-slate-500">Starting from {item.priceFrom}</p>
        <div className="mt-4 flex gap-3">
          <Link href={`/packages/${item.slug}`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            View Details
          </Link>
          <a
            href={getWhatsAppLink(`Hello, I want to ask about ${item.title}.`)}
            target="_blank"
            className="rounded-xl border px-4 py-2 text-sm font-medium"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
