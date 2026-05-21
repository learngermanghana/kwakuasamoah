import { siteConfig } from "./site-config";
import { packages } from "@/data/packages";
import { getGalleryImageUrl, normalizePublishedGallery } from "./gallery-utils";

const SEDIFEX_CONTRACT_VERSION = "2026-04-13";
const DEFAULT_SEDIFEX_API_BASE_URL = "https://us-central1-sedifex-web.cloudfunctions.net";

export async function getPackageData() {
  return packages;
}

type SedifexItem = Record<string, unknown> & {
  id?: string;
  name?: string;
  title?: string;
  serviceName?: string;
  category?: string;
  description?: string;
  summary?: string;
  itemType?: string;
  item_type?: string;
  type?: string;
  price?: number | string;
  unitPrice?: number | string;
  amount?: number | string;
  imageUrl?: string;
  imageUrls?: string[];
  image?: string;
  sortOrder?: number;
  order?: number;
};

type SedifexProductsResponse = Record<string, unknown> & {
  products?: SedifexItem[];
  services?: SedifexItem[];
  publicProducts?: SedifexItem[];
  publicServices?: SedifexItem[];
  items?: SedifexItem[];
};

type SedifexGalleryItem = {
  id: string;
  url?: string;
  imageUrl?: string;
  image?: string;
  media?: { url?: string };
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

export type YouTubeVideo = {
  id: string;
  title: string;
  link: string;
  published: string;
  thumbnail: string;
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
  const baseUrl = (process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL || DEFAULT_SEDIFEX_API_BASE_URL).replace(/\/$/, "");
  const apiKey = process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY || process.env.SEDIFEX_CHECKOUT_API_KEY || process.env.SEDIFEX_BOOKING_API_KEY || "";
  const storeId = process.env.SEDIFEX_STORE_ID || process.env.SEDIFEX_BOOKING_TARGET_STORE_ID || "";
  return { baseUrl, apiKey, storeId };
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function firstArrayString(value: unknown) {
  return Array.isArray(value) && typeof value[0] === "string" ? value[0] : "";
}

function numberFrom(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }
  return 0;
}

function priceFrom(item: SedifexItem) {
  return numberFrom(item.price) || numberFrom(item.unitPrice) || numberFrom(item.unit_price) || numberFrom(item.amount) || numberFrom(item.sellingPrice) || numberFrom(item.checkoutAmount);
}

function normalizeItemType(item: SedifexItem) {
  return firstString(item.itemType, item.item_type, item.type).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function isServiceItem(item: SedifexItem) {
  const itemType = normalizeItemType(item);
  return itemType === "service" || itemType === "services" || itemType === "serviceitem";
}

function normalizeServiceDescription(description?: string) {
  if (!description) return "";
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^\*\*(Product Name|Item Type|Category):\*\*/i.test(line))
    .map((line) => line.replace(/\*\*/g, ""))
    .map((line) => line.replace(/\s+,/g, ","))
    .filter((line) => line.toLowerCase() !== "not provided")
    .join("\n");
}

function mapSedifexItem(item: SedifexItem): ServiceItem {
  const name = firstString(item.name, item.serviceName, item.service_name, item.title, "Service");
  const id = firstString(item.id, item.itemId, item.item_id, item.serviceId, item.service_id, name);
  const category = firstString(item.category, item.categoryName);
  const description = normalizeServiceDescription(firstString(item.description, item.summary));
  const price = priceFrom(item);
  const image = firstString(
    item.imageUrl,
    item.image_url,
    item.image,
    item.imageUrls?.[0],
    firstArrayString(item.images),
    (item.media as { url?: string } | undefined)?.url,
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format&fit=crop"
  );

  return {
    id,
    serviceName: name,
    category: category && category.toLowerCase() !== "not provided" ? category : undefined,
    description: description || "Professional support tailored to your travel and relocation goals.",
    priceLabel: price ? `Price ${price} GHC` : "Contact for price",
    image,
    imageAlt: firstString(item.imageAlt, item.image_alt, name)
  };
}

const preferredServiceOrder = [
  "schenegen travel assistance",
  "interview preparation",
  "document review service",
  "visa application filling",
  "us america lottery",
  "flight and hotel",
  "study abroad"
] as const;

function normalizeServiceNameForSort(name?: string) {
  return (name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getPreferredServiceIndex(name?: string) {
  const normalizedName = normalizeServiceNameForSort(name);
  for (let i = 0; i < preferredServiceOrder.length; i += 1) {
    if (normalizedName.includes(preferredServiceOrder[i])) return i;
  }
  return -1;
}

function sortSedifexServices(items: SedifexItem[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aPreferredIndex = getPreferredServiceIndex(firstString(a.item.name, a.item.serviceName, a.item.title));
      const bPreferredIndex = getPreferredServiceIndex(firstString(b.item.name, b.item.serviceName, b.item.title));
      if (aPreferredIndex !== -1 && bPreferredIndex !== -1 && aPreferredIndex !== bPreferredIndex) return aPreferredIndex - bPreferredIndex;
      if ((aPreferredIndex !== -1) !== (bPreferredIndex !== -1)) return aPreferredIndex !== -1 ? -1 : 1;
      const aOrder = a.item.sortOrder ?? a.item.order ?? Number.POSITIVE_INFINITY;
      const bOrder = b.item.sortOrder ?? b.item.order ?? Number.POSITIVE_INFINITY;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

function collectItems(value: unknown, depth = 0): SedifexItem[] {
  if (!value || depth > 4) return [];
  if (Array.isArray(value)) return value.flatMap((entry) => (entry && typeof entry === "object" ? [entry as SedifexItem, ...collectItems(entry, depth + 1)] : []));
  if (typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  return ["items", "products", "services", "publicProducts", "publicServices", "data", "catalog"].flatMap((key) => collectItems(record[key], depth + 1));
}

function servicesFromPayload(payload: SedifexProductsResponse) {
  const directServices = [...(payload.publicServices || []), ...(payload.services || [])];
  if (directServices.length) return directServices;
  return collectItems(payload).filter(isServiceItem);
}

function uniqueItems(items: SedifexItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = firstString(item.id, item.itemId, item.item_id, item.serviceId, item.service_id, item.name, item.serviceName, item.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sedifexHeaders(apiKey: string) {
  return {
    "x-api-key": apiKey,
    Authorization: `Bearer ${apiKey}`,
    "X-Sedifex-Contract-Version": SEDIFEX_CONTRACT_VERSION,
    Accept: "application/json"
  };
}

export async function getServiceData() {
  const { baseUrl, apiKey, storeId } = getSedifexConfig();
  if (!apiKey || !storeId) return defaultServices;

  for (const path of ["/integrationProducts", "/v1IntegrationProducts"] as const) {
    try {
      const endpoint = new URL(path, `${baseUrl}/`);
      endpoint.searchParams.set("storeId", storeId);
      const response = await fetch(endpoint, { headers: sedifexHeaders(apiKey), next: { revalidate: 30 } });
      if (!response.ok) continue;
      const payload = (await response.json()) as SedifexProductsResponse;
      const items = uniqueItems(servicesFromPayload(payload));
      if (items.length) return sortSedifexServices(items).map(mapSedifexItem);
    } catch {
      continue;
    }
  }

  return defaultServices;
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

export async function getGalleryData() {
  const { baseUrl, apiKey, storeId } = getSedifexConfig();
  if (!apiKey || !storeId) return defaultGallery;

  for (const path of ["/integrationGallery", "/v1IntegrationGallery"] as const) {
    try {
      const endpoint = new URL(path, `${baseUrl}/`);
      endpoint.searchParams.set("storeId", storeId);
      const response = await fetch(endpoint, { headers: sedifexHeaders(apiKey), next: { revalidate: 60 } });
      if (!response.ok) continue;
      const payload = (await response.json()) as SedifexGalleryResponse;
      const galleryItems = normalizePublishedGallery(payload.gallery as SedifexGalleryItem[] | undefined);
      if (galleryItems.length) return galleryItems.slice(0, 8).map(mapSedifexGalleryItem);
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

type SedifexBlogResponse = { items?: SedifexBlogItem[] };

export async function getBlogPosts(slug?: string) {
  const baseUrl = process.env.SEDIFEX_SITE_BASE_URL ?? "https://www.sedifex.com";
  const storeId = process.env.SEDIFEX_STORE_ID;
  if (!storeId) return [] as BlogPost[];

  const endpoint = new URL("/api/public-blog", baseUrl);
  endpoint.searchParams.set("storeId", storeId);
  if (slug) endpoint.searchParams.set("slug", slug);

  try {
    const response = await fetch(endpoint, { next: { revalidate: 60 }, headers: { Accept: "application/json" } });
    if (!response.ok) return [] as BlogPost[];
    const payload = (await response.json()) as SedifexBlogResponse;
    return (payload.items || []).filter((item) => Boolean(item.id)).map((item) => ({
      id: item.id,
      title: item.title ?? "Untitled post",
      slug: item.slug ?? item.id,
      content: item.content ?? "",
      linkUrl: item.linkUrl ?? "",
      imageUrl: item.imageUrl ?? "",
      publishedAt: item.publishedAt ?? ""
    }));
  } catch {
    return [] as BlogPost[];
  }
}

export async function getYouTubeVideos() {
  return [] as YouTubeVideo[];
}

export function getWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
