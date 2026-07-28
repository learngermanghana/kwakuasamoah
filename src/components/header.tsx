"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Now" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-slate-700 hover:text-npontu-green transition duration-150 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-npontu-green after:transition-all after:duration-300 pb-1"
            >
              {item.label}
            </Link>
          ))}
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
          isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#F4F7F5] hover:text-npontu-green transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
