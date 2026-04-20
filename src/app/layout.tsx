import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppCTA } from "@/components/whatsapp-cta";
import { siteSettings, socialProfiles } from "@/lib/site-settings";

export const metadata: Metadata = {
  metadataBase: new URL(siteSettings.siteUrl),
  title: {
    default: siteSettings.brandName,
    template: `%s | ${siteSettings.brandName}`,
  },
  description:
    "Relocate, travel, and explore Europe with confidence through personalized consultation and trip planning.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteSettings.brandName,
    description:
      "Relocation and travel guidance for students, first-time travelers, and families moving to Europe.",
    url: siteSettings.siteUrl,
    siteName: siteSettings.brandName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteSettings.brandName,
    description:
      "Personalized support for visa preparation, travel planning, and Europe relocation.",
  },
  category: "travel",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteSettings.brandName,
  url: siteSettings.siteUrl,
  email: siteSettings.supportEmail,
  areaServed: siteSettings.serviceRegion,
  sameAs: socialProfiles,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Header />
        <main className="container page">{children}</main>
        <Footer />
        <WhatsAppCTA />
      </body>
    </html>
  );
}
