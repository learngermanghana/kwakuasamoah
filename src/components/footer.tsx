import Link from "next/link";
import { getCachedSocialSettings } from "@/lib/cached-content";

function ContactLink({ href, label }: { href: string; label: string }) {
  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export async function Footer() {
  const socialSettings = await getCachedSocialSettings();
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
    <footer className="border-t border-[#d8d6cf] bg-[#f8f4ea]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-[#0b2d4f]">
            {socialSettings.displayName}
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0d6f73]">
            {socialSettings.tagline}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {socialSettings.businessDescription}
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact Us</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            {contactItems.map((item) => (
              <ContactLink
                key={`${item.label}-${item.href}`}
                href={item.href}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
