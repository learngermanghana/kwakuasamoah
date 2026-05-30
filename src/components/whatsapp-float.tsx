import { getSocialSettings } from "@/lib/data";

export async function WhatsAppFloat() {
  const socialSettings = await getSocialSettings();
  const whatsappNumber = socialSettings.whatsappNumber.replace(/\D/g, "");

  if (whatsappNumber) {
    return (
      <a
        href={`https://wa.me/${whatsappNumber}`}
        className="fixed bottom-20 right-5 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700"
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp Us
      </a>
    );
  }

  return (
    <a
      href={`mailto:${socialSettings.publicEmail}`}
      className="fixed bottom-20 right-5 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700"
    >
      Email: {socialSettings.publicEmail}
    </a>
  );
}
