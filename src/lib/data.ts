import "server-only";
import { siteConfig } from "./site-config";
import { packages } from "@/data/packages";
import { normalizeIntegrationGallery } from "./gallery-utils";
import { readDB } from "./db-client";

const SEDIFEX_CONTRACT_VERSION =
  process.env.SEDIFEX_CONTRACT_VERSION || "2026-04-13";

export async function getPackageData() {
  try {
    const db = readDB();
    if (db.packages && db.packages.length > 0) {
      return db.packages.map(pkg => ({
        slug: pkg.id,
        title: pkg.serviceName,
        destination: pkg.category || "",
        durationDays: pkg.durationDays || 30,
        priceFrom: pkg.priceLabel || `GHS ${pkg.price || 0}`,
        summary: pkg.description || "",
        includes: pkg.includes ? pkg.includes.split(",").map(i => i.trim()) : [],
        image: pkg.image
      }));
    }
  } catch (e) {
    console.error("getPackageData DB load failed, falling back to static packages", e);
  }
  return packages;
}

type SedifexItem = {
  id: string;
  name: string;
  type?: string;
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

type SedifexCatalogResponse = {
  items?: SedifexItem[];
};

type SedifexGalleryAlbum = {
  id?: string;
  albumId?: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

type SedifexGalleryItem = {
  id?: string;
  imageId?: string;
  albumId?: string;
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
  albums?: SedifexGalleryAlbum[];
  galleryAlbums?: SedifexGalleryAlbum[];
  images?: SedifexGalleryItem[];
  galleryImages?: SedifexGalleryItem[];
  data?: SedifexGalleryResponse;
};

export type HeroSlide = {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  mobileImageUrl: string;
};

export type SocialSettings = {
  displayName: string;
  tagline: string;
  businessDescription: string;
  publicPhone: string;
  whatsappNumber: string;
  publicEmail: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  x: string;
  linkedin: string;
  calLink?: string;
  footerImages?: Array<{
    url: string;
    overlay: string;
    link: string;
  }>;
};

type SedifexHeroSlide = Partial<HeroSlide> & {
  id?: string;
  placement?: string;
  sortOrder?: number;
  order?: number;
  isActive?: boolean;
  enabled?: boolean;
  published?: boolean;
};

type SedifexHeroSlidesResponse = {
  slides?: SedifexHeroSlide[];
  heroSlides?: SedifexHeroSlide[];
  items?: SedifexHeroSlide[];
  data?:
    | SedifexHeroSlide[]
    | { slides?: SedifexHeroSlide[]; items?: SedifexHeroSlide[] };
};

type SedifexSocialSettingsPayload = Partial<SocialSettings> & {
  name?: string;
  businessName?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  socialLinks?: Partial<
    Record<
      | "instagram"
      | "facebook"
      | "tiktok"
      | "youtube"
      | "x"
      | "twitter"
      | "linkedin",
      string
    >
  >;
  socials?: Partial<
    Record<
      | "instagram"
      | "facebook"
      | "tiktok"
      | "youtube"
      | "x"
      | "twitter"
      | "linkedin",
      string
    >
  >;
};

type SedifexSocialSettingsResponse = SedifexSocialSettingsPayload & {
  settings?: SedifexSocialSettingsPayload;
  socialSettings?: SedifexSocialSettingsPayload;
  data?: SedifexSocialSettingsPayload;
};

export type ServiceItem = {
  id: string;
  serviceName: string;
  category?: string;
  description?: string;
  priceLabel?: string;
  price?: number;
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
  price: undefined,
  image: pkg.image,
  imageAlt: pkg.title,
}));

const defaultGallery: GalleryItem[] = defaultServices
  .slice(0, 6)
  .map((service) => ({
    id: service.id,
    url: service.image,
    alt: service.imageAlt,
    caption: service.serviceName,
  }));

