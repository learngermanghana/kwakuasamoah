import Link from "next/link";
import { navLinks } from "@/lib/site-content";

export function Header() {
  return (
    <header className="site-header">
      <div className="container row between">
        <Link href="/" className="brand">
          Kwaku Travel & Relocation
        </Link>
        <nav className="nav">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
