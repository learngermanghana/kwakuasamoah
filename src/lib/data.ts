import { siteConfig } from "./site-config";
import { packages } from "@/data/packages";
import { getGalleryImageUrl, normalizePublishedGallery } from "./gallery-utils";

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
  sortOrder?: number;
  order?: number;
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
  url?: string;
  imageUrl?: string;
  image?: string;
  media?: {
    url?: string;
  };
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
  serviceName: string;
  category?: string;
  description?: string;
  priceLabel?: string;
  image: string;
  imageAlt: string;
};

export type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  caption: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  linkUrl: string;
  imageUrl: string;
  publishedAt: string;
};

const defaultServices: ServiceItem[] = packages.map((pkg) => ({
  id: pkg.slug,
  serviceName: pkg.title,
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
  caption: service.serviceName
}));

function getSedifexConfig() {
  const baseUrl = process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY;
  const storeId = process.env.SEDIFEX_STORE_ID;

  return { baseUrl, apiKey, storeId };
}

function mapSedifexItem(item: SedifexItem): ServiceItem {
  const normalizedCategory =
    item.category && item.category.toLowerCase() !== "not provided" ? item.category : undefined;

  const normalizedDescription = normalizeServiceDescription(item.description);

  return {
    id: item.id,
    serviceName: item.name,
    category: normalizedCategory,
    description: normalizedDescription || "Professional support tailored to your travel and relocation goals.",
    priceLabel: typeof item.price === "number" ? `From ${item.price}` : "Contact for price",
    image: item.imageUrl || item.imageUrls?.[0] || "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format&fit=crop",
    imageAlt: item.imageAlt || item.name
  };
}

const preferredServiceOrder = [
  "Schengen Travel Assistance",
  "Visa Application Support",
  "Interview Preparation",
  "Document Review Service",
  "Study Abroad Guidance",
  "Flight And Hotel Reservation Support"
] as const;

function sortSedifexServices(items: SedifexItem[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aPreferredIndex = preferredServiceOrder.indexOf(a.item.name as (typeof preferredServiceOrder)[number]);
      const bPreferredIndex = preferredServiceOrder.indexOf(b.item.name as (typeof preferredServiceOrder)[number]);
      const aHasPreferredOrder = aPreferredIndex !== -1;
      const bHasPreferredOrder = bPreferredIndex !== -1;

      if (aHasPreferredOrder && bHasPreferredOrder && aPreferredIndex !== bPreferredIndex) {
        return aPreferredIndex - bPreferredIndex;
      }

      if (aHasPreferredOrder !== bHasPreferredOrder) {
        return aHasPreferredOrder ? -1 : 1;
      }

      const aOrder = a.item.sortOrder ?? a.item.order ?? Number.POSITIVE_INFINITY;
      const bOrder = b.item.sortOrder ?? b.item.order ?? Number.POSITIVE_INFINITY;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.index - b.index;
    })
    .map(({ item }) => item);
}

function normalizeServiceDescription(description?: string) {
  if (!description) return "";

  const lines = description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^\*\*(Product Name|Item Type|Category):\*\*/i.test(line))
    .map((line) => line.replace(/\*\*/g, ""))
    .map((line) => line.replace(/\s+,/g, ","))
    .filter((line) => line.toLowerCase() !== "not provided");

  return lines.join("\n");
}

function mapSedifexGalleryItem(item: SedifexGalleryItem): GalleryItem {
  const imageUrl = getGalleryImageUrl(item);

  return {
    id: item.id,
    url: imageUrl,
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

    return sortSedifexServices(items).map(mapSedifexItem);
  } catch {
    return defaultServices;
  }
}

