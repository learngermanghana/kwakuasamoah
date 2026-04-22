import { siteConfig } from "./site-config";
import { packages } from "@/data/packages";

const SEDIFEX_CONTRACT_VERSION = "2026-04-13";

export async function getPackageData() {
  return packages;
}

type SedifexItem = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  price?: number;
  itemType?: string;
  imageUrl?: string;
  imageUrls?: string[];
  imageAlt?: string;
};

type SedifexProductsResponse = {
  products?: SedifexItem[];
  publicProducts?: SedifexItem[];
  publicServices?: SedifexItem[];
};

type SedifexGalleryItem = {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  sortOrder?: number;
  isPublished?: boolean;
};

type SedifexGalleryResponse = {
  gallery?: SedifexGalleryItem[];
};

export type ServiceItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  priceLabel: string;
  image: string;
  imageAlt: string;
};

export type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  caption: string;
};

const defaultServices: ServiceItem[] = packages.map((pkg) => ({
  id: pkg.slug,
  title: pkg.title,
  category: pkg.destination,
  description: pkg.summary,
  priceLabel: pkg.priceFrom,
  image: pkg.image,
  imageAlt: pkg.title
}));

const defaultGallery: GalleryItem[] = defaultServices.slice(0, 6).map((service) => ({
  id: service.id,
  url: service.image,
  alt: service.imageAlt,
  caption: service.title
}));

function getSedifexConfig() {
  const baseUrl = process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY;
  const storeId = process.env.SEDIFEX_STORE_ID;

  return { baseUrl, apiKey, storeId };
}

function mapSedifexItem(item: SedifexItem): ServiceItem {
  return {
    id: item.id,
    title: item.name,
    category: item.category || "Service",
    description: item.description || "Professional support tailored to your travel and relocation goals.",
    priceLabel: typeof item.price === "number" ? `From ${item.price}` : "Contact for price",
    image: item.imageUrl || item.imageUrls?.[0] || "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format&fit=crop",
    imageAlt: item.imageAlt || item.name
  };
}

function mapSedifexGalleryItem(item: SedifexGalleryItem): GalleryItem {
  return {
    id: item.id,
    url: item.url,
    alt: item.alt || item.caption || "Store gallery image",
    caption: item.caption || ""
  };
}

export async function getServiceData() {
  const { baseUrl, apiKey, storeId } = getSedifexConfig();

  if (!baseUrl || !apiKey || !storeId) {
    return defaultServices;
  }

  const endpoint = new URL("/v1IntegrationProducts", baseUrl);
  endpoint.searchParams.set("storeId", storeId);

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-api-key": apiKey,
        "X-Sedifex-Contract-Version": SEDIFEX_CONTRACT_VERSION,
        Accept: "application/json"
      },
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      return defaultServices;
    }

    const payload = (await response.json()) as SedifexProductsResponse;
    const items =
      payload.publicServices?.length
        ? payload.publicServices
        : (payload.products || []).filter((item) => item.itemType === "service");

    if (!items.length) {
      return defaultServices;
    }

    return items.map(mapSedifexItem);
  } catch {
    return defaultServices;
  }
}

export async function getGalleryData() {
  const { baseUrl, storeId } = getSedifexConfig();

  if (!baseUrl || !storeId) {
    return defaultGallery;
  }

  const endpoint = new URL("/integrationGallery", baseUrl);
  endpoint.searchParams.set("storeId", storeId);

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return defaultGallery;
    }

    const payload = (await response.json()) as SedifexGalleryResponse;
    const galleryItems = (payload.gallery || [])
      .filter((item) => item.isPublished !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    if (!galleryItems.length) {
      return defaultGallery;
    }

    return galleryItems.slice(0, 8).map(mapSedifexGalleryItem);
  } catch {
    return defaultGallery;
  }
}

export type YouTubeVideo = {
  id: string;
  title: string;
  link: string;
  published: string;
  thumbnail: string;
};

export async function getYouTubeVideos() {
  const fallback: YouTubeVideo[] = [];

  try {
    const channelPage = await fetch(siteConfig.socials.youtube, { cache: "no-store" });
    if (!channelPage.ok) return fallback;

    const html = await channelPage.text();
    const channelIdMatch = html.match(/"channelId":"(UC[^"]+)"/);
    if (!channelIdMatch) return fallback;

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdMatch[1]}`;
    const feedResponse = await fetch(feedUrl, { cache: "no-store" });
    if (!feedResponse.ok) return fallback;

    const xml = await feedResponse.text();
    const entries = xml.split("<entry>").slice(1, 7);

    return entries.map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || "";
      const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] || "YouTube video";
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || "";
      return {
        id,
        title,
        link: `https://www.youtube.com/watch?v=${id}`,
        published,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
      };
    }).filter((entry) => Boolean(entry.id));
  } catch {
    return fallback;
  }
}

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
