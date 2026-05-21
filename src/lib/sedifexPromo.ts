import 'server-only';
import { normalizePublishedGallery } from "./gallery-utils";

const BASE_URL = (process.env.SEDIFEX_API_BASE_URL ?? "https://us-central1-sedifex-web.cloudfunctions.net").replace(/\/$/, "");
const STORE_ID = process.env.SEDIFEX_STORE_ID ?? "";
const API_KEY = process.env.SEDIFEX_INTEGRATION_API_KEY ?? process.env.SEDIFEX_INTEGRATION_KEY ?? "";
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

type GalleryPayload = {
  storeId: string;
  gallery: Array<{
    id: string;
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
  }>;
};

const emptyPromo: PromoPayload["promo"] = {
  enabled: false,
  title: "Latest promo",
  summary: null,
  startDate: null,
  endDate: null,
  websiteUrl: null,
  imageUrl: null,
  imageAlt: null
};

function emptyPromoAndGallery() {
  return { promo: emptyPromo, gallery: [] as GalleryPayload["gallery"] };
}

function requestHeaders() {
  return {
    "x-api-key": API_KEY,
    "X-Sedifex-Contract-Version": CONTRACT,
    Accept: "application/json"
  };
}

async function fetchJson<T>(path: string) {
  if (!STORE_ID || !API_KEY) return null;

  const response = await fetch(`${BASE_URL}${path}?storeId=${encodeURIComponent(STORE_ID)}`, {
    headers: requestHeaders(),
    next: { revalidate: 60 }
  });

  if (!response.ok) return null;

  return (await response.json().catch(() => null)) as T | null;
}

export async function fetchPromoAndGallery() {
  if (!STORE_ID || !API_KEY) {
    return emptyPromoAndGallery();
  }

  const promoEndpoints = ["/integrationPromo", "/v1IntegrationPromo"] as const;
  let promo = emptyPromo;

  for (const endpoint of promoEndpoints) {
    const promoJson = await fetchJson<PromoPayload>(endpoint);

    if (promoJson?.promo) {
      promo = promoJson.promo;
      break;
    }
  }

  const galleryEndpoints = ["/integrationGallery", "/v1IntegrationGallery"] as const;
  let publishedGallery: GalleryPayload["gallery"] = [];

  for (const endpoint of galleryEndpoints) {
    const galleryJson = await fetchJson<GalleryPayload>(endpoint);

    if (!galleryJson?.gallery?.length) {
      continue;
    }

    const normalizedGallery = normalizePublishedGallery(galleryJson.gallery as GalleryPayload["gallery"]);

    if (normalizedGallery.length) {
      publishedGallery = normalizedGallery;
      break;
    }
  }

  return { promo, gallery: publishedGallery };
}
