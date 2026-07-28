import Link from "next/link";
import { getSocialSettings } from "@/lib/data";

export async function Footer() {
  const socialSettings = await getSocialSettings();
  
  const contactItems = [
    socialSettings.publicPhone ? { href: `tel:${socialSettings.publicPhone}`, label: `📞 ${socialSettings.publicPhone}` } : null,
    socialSettings.whatsappNumber ? { href: `https://wa.me/${socialSettings.whatsappNumber.replace(/\D/g, "")}`, label: "💬 WhatsApp Chat" } : null,
    socialSettings.publicEmail ? { href: `mailto:${socialSettings.publicEmail}`, label: `✉️ ${socialSettings.publicEmail}` } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  const socials = [
    socialSettings.tiktok ? { href: socialSettings.tiktok, label: "TikTok" } : null,
    socialSettings.instagram ? { href: socialSettings.instagram, label: "Instagram" } : null,
    socialSettings.facebook ? { href: socialSettings.facebook, label: "Facebook" } : null,
    socialSettings.youtube ? { href: socialSettings.youtube, label: "YouTube" } : null,
    socialSettings.x ? { href: socialSettings.x, label: "X / Twitter" } : null,
    socialSettings.linkedin ? { href: socialSettings.linkedin, label: "LinkedIn" } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <footer className="bg-[#0B1510] text-white border-t border-emerald-950/60 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-16 grid gap-12 md:grid-cols-4">
        {/* Info Col */}
        <div className="space-y-4 md:col-span-2">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white tracking-tight">{socialSettings.displayName}</h3>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-npontu-gold">
              {socialSettings.tagline}
            </span>
          </div>
          <p className="text-sm text-emerald-100/70 leading-relaxed max-w-sm">
            {socialSettings.businessDescription}
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-npontu-gold">Quick Links</h4>
          <nav className="flex flex-col space-y-2.5 text-sm text-emerald-100/70">
            <Link href="/" className="hover:text-npontu-gold transition duration-150">Home</Link>
            <Link href="/services" className="hover:text-npontu-gold transition duration-150">Services</Link>
            <Link href="/book" className="hover:text-npontu-gold transition duration-150">Book Now</Link>
            <Link href="/blog" className="hover:text-npontu-gold transition duration-150">Blog Updates</Link>
            <Link href="/contact" className="hover:text-npontu-gold transition duration-150">Contact Us</Link>
          </nav>
        </div>

        {/* Support channels */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-npontu-gold">Get in Touch</h4>
          <div className="flex flex-col space-y-2.5 text-sm text-emerald-100/70">
            {contactItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-npontu-gold transition duration-150"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-npontu-gold/60 mb-2">Follow Us</h5>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-emerald-100/60">
              {socials.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-npontu-gold transition duration-150 hover:underline"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-emerald-950/60 bg-black/20 py-6 text-center text-xs text-emerald-600/80">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} {socialSettings.displayName}. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-npontu-gold transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-npontu-gold transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
