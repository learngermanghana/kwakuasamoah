import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Contact</h1>
      <div className="mt-8 space-y-3 text-slate-600">
        <p>Email: <a className="text-emerald-700 underline" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
        <p>Phone: <a className="text-emerald-700 underline" href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a></p>
        <p>
          WhatsApp: <a className="text-emerald-700 underline" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">Start Chat</a>
        </p>
        <p>TikTok: <a className="text-emerald-700 underline" href={siteConfig.socials.tiktok} target="_blank" rel="noreferrer">{siteConfig.socials.tiktok}</a></p>
        <p>Instagram: <a className="text-emerald-700 underline" href={siteConfig.socials.instagram} target="_blank" rel="noreferrer">{siteConfig.socials.instagram}</a></p>
        <p>Facebook: <a className="text-emerald-700 underline" href={siteConfig.socials.facebook} target="_blank" rel="noreferrer">{siteConfig.socials.facebook}</a></p>
      </div>
    </section>
  );
}
