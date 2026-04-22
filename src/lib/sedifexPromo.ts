import 'server-only';

const BASE_URL = process.env.SEDIFEX_API_BASE_URL ?? "https://us-central1-sedifex-web.cloudfunctions.net";
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

function getGalleryImageUrl(item: GalleryPayload["gallery"][number]) {
  return item.url ?? item.imageUrl ?? item.image ?? item.media?.url ?? "";
}

export async function fetchPromoAndGallery() {
  if (!STORE_ID) {
    throw new Error("Missing SEDIFEX_STORE_ID. Set a non-empty storeId in server runtime env.");
  }

  if (!API_KEY) {
    throw new Error("Missing Sedifex integration API key in server runtime env.");
  }

  const headers = {
    "x-api-key": API_KEY,
    "X-Sedifex-Contract-Version": CONTRACT,
    Accept: "application/json"
  };

  const promoRes = await fetch(`${BASE_URL}/v1IntegrationPromo?storeId=${encodeURIComponent(STORE_ID)}`, {
    headers,
    next: { revalidate: 60 }
  });

  if (!promoRes.ok) throw new Error(`Promo request failed: ${promoRes.status}`);

  const promoJson = (await promoRes.json()) as PromoPayload;

  const galleryEndpoints = ["/integrationGallery", "/v1IntegrationGallery"] as const;
  let publishedGallery: GalleryPayload["gallery"] = [];

  for (const endpoint of galleryEndpoints) {
    const galleryRes = await fetch(`${BASE_URL}${endpoint}?storeId=${encodeURIComponent(STORE_ID)}`, {
      headers,
      next: { revalidate: 60 }
    });

    if (!galleryRes.ok) {
      continue;
    }

    const galleryJson = (await galleryRes.json()) as GalleryPayload;
    const normalizedGallery = (galleryJson.gallery ?? [])
      .filter((item) => item?.isPublished !== false && Boolean(getGalleryImageUrl(item)))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => ({
        ...item,
        url: getGalleryImageUrl(item)
      }));

    if (normalizedGallery.length) {
      publishedGallery = normalizedGallery;
      break;
    }
  }

  return { promo: promoJson.promo, gallery: publishedGallery };
}
