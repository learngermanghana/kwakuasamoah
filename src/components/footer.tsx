import Link from "next/link";
import { getSocialSettings } from "@/lib/data";

function ContactLink({ href, label }: { href: string; label: string }) {
  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export async function Footer() {
  const socialSettings = await getSocialSettings();
  const contactItems = [
    socialSettings.publicPhone
      ? {
          href: `tel:${socialSettings.publicPhone}`,
          label: socialSettings.publicPhone,
        }
      : null,
    socialSettings.whatsappNumber
      ? {
          href: `https://wa.me/${socialSettings.whatsappNumber.replace(/\D/g, "")}`,
          label: "WhatsApp",
        }
      : null,
    socialSettings.publicEmail
      ? {
          href: `mailto:${socialSettings.publicEmail}`,
          label: socialSettings.publicEmail,
        }
      : null,
    socialSettings.website
      ? { href: socialSettings.website, label: "Website" }
      : null,
    socialSettings.instagram
      ? { href: socialSettings.instagram, label: "Instagram" }
      : null,
    socialSettings.facebook
      ? { href: socialSettings.facebook, label: "Facebook" }
      : null,
    socialSettings.tiktok
      ? { href: socialSettings.tiktok, label: "TikTok" }
      : null,
    socialSettings.youtube
      ? { href: socialSettings.youtube, label: "YouTube" }
      : null,
    socialSettings.x ? { href: socialSettings.x, label: "X (Twitter)" } : null,
    socialSettings.linkedin
      ? { href: socialSettings.linkedin, label: "LinkedIn" }
      : null,
  ].filter((item): item is { href: string; label: string } =>
    Boolean(item?.href),
  );

  return (
    <footer className="border-t border-emerald-950 bg-npontu-surface-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold text-white">
            {socialSettings.displayName}
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-npontu-gold">
            {socialSettings.tagline}
          </p>
          <p className="mt-3 text-sm text-emerald-100/75">
            {socialSettings.businessDescription}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-npontu-gold">Quick Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-emerald-100/75">
            <Link href="/about" className="hover:text-npontu-gold transition">About</Link>
            <Link href="/services" className="hover:text-npontu-gold transition">Services</Link>
            <Link href="/contact" className="hover:text-npontu-gold transition">Contact</Link>
            <Link href="/terms" className="hover:text-npontu-gold transition">Terms</Link>
            <Link href="/privacy" className="hover:text-npontu-gold transition">Privacy</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-npontu-gold">Contact Us</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-emerald-100/75">
            {contactItems.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-npontu-gold transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-950/60 py-4 text-center text-xs text-emerald-500 bg-emerald-950/20">
        © {new Date().getFullYear()} {socialSettings.displayName}. All rights reserved.
      </div>
    </footer>
  );
}
