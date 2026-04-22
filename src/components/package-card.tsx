import { getWhatsAppLink, type ServiceItem } from "@/lib/data";

export function PackageCard({ item }: { item: ServiceItem }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
      <div className="p-5">
        <p className="text-sm font-semibold text-emerald-700">{item.category}</p>
        <h3 className="mt-1 text-xl font-bold">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
        <p className="mt-3 text-sm text-slate-500">Starting from {item.priceLabel}</p>
        <div className="mt-4 flex gap-3">
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
