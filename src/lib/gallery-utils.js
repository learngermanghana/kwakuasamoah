export function getGalleryImageUrl(item) {
  return item?.url ?? item?.imageUrl ?? item?.image ?? item?.media?.url ?? "";
}

export function normalizePublishedGallery(items) {
  return (items ?? [])
    .filter((item) => item?.isPublished !== false && Boolean(getGalleryImageUrl(item)))
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
    .map((item) => ({
      ...item,
      url: getGalleryImageUrl(item)
    }));
}
