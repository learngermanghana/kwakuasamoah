import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
  { href: "/countries", label: "Countries" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-npontu-green/10 bg-[#F4F7F5]/85 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-npontu-gold shadow-sm transition group-hover:scale-105 duration-300">
            <Image src="/logo.jpg" alt="Kwaku Lottery logo" fill className="object-cover" priority />
          </div>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-npontu-green group-hover:text-npontu-green-light transition duration-150">
              {siteConfig.name}
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-npontu-gold-warm">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-700 hover:text-npontu-green transition duration-150 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-npontu-green after:transition-all after:duration-300 pb-1"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-xl bg-npontu-green hover:bg-npontu-green-light text-white text-xs font-bold px-4 py-2 shadow-sm transition duration-150 hover:-translate-y-[1px]"
          >
            Admin CRM
          </Link>
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
            <span aria-hidden="true" className="text-lg leading-none">☰</span>
            <span>Menu</span>
          </summary>
          <nav className="absolute right-0 mt-2 flex min-w-[12rem] flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-npontu-green"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-1 pt-1">
              <Link
                href="/admin"
                className="block text-center rounded-lg bg-npontu-green py-2 text-sm font-bold text-white transition hover:bg-npontu-green-light"
              >
                Admin CRM
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
