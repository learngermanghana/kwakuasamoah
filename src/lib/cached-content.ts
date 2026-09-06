import "server-only";
import { unstable_cache } from "next/cache";
import { packages } from "@/data/packages";
import {
  defaultHeroSlide,
  defaultSocialSettings,
  getBlogPosts,
  getGalleryData,
  getHomeHeroSlide,
  getServiceData,
  getSocialSettings,
  type BlogPost,
  type GalleryItem,
  type HeroSlide,
  type ServiceItem,
  type SocialSettings,
} from "@/lib/data";
import { getReviewData, type ReviewItem } from "@/lib/reviews";

const CONTENT_TIMEOUT_MS = 6_000;

const fallbackServices: ServiceItem[] = packages.map((pkg) => ({
  id: pkg.slug,
  serviceName: pkg.title,
  category: pkg.destination,
  description: pkg.summary,
  priceLabel: pkg.priceFrom,
  price: undefined,
  image: pkg.image,
  imageAlt: pkg.title,
}));

const fallbackGallery: GalleryItem[] = fallbackServices.slice(0, 6).map((service) => ({
  id: service.id,
  url: service.image,
  alt: service.imageAlt,
  caption: service.serviceName,
}));

async function withTimeout<T>(work: Promise<T>, fallback: T, timeoutMs = CONTENT_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      work,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

const cachedServices = unstable_cache(
  () => withTimeout(getServiceData(), fallbackServices),
  ["kwaku-content-services-v2"],
  { revalidate: 15 * 60 },
);

const cachedGallery = unstable_cache(
  () => withTimeout(getGalleryData(), fallbackGallery),
  ["kwaku-content-gallery-v2"],
  { revalidate: 30 * 60 },
);

const cachedHero = unstable_cache(
  () => withTimeout(getHomeHeroSlide(), defaultHeroSlide),
  ["kwaku-content-home-hero-v2"],
  { revalidate: 60 * 60 },
);

const cachedSocialSettings = unstable_cache(
  () => withTimeout(getSocialSettings(), defaultSocialSettings),
  ["kwaku-content-social-settings-v2"],
  { revalidate: 60 * 60 },
);

const cachedReviews = unstable_cache(
  () => withTimeout(getReviewData(6), [] as ReviewItem[]),
  ["kwaku-content-reviews-v2"],
  { revalidate: 60 * 60 },
);

const cachedBlogIndex = unstable_cache(
  () => withTimeout(getBlogPosts(), [] as BlogPost[]),
  ["kwaku-content-blog-index-v2"],
  { revalidate: 60 * 60 },
);

const cachedBlogDetail = unstable_cache(
  (slug: string) => withTimeout(getBlogPosts(slug), [] as BlogPost[]),
  ["kwaku-content-blog-detail-v2"],
  { revalidate: 60 * 60 },
);

export function getCachedServices(): Promise<ServiceItem[]> {
  return cachedServices();
}

export function getCachedGallery(): Promise<GalleryItem[]> {
  return cachedGallery();
}

export function getCachedHero(): Promise<HeroSlide> {
  return cachedHero();
}

export function getCachedSocialSettings(): Promise<SocialSettings> {
  return cachedSocialSettings();
}

export function getCachedReviews(): Promise<ReviewItem[]> {
  return cachedReviews();
}

export function getCachedBlogPosts(slug?: string): Promise<BlogPost[]> {
  return slug ? cachedBlogDetail(slug) : cachedBlogIndex();
}
