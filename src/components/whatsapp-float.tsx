import { siteConfig } from "@/lib/site-config";

export function WhatsAppFloat() {
  return (
    <a
      href={`mailto:${siteConfig.email}`}
      className="fixed bottom-20 right-5 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700"
    >
      Email: {siteConfig.email}
    </a>
  );
}
