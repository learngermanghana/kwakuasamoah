export function getGalleryImageUrl(item) {
  return item?.url ?? item?.imageUrl ?? item?.image ?? item?.media?.url ?? "";
}

function getPayloadSource(payload) {
  return payload?.data ?? payload ?? {};
}

function orderValue(item) {
  return typeof item?.sortOrder === "number" ? item.sortOrder : 999999;
}

function getAlbumId(album) {
  return album?.id ?? album?.albumId ?? "";
}

function getImageId(image) {
  return image?.id ?? image?.imageId ?? "";
}

function compareAlbumOrder(a, b) {
  const order = orderValue(a) - orderValue(b);
  return order || String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
}

function normalizeLegacyGallery(items, limit) {
  const normalized = (items ?? [])
    .filter((item) => item?.isPublished !== false && Boolean(getGalleryImageUrl(item)))
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    .map((item, index) => ({
      ...item,
      id: getImageId(item) || `gallery-${index}`,
      url: getGalleryImageUrl(item),
      alt: item?.alt || item?.caption || "Store gallery image",
      caption: item?.caption || ""
    }));

  return typeof limit === "number" ? normalized.slice(0, limit) : normalized;
}

export function normalizePublishedGallery(items) {
  return normalizeLegacyGallery(items);
}

export function normalizeIntegrationGallery(payload, limit) {
  const source = getPayloadSource(payload);
  const albums = source.albums ?? source.galleryAlbums;
  const images = source.images ?? source.galleryImages;

  if (!Array.isArray(albums) || !Array.isArray(images)) {
    return normalizeLegacyGallery(source.gallery, limit);
  }

  const publishedAlbums = albums
    .filter((album) => album?.isPublished !== false)
    .sort(compareAlbumOrder);

  const albumMap = new Map();
  publishedAlbums.forEach((album, order) => {
    const id = getAlbumId(album);
    if (id) {
      albumMap.set(String(id), { ...album, order });
    }
  });

  const normalized = images
    .filter((image) => image?.isPublished !== false && Boolean(getGalleryImageUrl(image)))
    .filter((image) => Boolean(image?.albumId) && albumMap.has(String(image.albumId)))
    .sort((a, b) => {
      const aAlbum = albumMap.get(String(a.albumId));
      const bAlbum = albumMap.get(String(b.albumId));
      const albumOrder = (aAlbum?.order ?? 0) - (bAlbum?.order ?? 0);
      return albumOrder || orderValue(a) - orderValue(b);
    })
    .map((image, index) => {
      const album = albumMap.get(String(image.albumId));
      return {
        id: getImageId(image) || `${image.albumId}-${index}`,
        url: getGalleryImageUrl(image),
        alt: image?.alt || image?.caption || album?.title || "Store gallery image",
        caption: image?.caption || album?.title || ""
      };
    });

  return typeof limit === "number" ? normalized.slice(0, limit) : normalized;
}
