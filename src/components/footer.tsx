import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-[#d8d6cf] bg-[#f8f4ea]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-[#0b2d4f]">{siteConfig.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0d6f73]">{siteConfig.tagline}</p>
          <p className="mt-2 text-sm text-slate-600">
            Travel guidance and relocation support worldwide.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/book">Book Consultation</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a href={siteConfig.socials.x} target="_blank" rel="noreferrer">X</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
