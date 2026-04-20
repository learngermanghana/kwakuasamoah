import { siteConfig } from "./site-config";
import { packages } from "@/data/packages";

export async function getPackageData() {
  return packages;
}

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
