import Link from "next/link";
import { getSocialSettings } from "@/lib/data";

function SocialIcon({ type, size = 24, className = "" }: { type: string; size?: number; className?: string }) {
  switch (type.toLowerCase()) {
    case "facebook":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
          <polygon points="10 15 15 12 10 9" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case "twitter":
    case "x":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      );
    default:
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}

export async function Footer() {
  const socialSettings = await getSocialSettings();

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Countries", path: "/countries" },
    { name: "Book Now", path: "/book" },
    { name: "Blog Updates", path: "/blog" },
    { name: "Resources", path: "/resources" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" },
  ];

  const images = socialSettings.footerImages || [];

  return (
    <footer className="bg-[#080F0C] text-white border-t border-emerald-950/60 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Logo & Info */}
          <div className="md:col-span-3 space-y-4">
            <Link href="/" className="flex items-center gap-1">
              <span className="font-sans text-xl font-extrabold tracking-widest text-white">
                KWAKU
              </span>
              <span className="font-sans text-xl font-light opacity-60 tracking-widest text-npontu-gold">
                LOTTERYY
              </span>
            </Link>
            <p className="text-xs text-emerald-100/60 leading-relaxed max-w-xs">
              {socialSettings.businessDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-npontu-gold mb-4">Quick Links</h4>
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="block text-base opacity-90 hover:text-npontu-gold hover:opacity-100 transition-all duration-150"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Images Gallery & Socials */}
          <div className="md:col-span-7 space-y-6">
            <div className="grid grid-cols-4 gap-0 rounded-lg overflow-hidden border border-emerald-900/40">
              {images.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative aspect-[3/4] overflow-hidden group"
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <img
                        src={item.url}
                        alt={`Footer Image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <SocialIcon type={item.overlay} size={24} className="text-white mb-2" />
                        <span className="text-white text-xs font-semibold uppercase tracking-wider">
                          @{item.overlay}
                        </span>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Underline & Call to Action text */}
            <div className="text-right">
              <p className="text-xl italic text-white/90 font-serif">
                Connect with me on social
              </p>
              {/* Decorative underline */}
              <div className="flex justify-end mt-2">
                <svg viewBox="0 0 200 20" className="w-48 h-5" fill="none">
                  <path
                    d="M5 15 Q50 5 100 10 Q150 15 195 5"
                    stroke="#F3BA00"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-950/60 text-center flex flex-col md:flex-row items-center justify-between gap-4 text-emerald-600/70 text-sm">
          <p>© {new Date().getFullYear()} Kwaku Lotteryy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-npontu-gold transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-npontu-gold transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
