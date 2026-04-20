import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppCTA } from "@/components/whatsapp-cta";

export const metadata: Metadata = {
  title: "Kwaku Travel & Relocation",
  description: "Relocate, travel, and explore Europe with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container page">{children}</main>
        <Footer />
        <WhatsAppCTA />
      </body>
    </html>
  );
}
