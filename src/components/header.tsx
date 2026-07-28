"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const ChevronIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const mainNav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/book", label: "Book Now" },
    { href: "/contact", label: "Contact" }
  ];

  const submenuNav = [
    { href: "/countries", label: "Countries Visited" },
    { href: "/resources", label: "Travel Resources" },
    { href: "/faq", label: "FAQ Guides" },
    { href: "/blog", label: "Blog Updates" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-npontu-green/10 bg-[#F4F7F5]/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand Logo */}
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-slate-700 hover:text-npontu-green transition duration-150 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-npontu-green after:transition-all after:duration-300 pb-1"
            >
              {item.label}
            </Link>
          ))}

          {/* Submenu Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-npontu-green transition duration-150 pb-1 focus:outline-none cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Relocation Info</span>
              <ChevronIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-npontu-green" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-[100%] right-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                {submenuNav.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className="block rounded-lg px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#F4F7F5] hover:text-npontu-green transition"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="flex flex-col justify-center items-center md:hidden w-8 h-8 rounded-lg border border-slate-200 bg-white shadow-sm gap-1.5 focus:outline-none"
        >
          <span className={`w-4 h-0.5 bg-slate-700 transition duration-300 ${isOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-4 h-0.5 bg-slate-700 transition duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`w-4 h-0.5 bg-slate-700 transition duration-300 ${isOpen ? "-rotate-45 -translate-y-1" : ""}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden absolute top-[100%] left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#F4F7F5] hover:text-npontu-green transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Submenu Headers */}
          <div className="border-t border-slate-100 pt-2 mt-2">
            <span className="block px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">Relocation Info</span>
            {submenuNav.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-6 py-2 text-sm font-bold text-slate-600 hover:bg-[#F4F7F5] hover:text-npontu-green transition"
              >
                {subItem.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 p-4 mt-2">
            <a
              href="https://www.sedifex.com/join-customers/e8e4f544fca24533843b88ba"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center rounded-lg bg-[#0d6f73] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0a585c] transition"
            >
              Join our mailing list
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
