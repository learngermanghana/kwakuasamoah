import { getWhatsAppLink } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export function WhatsAppFloat() {
  return (
    <>
      <a
        href={`mailto:${siteConfig.email}`}
        className="fixed bottom-20 right-5 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700"
      >
        Email: {siteConfig.email}
      </a>
      <a
        href={getWhatsAppLink("Hello, I want travel or relocation support.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 rounded-full bg-[#0d6f73] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0a585c]"
      >
        Chat on WhatsApp
      </a>
    </>
  );
}
