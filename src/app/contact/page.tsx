import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Contact</h1>
      <div className="mt-8 space-y-3 text-slate-600">
        <p>Email: {siteConfig.email}</p>
        <p>Phone: {siteConfig.phone}</p>
        <p>
          WhatsApp: <a className="text-emerald-700 underline" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank">Start Chat</a>
        </p>
      </div>
    </section>
  );
}