export async function getGalleryData() {
  const { baseUrl, apiKey, storeId } = getSedifexConfig();

  if (!baseUrl || !apiKey || !storeId) {
    return defaultGallery;
  }

  const galleryEndpoints = ["/integrationGallery", "/v1IntegrationGallery"] as const;

  for (const path of galleryEndpoints) {
    const endpoint = new URL(path, baseUrl);
    endpoint.searchParams.set("storeId", storeId);

    try {
      const response = await fetch(endpoint, {
        headers: {
          "x-api-key": apiKey,
          "X-Sedifex-Contract-Version": SEDIFEX_CONTRACT_VERSION,
          Accept: "application/json"
        },
        next: { revalidate: 60 }
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as SedifexGalleryResponse;
      const galleryItems = normalizePublishedGallery(payload.gallery as SedifexGalleryItem[] | undefined);

      if (!galleryItems.length) {
        continue;
      }

      return galleryItems.slice(0, 8).map(mapSedifexGalleryItem);
    } catch {
      continue;
    }
  }

  return defaultGallery;
}

type SedifexBlogItem = {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  linkUrl?: string;
  imageUrl?: string;
  publishedAt?: string;
};

type SedifexBlogResponse = {
  items?: SedifexBlogItem[];
};

function getSedifexBlogConfig() {
  const baseUrl = process.env.SEDIFEX_SITE_BASE_URL ?? "https://www.sedifex.com";
  const storeId = process.env.SEDIFEX_STORE_ID;

  return { baseUrl, storeId };
}

function mapSedifexBlogItem(item: SedifexBlogItem): BlogPost {
  return {
    id: item.id,
    title: item.title ?? "Untitled post",
    slug: item.slug ?? item.id,
    content: item.content ?? "",
    linkUrl: item.linkUrl ?? "",
    imageUrl: item.imageUrl ?? "",
    publishedAt: item.publishedAt ?? ""
  };
}

export async function getBlogPosts(slug?: string) {
  const { baseUrl, storeId } = getSedifexBlogConfig();

  if (!storeId) {
    return [] as BlogPost[];
  }

  const endpoint = new URL("/api/public-blog", baseUrl);
  endpoint.searchParams.set("storeId", storeId);
  if (slug) {
    endpoint.searchParams.set("slug", slug);
  }

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      return [] as BlogPost[];
    }

    const payload = (await response.json()) as SedifexBlogResponse;
    const items = Array.isArray(payload.items) ? payload.items : [];
    return items.filter((item) => Boolean(item.id)).map(mapSedifexBlogItem);
  } catch {
    return [] as BlogPost[];
  }
}

export type YouTubeVideo = {
  id: string;
  title: string;
  link: string;
  published: string;
  thumbnail: string;
};

const YOUTUBE_REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; KwakuLotteryBot/1.0; +https://www.youtube.com/@kwakulotteryy)",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9"
};

function parseYouTubeFeed(xml: string) {
  const entries = xml.split("<entry>").slice(1, 7);

  return entries
    .map((entry) => {
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
    })
    .filter((entry) => Boolean(entry.id));
}

function findChannelId(html: string) {
  const matchers = [
    /"channelId":"(UC[^"]+)"/,
    /\\"channelId\\":\\"(UC[^\\"]+)\\"/,
    /"externalId":"(UC[^"]+)"/
  ];

  for (const matcher of matchers) {
    const result = html.match(matcher);
    if (result?.[1]) return result[1];
  }

  return "";
}

export async function getYouTubeVideos() {
  const fallback: YouTubeVideo[] = [];

  try {
    const videosUrl = `${siteConfig.socials.youtube.replace(/\/$/, "")}/videos`;
    const channelPage = await fetch(videosUrl, {
      cache: "no-store",
      headers: YOUTUBE_REQUEST_HEADERS
    });

    if (!channelPage.ok) return fallback;

    const html = await channelPage.text();
    const channelId = findChannelId(html);
    if (!channelId) return fallback;

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const feedResponse = await fetch(feedUrl, {
      cache: "no-store",
      headers: YOUTUBE_REQUEST_HEADERS
    });
    if (!feedResponse.ok) return fallback;

    const xml = await feedResponse.text();
    return parseYouTubeFeed(xml);
  } catch {
    return fallback;
  }
}

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
