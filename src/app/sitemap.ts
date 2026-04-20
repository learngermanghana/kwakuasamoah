import type { MetadataRoute } from "next";
import { navLinks } from "@/lib/site-content";
import { siteSettings } from "@/lib/site-settings";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return navLinks.map((link) => ({
    url: `${siteSettings.siteUrl}${link.href}`,
    lastModified: now,
    changeFrequency: link.href === "/" ? "weekly" : "monthly",
    priority: link.href === "/" ? 1 : 0.7,
  }));
}
