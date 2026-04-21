import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-emerald-700">{siteConfig.name}</h3>
          <p className="mt-2 text-sm text-slate-600">
            Trusted travel guidance and relocation consultation for Europe, Canada, and the USA (Asia excluded).
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/packages">Packages</Link>
            <Link href="/book">Book Consultation</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <a href={`https://wa.me/${siteConfig.whatsapp}`}>WhatsApp</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={siteConfig.socials.youtube} target="_blank">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