export const defaultHeroSlide: HeroSlide = {
  id: "fallback-home-hero",
  title: "Travel",
  eyebrow: siteConfig.tagline,
  subtitle:
    "Get trusted travel updates, visa support services, right documents guidance, relocation guidance, and one-on-one consultation for destinations worldwide.",
  ctaLabel: "Contact Us",
  ctaHref: "/contact",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  imageUrl:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
  mobileImageUrl: "",
};

export const defaultSocialSettings: SocialSettings = {
  displayName: siteConfig.name,
  tagline: siteConfig.tagline,
  businessDescription: siteConfig.description,
  publicPhone: siteConfig.phone,
  whatsappNumber: siteConfig.whatsapp,
  publicEmail: siteConfig.email,
  website: siteConfig.url,
  instagram: siteConfig.socials.instagram,
  facebook: siteConfig.socials.facebook,
  tiktok: siteConfig.socials.tiktok,
  youtube: siteConfig.socials.youtube,
  x: siteConfig.socials.x,
  linkedin: siteConfig.socials.linkedin ?? "",
  calLink: "https://cal.com/kwakulotteryy",
  footerImages: [
    {
      url: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop",
      overlay: "facebook",
      link: "https://web.facebook.com/kwakulotteryy?_rdc=1&_rdr"
    },
    {
      url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop",
      overlay: "instagram",
      link: "https://www.instagram.com/kwakulotteryy"
    },
    {
      url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop",
      overlay: "tiktok",
      link: "https://www.tiktok.com/@kwakulotteryy"
    },
    {
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
      overlay: "youtube",
      link: "https://youtube.com/@kwakulotteryy"
    }
  ]
};

function getSedifexConfig() {
  const baseUrl =
    process.env.SEDIFEX_API_BASE_URL ||
    process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
    "https://us-central1-sedifex-web.cloudfunctions.net";
  const apiKey =
    process.env.SEDIFEX_INTEGRATION_API_KEY ||
    process.env.SEDIFEX_PRODUCTS_API_KEY ||
    process.env.SEDIFEX_BOOKING_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_KEY;
  const storeId =
    process.env.SEDIFEX_STORE_ID ||
    process.env.SEDIFEX_BOOKING_TARGET_STORE_ID ||
    process.env.NEXT_PUBLIC_SEDIFEX_STORE_ID;

  return { baseUrl, apiKey, storeId };
}

function getSedifexIntegrationHeaders(apiKey?: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiKey) {
    headers["x-api-key"] = apiKey;
    headers.Authorization = `Bearer ${apiKey}`;
    headers["X-Sedifex-Contract-Version"] = SEDIFEX_CONTRACT_VERSION;
  }

  return headers;
}

function firstNonEmpty(...values: Array<string | null | undefined>) {
  return (
    values
      .find((value) => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? ""
  );
}

function getHeroSlideItems(
  payload: SedifexHeroSlidesResponse,
): SedifexHeroSlide[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.slides)) return payload.slides;
  if (Array.isArray(payload.heroSlides)) return payload.heroSlides;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && Array.isArray(payload.data.slides))
    return payload.data.slides;
  if (payload.data && Array.isArray(payload.data.items))
    return payload.data.items;

  return [];
}

function mapSedifexHeroSlide(slide: SedifexHeroSlide): HeroSlide {
  return {
    id: firstNonEmpty(slide.id, defaultHeroSlide.id),
    title: firstNonEmpty(slide.title, defaultHeroSlide.title),
    eyebrow: firstNonEmpty(slide.eyebrow, defaultHeroSlide.eyebrow),
    subtitle: firstNonEmpty(slide.subtitle, defaultHeroSlide.subtitle),
    ctaLabel: firstNonEmpty(slide.ctaLabel, defaultHeroSlide.ctaLabel),
    ctaHref: firstNonEmpty(slide.ctaHref, defaultHeroSlide.ctaHref),
    secondaryCtaLabel: firstNonEmpty(
      slide.secondaryCtaLabel,
      defaultHeroSlide.secondaryCtaLabel,
    ),
    secondaryCtaHref: firstNonEmpty(
      slide.secondaryCtaHref,
      defaultHeroSlide.secondaryCtaHref,
    ),
    imageUrl: firstNonEmpty(slide.imageUrl, defaultHeroSlide.imageUrl),
    mobileImageUrl: firstNonEmpty(
      slide.mobileImageUrl,
      slide.imageUrl,
      defaultHeroSlide.mobileImageUrl,
    ),
  };
}

