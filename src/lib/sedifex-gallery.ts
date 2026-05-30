import "server-only";
import type { GalleryItem } from "./data";
import { normalizeIntegrationGallery } from "./gallery-utils";

const BASE_URL =
  process.env.SEDIFEX_API_BASE_URL ||
  process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
  "https://us-central1-sedifex-web.cloudfunctions.net";

const STORE_ID =
  process.env.SEDIFEX_STORE_ID ||
  process.env.SEDIFEX_BOOKING_TARGET_STORE_ID ||
  process.env.NEXT_PUBLIC_SEDIFEX_STORE_ID ||
  "";

type ResponsePayload = {
  albums?: unknown[];
  galleryAlbums?: unknown[];
  images?: unknown[];
  galleryImages?: unknown[];
  gallery?: unknown[];
  data?: ResponsePayload;
};

export async function getSedifexGallery(limit = 8): Promise<GalleryItem[]> {
  if (!STORE_ID) return [];

  try {
    const url = new URL(`${BASE_URL.replace(/\/$/, "")}/integrationGallery`);
    url.searchParams.set("storeId", STORE_ID);
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) return [];
    return normalizeIntegrationGallery((await response.json()) as ResponsePayload, limit) as GalleryItem[];
  } catch {
    return [];
  }
}
