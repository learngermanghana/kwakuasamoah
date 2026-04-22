import test from "node:test";
import assert from "node:assert/strict";
import { getGalleryImageUrl, normalizePublishedGallery } from "./gallery-utils.js";

test("getGalleryImageUrl supports url, imageUrl, image, and media.url fallback order", () => {
  assert.equal(getGalleryImageUrl({ url: "https://cdn.example.com/direct.jpg" }), "https://cdn.example.com/direct.jpg");
  assert.equal(getGalleryImageUrl({ imageUrl: "https://cdn.example.com/image-url.jpg" }), "https://cdn.example.com/image-url.jpg");
  assert.equal(getGalleryImageUrl({ image: "https://cdn.example.com/image.jpg" }), "https://cdn.example.com/image.jpg");
  assert.equal(getGalleryImageUrl({ media: { url: "https://cdn.example.com/media.jpg" } }), "https://cdn.example.com/media.jpg");
  assert.equal(getGalleryImageUrl({ alt: null }), "");
});

test("normalizePublishedGallery keeps published items with images and sorts by sortOrder", () => {
  const normalized = normalizePublishedGallery([
    {
      id: "3",
      alt: null,
      caption: "Explore Germany",
      isPublished: true,
      sortOrder: 3,
      url: "https://storage.googleapis.com/sedifeximage/stores/tAipWCKjLBgMJR5ofEIXEe6F8iw2/promo-gallery/draft-mo9ts6e8-bd7mp4.jpg?v=1776852400326"
    },
    { id: "1", isPublished: true, sortOrder: 1, media: { url: "https://cdn.example.com/1.jpg" } },
    { id: "2", isPublished: false, sortOrder: 2, url: "https://cdn.example.com/2.jpg" },
    { id: "4", isPublished: true, sortOrder: 4 }
  ]);

  assert.deepEqual(
    normalized.map((item) => item.id),
    ["1", "3"]
  );
  assert.equal(normalized[1].caption, "Explore Germany");
  assert.equal(
    normalized[1].url,
    "https://storage.googleapis.com/sedifeximage/stores/tAipWCKjLBgMJR5ofEIXEe6F8iw2/promo-gallery/draft-mo9ts6e8-bd7mp4.jpg?v=1776852400326"
  );
});