function sortHeroSlides(items: SedifexHeroSlide[]) {
  return items
    .filter(
      (item) =>
        item.isActive !== false &&
        item.enabled !== false &&
        item.published !== false,
    )
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aOrder =
        a.item.sortOrder ?? a.item.order ?? Number.POSITIVE_INFINITY;
      const bOrder =
        b.item.sortOrder ?? b.item.order ?? Number.POSITIVE_INFINITY;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.index - b.index;
    })
    .map(({ item }) => item);
}

function getSocialSettingsPayload(
  payload: SedifexSocialSettingsResponse,
): SedifexSocialSettingsPayload {
  return payload.settings ?? payload.socialSettings ?? payload.data ?? payload;
}

function getSocialLink(
  settings: SedifexSocialSettingsPayload,
  key: Exclude<keyof SocialSettings, "footerImages" | "calLink">,
  alternateKey?: "twitter",
) {
  return firstNonEmpty(
    settings[key],
    settings.socialLinks?.[
      key as keyof NonNullable<SedifexSocialSettingsPayload["socialLinks"]>
    ],
    settings.socials?.[
      key as keyof NonNullable<SedifexSocialSettingsPayload["socials"]>
    ],
    alternateKey ? settings.socialLinks?.[alternateKey] : undefined,
    alternateKey ? settings.socials?.[alternateKey] : undefined,
  );
}

function mapSedifexSocialSettings(
  settings: SedifexSocialSettingsPayload,
): SocialSettings {
  return {
    displayName: firstNonEmpty(
      settings.displayName,
      settings.businessName,
      settings.name,
      defaultSocialSettings.displayName,
    ),
    tagline: firstNonEmpty(settings.tagline, defaultSocialSettings.tagline),
    businessDescription: firstNonEmpty(
      settings.businessDescription,
      settings.description,
      defaultSocialSettings.businessDescription,
    ),
    publicPhone: firstNonEmpty(
      settings.publicPhone,
      settings.phone,
      defaultSocialSettings.publicPhone,
    ),
    whatsappNumber: firstNonEmpty(
      settings.whatsappNumber,
      settings.whatsapp,
      defaultSocialSettings.whatsappNumber,
    ),
    publicEmail: firstNonEmpty(
      settings.publicEmail,
      settings.email,
      defaultSocialSettings.publicEmail,
    ),
    website: firstNonEmpty(settings.website, defaultSocialSettings.website),
    instagram: firstNonEmpty(
      getSocialLink(settings, "instagram"),
      defaultSocialSettings.instagram,
    ),
    facebook: firstNonEmpty(
      getSocialLink(settings, "facebook"),
      defaultSocialSettings.facebook,
    ),
    tiktok: firstNonEmpty(
      getSocialLink(settings, "tiktok"),
      defaultSocialSettings.tiktok,
    ),
    youtube: firstNonEmpty(
      getSocialLink(settings, "youtube"),
      defaultSocialSettings.youtube,
    ),
    x: firstNonEmpty(
      getSocialLink(settings, "x", "twitter"),
      defaultSocialSettings.x,
    ),
    linkedin: firstNonEmpty(
      getSocialLink(settings, "linkedin"),
      defaultSocialSettings.linkedin,
    ),
  };
}

