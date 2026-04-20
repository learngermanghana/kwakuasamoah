import { siteSettings } from "@/lib/site-settings";

export function WhatsAppCTA() {
  const normalizedPhone = siteSettings.whatsappNumber.replace(/\D/g, "");

  return (
    <a
      className="whatsapp"
      href={`https://wa.me/${normalizedPhone}?text=Hi%20Kwaku%2C%20I%20need%20help%20with%20travel%20or%20relocation.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      WhatsApp
    </a>
  );
}
