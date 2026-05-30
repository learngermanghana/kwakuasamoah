import test from "node:test";
import assert from "node:assert/strict";
import {
  getGalleryImageUrl,
  normalizeIntegrationGallery,
  normalizePublishedGallery
} from "./gallery-utils.js";

test("getGalleryImageUrl supports url, imageUrl, image, and media.url fallback order", () => {
  assert.equal(getGalleryImageUrl({ url: "https://cdn.example.com/direct.jpg" }), "https://cdn.example.com/direct.jpg");
  assert.equal(getGalleryImageUrl({ imageUrl: "https://cdn.example.com/image-url.jpg" }), "https://cdn.example.com/image-url.jpg");
  assert.equal(getGalleryImageUrl({ image: "https://cdn.example.com/image.jpg" }), "https://cdn.example.com/image.jpg");
  assert.equal(getGalleryImageUrl({ media: { url: "https://cdn.example.com/media.jpg" } }), "https://cdn.example.com/media.jpg");
  assert.equal(getGalleryImageUrl({ alt: null }), "");
});

test("normalizePublishedGallery keeps legacy published items with images and sorts by sortOrder", () => {
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

test("normalizeIntegrationGallery flattens album-based gallery in album and image order", () => {
  const normalized = normalizeIntegrationGallery({
    albums: [
      { id: "events", title: "Events", sortOrder: 2 },
      { id: "drafts", title: "Drafts", isPublished: false, sortOrder: 0 },
      { albumId: "graduation", title: "Graduation 2026", sortOrder: 1 }
    ],
    images: [
      { id: "hidden-image", albumId: "graduation", url: "https://cdn.example.com/hidden.jpg", isPublished: false, sortOrder: 0 },
      { id: "event-1", albumId: "events", url: "https://cdn.example.com/event.jpg", sortOrder: 1 },
      { id: "missing-url", albumId: "graduation", sortOrder: 2 },
      { id: "draft-1", albumId: "drafts", url: "https://cdn.example.com/draft.jpg", sortOrder: 1 },
      { imageId: "grad-1", albumId: "graduation", url: "https://cdn.example.com/grad.jpg", caption: "Graduate", sortOrder: 1 }
    ]
  });

  assert.deepEqual(
    normalized.map((item) => item.id),
    ["grad-1", "event-1"]
  );
  assert.equal(normalized[0].caption, "Graduate");
  assert.equal(normalized[1].caption, "Events");
});

test("normalizeIntegrationGallery supports data wrapper and homepage limit", () => {
  const normalized = normalizeIntegrationGallery({
    data: {
      galleryAlbums: [{ id: "products", title: "Products" }],
      galleryImages: [
        { id: "1", albumId: "products", url: "https://cdn.example.com/1.jpg", sortOrder: 1 },
        { id: "2", albumId: "products", url: "https://cdn.example.com/2.jpg", sortOrder: 2 }
      ]
    }
  }, 1);

  assert.deepEqual(normalized.map((item) => item.id), ["1"]);
});
