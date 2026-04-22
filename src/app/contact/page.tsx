import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const contactMethods = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    helper: "Best for detailed questions about consultation and relocation support."
  },
  {
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone}`,
    helper: "Ideal for urgent inquiries and direct communication."
  },
  {
    label: "WhatsApp",
    value: "Start Chat",
    href: `https://wa.me/${siteConfig.whatsapp}`,
    helper: "Fastest response channel for quick travel questions.",
    external: true
  }
];

const socialLinks = [
  { label: "TikTok", href: siteConfig.socials.tiktok },
  { label: "Instagram", href: siteConfig.socials.instagram },
  { label: "Facebook", href: siteConfig.socials.facebook },
  { label: "YouTube", href: siteConfig.socials.youtube }
];

export default function ContactPage() {
  return (
    <div>
      <section className="bg-[#0b2d4f]">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <p className="inline-block rounded-full border border-[#89d5d2]/40 bg-[#0d6f73]/40 px-3 py-1 text-sm font-semibold text-[#d9f7f5]">
            Contact Kwaku
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Let&apos;s plan your next travel move.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#f4f1e6]">
            Reach out for consultation, visa guidance, document support, and relocation planning for Europe, Canada,
            and the USA.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {contactMethods.map((method) => (
            <article key={method.label} className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0b2d4f]">{method.label}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{method.helper}</p>
              <a
                className="mt-4 inline-flex text-base font-semibold text-[#0d6f73] underline"
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noreferrer" : undefined}
              >
                {method.value}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 rounded-2xl border bg-[#f8f4ea] p-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-[#0b2d4f]">Before you message</h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li>Share your destination and travel purpose (visit, study, relocation).</li>
              <li>Mention your timeline and any upcoming embassy or travel deadlines.</li>
              <li>Include specific questions so you can get the most useful response quickly.</li>
            </ul>
            <div className="mt-6">
              <Link
                href="/book"
                className="rounded-2xl bg-[#0d6f73] px-6 py-3 font-semibold text-white transition hover:bg-[#0a5b5f]"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          <aside>
            <h3 className="text-lg font-bold text-[#0b2d4f]">Follow for daily updates</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="font-semibold text-[#0d6f73] underline">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
