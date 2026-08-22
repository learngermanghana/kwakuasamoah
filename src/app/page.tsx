import Image from "next/image";
import Link from "next/link";
import {
  getBlogPosts,
  getGalleryData,
  getHomeHeroSlide,
  getServiceData,
} from "@/lib/data";
import type { GalleryItem, ServiceItem } from "@/lib/data";
import { getReviewData } from "@/lib/reviews";
import { packages } from "@/data/packages";
import { PackageCard } from "@/components/package-card";
import kwakuPortrait from "../../public/image.png";

function getExcerpt(html: string, maxLength = 140) {
  const plainText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

function renderStars(rating: number) {
  const safeRating = Math.min(5, Math.max(1, Math.round(rating || 5)));
  return "★★★★★".slice(0, safeRating);
}

function normalizeServiceKey(service: ServiceItem) {
  return service.serviceName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function removeDuplicateServices(services: ServiceItem[]) {
  const seen = new Set<string>();

  return services.filter((service) => {
    const key = normalizeServiceKey(service);

    if (!key) return true;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export default async function HomePage() {
  const [services, gallery, posts, hero, reviews] = await Promise.all([
    getServiceData(),
    getGalleryData(),
    getBlogPosts(),
    getHomeHeroSlide(),
    getReviewData(6),
  ]);
  const featuredServices = removeDuplicateServices(services).slice(0, 3);
  const studyGuide = packages.find((pkg) => pkg.slug === "netherlands-study-route");
  const galleryItems: GalleryItem[] = gallery.filter(
    (item) => item.id !== "netherlands-study-route",
  );
  const latestPosts = posts.slice(0, 3);
  const heroMobileImageUrl = hero.mobileImageUrl || hero.imageUrl;

  return (
    <div>
      <section className="relative overflow-hidden bg-[#0b2d4f]">
        <picture className="absolute inset-0 h-full w-full">
          {heroMobileImageUrl ? (
            <source media="(max-width: 767px)" srcSet={heroMobileImageUrl} />
          ) : null}
          <img
            src={hero.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(7,33,58,0.9),rgba(11,45,79,0.65))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-28">
          <div className="max-w-3xl text-white">
            <p className="mb-3 inline-block rounded-full border border-[#89d5d2]/40 bg-[#0d6f73]/40 px-3 py-1 text-sm font-semibold text-[#d9f7f5]">
              {hero.eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              <span className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-2 shadow-lg backdrop-blur-sm">
                <span className="bg-gradient-to-r from-[#d9f7f5] via-white to-[#f4f1e6] bg-clip-text text-transparent">
                  {hero.title}
                </span>
                <span aria-hidden="true" className="text-3xl md:text-4xl">
                  ✈️
                </span>
              </span>
            </h1>
            <p className="mt-5 text-lg text-[#f4f1e6]">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              {hero.ctaLabel && hero.ctaHref ? (
                <Link
                  href={hero.ctaHref}
                  className="rounded-2xl bg-[#0d6f73] px-6 py-3 font-semibold text-white transition hover:bg-[#0a5b5f]"
                >
                  {hero.ctaLabel}
                </Link>
              ) : null}
              {hero.secondaryCtaLabel && hero.secondaryCtaHref ? (
                <Link
                  href={hero.secondaryCtaHref}
                  className="rounded-2xl border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  {hero.secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.3fr_0.7fr] md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0b2d4f]">Meet Kwaku</h2>
          <p className="mt-3 text-slate-600">
            Kwaku shares practical guidance from real travel and relocation
            experience, helping you understand each step with clarity before you
            submit.
          </p>
          <p className="mt-3 text-slate-600">
            From document readiness checks to interview strategy, every
            consultation is focused on reducing errors and improving confidence.
          </p>
        </div>
        <figure className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-[#d8d6cf] bg-white shadow-md">
          <Image
            src={kwakuPortrait}
            alt="Kwaku portrait"
            width={640}
            height={800}
            className="h-full w-full object-cover"
          />
        </figure>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0b2d4f]">
            Featured Services
          </h2>
          <p className="mt-2 text-slate-600">
            Popular services for travel, study, and relocation support.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredServices.map((item) => (
            <PackageCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/services"
            className="text-sm font-semibold text-[#0d6f73]"
          >
            View more services
          </Link>
        </div>
      </section>

      {studyGuide ? (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#0b2d4f]">Study Guide</h2>
              <p className="mt-2 text-slate-600">
                Practical step-by-step guidance for students planning their study route abroad.
              </p>
            </div>
            <Link
              href={`/study-guide/${studyGuide.slug}`}
              className="text-sm font-semibold text-[#0d6f73]"
            >
              Open study guide
            </Link>
          </div>
          <Link
            href={`/study-guide/${studyGuide.slug}`}
            className="grid overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md md:grid-cols-[0.9fr_1.1fr]"
          >
            <img
              src={studyGuide.image}
              alt={studyGuide.title}
              className="h-64 w-full object-cover md:h-full"
            />
            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0d6f73]">
                {studyGuide.destination}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#0b2d4f]">
                {studyGuide.title}
              </h3>
              <p className="mt-3 text-slate-600">{studyGuide.summary}</p>
              <span className="mt-5 text-sm font-semibold text-[#0d6f73]">
                Read the full guide →
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Gallery</h2>
            <p className="mt-2 text-slate-600">
              Browse the latest published travel and consultation photos.
            </p>
          </div>
          <Link href="/promo" className="text-sm font-semibold text-[#0d6f73]">
            Explore gallery
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {galleryItems.map((photo) => (
            <Link
              key={photo.id}
              href={`/gallery/${photo.id}`}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="h-48 w-full object-contain bg-slate-50"
              />
              {photo.caption ? (
                <p className="px-3 py-3 text-base font-semibold">
                  {photo.caption}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Latest Blog Updates</h2>
            <p className="mt-2 text-slate-600">
              Read the newest published travel and relocation updates.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-[#0d6f73]">
            View more
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {latestPosts.length ? (
            latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {getExcerpt(post.content)}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-slate-600">
              Published blog posts will appear here shortly.
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#f8f4ea]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-3xl font-bold text-[#0b2d4f]">
            Why people choose Kwaku
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-[#4fb6b2]/30 bg-[#d8f2f1] px-3 py-1 text-sm font-semibold text-[#0d6f73]">
              Response within 24h
            </span>
            <span className="rounded-full border border-[#4fb6b2]/30 bg-[#d8f2f1] px-3 py-1 text-sm font-semibold text-[#0d6f73]">
              One-on-one guidance
            </span>
            <span className="rounded-full border border-[#4fb6b2]/30 bg-[#d8f2f1] px-3 py-1 text-sm font-semibold text-[#0d6f73]">
              Transparent next steps
            </span>
          </div>
          <div className="mt-8 grid gap-6 rounded-2xl border bg-white p-6 md:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-[#0b2d4f]">500+</p>
              <p className="mt-1 text-sm text-slate-600">
                Consultations and travel guidance sessions completed.
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0b2d4f]">15+</p>
              <p className="mt-1 text-sm text-slate-600">
                Visa and relocation routes supported worldwide.
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0b2d4f]">24h</p>
              <p className="mt-1 text-sm text-slate-600">
                Typical first-response window for new inquiries.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold">Real Experience</h3>
              <p className="mt-2 text-slate-600">
                Built from real migration journeys focused on travel and
                relocation support.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold">Clear Guidance</h3>
              <p className="mt-2 text-slate-600">
                Simple travel and relocation advice tailored for beginners and
                first-time applicants.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold">Fast Support</h3>
              <p className="mt-2 text-slate-600">
                Quick consultation and WhatsApp support for urgent travel
                questions.
              </p>
            </div>
          </div>
          {reviews.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {reviews.map((review) => (
                <blockquote key={review.id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold tracking-[0.18em] text-[#d9a441]" aria-label={`${review.rating} out of 5 stars`}>
                    {renderStars(review.rating)}
                  </p>
                  <p className="mt-3 text-slate-700">“{review.reviewText}”</p>
                  <footer className="mt-3 text-sm font-semibold text-slate-600">
                    {review.name}
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
