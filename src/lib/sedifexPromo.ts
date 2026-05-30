import 'server-only';
import { normalizeIntegrationGallery } from "./gallery-utils";

const BASE_URL = process.env.SEDIFEX_API_BASE_URL ?? "https://us-central1-sedifex-web.cloudfunctions.net";
const STORE_ID = process.env.SEDIFEX_STORE_ID ?? "";
const API_KEY =
  process.env.SEDIFEX_INTEGRATION_API_KEY ??
  process.env.SEDIFEX_PRODUCTS_API_KEY ??
  process.env.SEDIFEX_BOOKING_API_KEY ??
  process.env.SEDIFEX_INTEGRATION_KEY ??
  "";
const CONTRACT = process.env.SEDIFEX_CONTRACT_VERSION ?? "2026-04-13";

type PromoPayload = {
  storeId: string;
  promo: {
    enabled: boolean;
    title?: string | null;
    summary?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    websiteUrl?: string | null;
    imageUrl?: string | null;
    imageAlt?: string | null;
  };
};

type GalleryItem = {
  id?: string;
  imageId?: string;
  albumId?: string;
  url?: string;
  imageUrl?: string;
  image?: string;
  media?: {
    url?: string;
  };
  alt?: string | null;
  caption?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
};

type GalleryAlbum = {
  id?: string;
  albumId?: string;
  title?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

type GalleryPayload = {
  storeId: string;
  gallery?: GalleryItem[];
  albums?: GalleryAlbum[];
  galleryAlbums?: GalleryAlbum[];
  images?: GalleryItem[];
  galleryImages?: GalleryItem[];
  data?: GalleryPayload;
};

type NormalizedGalleryItem = GalleryItem & {
  id: string;
  url: string;
  alt: string;
  caption: string;
};

type PromoAndGallery = {
  promo: PromoPayload["promo"];
  gallery: NormalizedGalleryItem[];
};

export async function fetchPromoAndGallery(): Promise<PromoAndGallery> {
  if (!STORE_ID) {
    return { promo: { enabled: false }, gallery: [] };
  }

  if (!API_KEY) {
    return { promo: { enabled: false }, gallery: [] };
  }

  const headers = {
    "x-api-key": API_KEY,
    "X-Sedifex-Contract-Version": CONTRACT,
    Accept: "application/json"
  };

  const [promoRes, galleryRes] = await Promise.all([
    fetch(`${BASE_URL}/v1IntegrationPromo?storeId=${encodeURIComponent(STORE_ID)}`, {
      headers,
      next: { revalidate: 60 }
    }),
    fetch(`${BASE_URL}/integrationGallery?storeId=${encodeURIComponent(STORE_ID)}`, {
      headers,
      next: { revalidate: 60 }
    })
  ]);

  if (!promoRes.ok) {
    return { promo: { enabled: false }, gallery: [] };
  }

  const promoJson = (await promoRes.json()) as PromoPayload;
  const galleryJson = galleryRes.ok ? (await galleryRes.json()) as GalleryPayload : { storeId: STORE_ID, gallery: [] };
  const publishedGallery = normalizeIntegrationGallery(galleryJson) as NormalizedGalleryItem[];

  return { promo: promoJson.promo, gallery: publishedGallery };
}
