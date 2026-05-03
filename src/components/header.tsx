import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/countries", label: "Countries" },
  { href: "/resources", label: "Resources" },
  { href: "/book", label: "Book" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d8d6cf] bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-[#0b2d4f]">
          <Image src="/logo-mark.svg" alt="Kwaku Lottery logo" width={36} height={36} priority />
          <span className="leading-tight">
            <span className="block text-lg font-bold">{siteConfig.name}</span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0d6f73]">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 transition hover:text-[#0d6f73]">
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-[#d8d6cf] bg-white px-3 py-2 text-sm font-medium text-slate-700">
            <span aria-hidden="true" className="text-lg leading-none">☰</span>
            <span>Menu</span>
          </summary>
          <nav className="absolute right-0 mt-2 flex min-w-[10rem] flex-col rounded-md border border-[#d8d6cf] bg-white p-2 shadow-lg">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#f5f7f8] hover:text-[#0d6f73]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
