import "server-only";
import type { GalleryItem } from "./data";

const BASE_URL =
  process.env.SEDIFEX_API_BASE_URL ||
  process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
  "https://us-central1-sedifex-web.cloudfunctions.net";

const STORE_ID =
  process.env.SEDIFEX_STORE_ID ||
  process.env.SEDIFEX_BOOKING_TARGET_STORE_ID ||
  process.env.NEXT_PUBLIC_SEDIFEX_STORE_ID ||
  "";

type Album = {
  id?: string;
  albumId?: string;
  title?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

type Image = {
  id?: string;
  imageId?: string;
  albumId?: string;
  url?: string;
  imageUrl?: string;
  alt?: string;
  caption?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

type ResponsePayload = {
  albums?: Album[];
  galleryAlbums?: Album[];
  images?: Image[];
  galleryImages?: Image[];
  data?: ResponsePayload;
};

function orderValue(item: { sortOrder?: number }) {
  return typeof item.sortOrder === "number" ? item.sortOrder : 999999;
}

function imageUrl(image: Image) {
  return image.url || image.imageUrl || "";
}

function normalize(payload: ResponsePayload, limit?: number): GalleryItem[] {
  const source = payload.data || payload;
  const albums = (source.albums || source.galleryAlbums || [])
    .filter((album) => album.isPublished !== false)
    .sort((a, b) => {
      const order = orderValue(a) - orderValue(b);
      return order || String(a.title || "").localeCompare(String(b.title || ""));
    });

  const albumMap = new Map<string, Album & { order: number }>();
  albums.forEach((album, index) => {
    const id = album.id || album.albumId;
    if (id) albumMap.set(id, { ...album, order: index });
  });

  const images = (source.images || source.galleryImages || [])
    .filter((image) => image.isPublished !== false && Boolean(imageUrl(image)))
    .filter((image) => Boolean(image.albumId) && albumMap.has(String(image.albumId)))
    .sort((a, b) => {
      const albumOrder =
        (albumMap.get(String(a.albumId))?.order || 0) -
        (albumMap.get(String(b.albumId))?.order || 0);
      return albumOrder || orderValue(a) - orderValue(b);
    })
    .map((image, index) => {
      const album = albumMap.get(String(image.albumId));
      return {
        id: image.id || image.imageId || `gallery-${index}`,
        url: imageUrl(image),
        alt: image.alt || image.caption || album?.title || "Gallery image",
        caption: image.caption || album?.title || "",
      };
    });

  return typeof limit === "number" ? images.slice(0, limit) : images;
}

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
    return normalize((await response.json()) as ResponsePayload, limit);
  } catch {
    return [];
  }
}