function mapSedifexItem(item: SedifexItem): ServiceItem {
  const normalizedCategory =
    item.category && item.category.toLowerCase() !== "not provided"
      ? item.category
      : undefined;

  const normalizedDescription = normalizeServiceDescription(item.description);

  return {
    id: item.id,
    serviceName: item.name,
    category: normalizedCategory,
    description:
      normalizedDescription ||
      "Professional support tailored to your travel and relocation goals.",
    priceLabel:
      typeof item.price === "number"
        ? `Price ${item.price} GHC`
        : "Contact for price",
    price: typeof item.price === "number" ? item.price : undefined,
    image:
      item.imageUrl ||
      item.imageUrls?.[0] ||
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format&fit=crop",
    imageAlt: item.imageAlt || item.name,
  };
}

const preferredServiceOrder = [
  "schenegen travel assistance",
  "interview preparation",
  "document review service",
  "visa application filling",
  "us america lottery",
  "flight and hotel",
  "study abroad",
] as const;

function normalizeServiceNameForSort(name?: string) {
  return (name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getPreferredServiceIndex(name?: string) {
  const normalizedName = normalizeServiceNameForSort(name);

  for (let i = 0; i < preferredServiceOrder.length; i += 1) {
    const preferredName = preferredServiceOrder[i];

    if (normalizedName.includes(preferredName)) {
      return i;
    }
  }

  return -1;
}

function sortSedifexServices(items: SedifexItem[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aPreferredIndex = getPreferredServiceIndex(a.item.name);
      const bPreferredIndex = getPreferredServiceIndex(b.item.name);
      const aHasPreferredOrder = aPreferredIndex !== -1;
      const bHasPreferredOrder = bPreferredIndex !== -1;

      if (
        aHasPreferredOrder &&
        bHasPreferredOrder &&
        aPreferredIndex !== bPreferredIndex
      ) {
        return aPreferredIndex - bPreferredIndex;
      }

      if (aHasPreferredOrder !== bHasPreferredOrder) {
        return aHasPreferredOrder ? -1 : 1;
      }

      const aOrder =
        a.item.sortOrder ?? a.item.order ?? Number.POSITIVE_INFINITY;
      const bOrder =
        b.item.sortOrder ?? b.item.order ?? Number.POSITIVE_INFINITY;

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
    .filter(
      (line) => !/^\*\*(Product Name|Item Type|Category):\*\*/i.test(line),
    )
    .map((line) => line.replace(/\*\*/g, ""))
    .map((line) => line.replace(/\s+,/g, ","))
    .filter((line) => line.toLowerCase() !== "not provided");

  return lines.join("\n");
}

function isServiceItem(item: SedifexItem) {
  const itemType = (item.itemType || item.type || "").toLowerCase();
  return itemType === "service";
}



export async function getHomeHeroSlide() {
  const { baseUrl, apiKey, storeId } = getSedifexConfig();

  if (!baseUrl || !storeId) {
    return defaultHeroSlide;
  }

  const endpoint = new URL("/v1IntegrationHeroSlides", baseUrl);
  endpoint.searchParams.set("storeId", storeId);
  endpoint.searchParams.set("placement", "home_hero");

  try {
    const response = await fetch(endpoint, {
      headers: getSedifexIntegrationHeaders(apiKey),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return defaultHeroSlide;
    }

    const payload = (await response.json()) as SedifexHeroSlidesResponse;
    const slide = sortHeroSlides(getHeroSlideItems(payload))[0];

    if (!slide) {
      return defaultHeroSlide;
    }

    return mapSedifexHeroSlide(slide);
  } catch {
    return defaultHeroSlide;
  }
}

export async function getSocialSettings() {
  try {
    const db = readDB();
    if (db.settings) {
      return {
        displayName: db.settings.displayName || defaultSocialSettings.displayName,
        tagline: db.settings.tagline || defaultSocialSettings.tagline,
        businessDescription: db.settings.businessDescription || defaultSocialSettings.businessDescription,
        publicPhone: db.settings.publicPhone || defaultSocialSettings.publicPhone,
        whatsappNumber: db.settings.whatsappNumber || defaultSocialSettings.whatsappNumber,
        publicEmail: db.settings.publicEmail || defaultSocialSettings.publicEmail,
        website: db.settings.website || defaultSocialSettings.website,
        instagram: db.settings.instagram || defaultSocialSettings.instagram,
        facebook: db.settings.facebook || defaultSocialSettings.facebook,
        tiktok: db.settings.tiktok || defaultSocialSettings.tiktok,
        youtube: db.settings.youtube || defaultSocialSettings.youtube,
        x: db.settings.x || defaultSocialSettings.x,
        linkedin: db.settings.linkedin || defaultSocialSettings.linkedin,
        calLink: db.settings.calLink || defaultSocialSettings.calLink,
        footerImages: db.settings.footerImages || defaultSocialSettings.footerImages,
      };
    }
  } catch (e) {
    console.error("Failed to load settings from DB", e);
  }
  return defaultSocialSettings;
}

export async function getServiceData() {
  try {
    const db = readDB();
    if (db.packages && db.packages.length > 0) {
      return db.packages.map((pkg) => ({
        id: pkg.id,
        serviceName: pkg.serviceName,
        category: pkg.category,
        description: pkg.description || "",
        priceLabel: pkg.priceLabel || `GHS ${pkg.price || 0}`,
        price: pkg.price,
        image: pkg.image,
        imageAlt: pkg.imageAlt || pkg.serviceName,
      }));
    }
  } catch (e) {
    console.error("Failed to load packages from DB", e);
  }
  return defaultServices;
}

export async function getGalleryData(limit = 8): Promise<GalleryItem[]> {
  try {
    const db = readDB();
    if (db.gallery && db.gallery.length > 0) {
      return db.gallery.slice(0, limit).map((photo) => ({
        id: photo.id,
        url: photo.url,
        alt: photo.alt,
        caption: photo.caption,
      }));
    }
  } catch (e) {
    console.error("Failed to load gallery from DB", e);
  }
  return defaultGallery.slice(0, limit);
}

export async function getBlogPosts(slug?: string) {
  try {
    const db = readDB();
    if (db.blogs && db.blogs.length > 0) {
      const posts = db.blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        linkUrl: `/blog/${blog.slug}`,
        imageUrl: blog.imageUrl,
        publishedAt: blog.publishedAt,
      }));
      if (slug) {
        return posts.filter((post) => post.slug === slug);
      }
      return posts;
    }
  } catch (e) {
    console.error("Failed to load blogs from DB", e);
  }
  return [] as BlogPost[];
}

export type YouTubeVideo = {
  id: string;
  title: string;
  link: string;
  published: string;
  thumbnail: string;
};

const YOUTUBE_REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; KwakuLotteryBot/1.0; +https://www.youtube.com/@kwakulotteryy)",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function parseYouTubeFeed(xml: string) {
  const entries = xml.split("<entry>").slice(1, 7);

  return entries
    .map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || "";
      const title =
        entry.match(/<title>([^<]+)<\/title>/)?.[1] || "YouTube video";
      const published =
        entry.match(/<published>([^<]+)<\/published>/)?.[1] || "";
      return {
        id,
        title,
        link: `https://www.youtube.com/watch?v=${id}`,
        published,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    })
    .filter((entry) => Boolean(entry.id));
}

function findChannelId(html: string) {
  const matchers = [
    /"channelId":"(UC[^"]+)"/,
    /\\"channelId\\":\\"(UC[^\\"]+)\\"/,
    /"externalId":"(UC[^"]+)"/,
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
      headers: YOUTUBE_REQUEST_HEADERS,
    });

    if (!channelPage.ok) return fallback;

    const html = await channelPage.text();
    const channelId = findChannelId(html);
    if (!channelId) return fallback;

    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const feedResponse = await fetch(feedUrl, {
      cache: "no-store",
      headers: YOUTUBE_REQUEST_HEADERS,
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
