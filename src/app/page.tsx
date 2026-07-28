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
import { PackageCard } from "@/components/package-card";
import { TravelCarousel } from "@/components/travel-carousel";
import { MailingList } from "@/components/mailing-list";
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
  const galleryItems: GalleryItem[] = gallery;
  const latestPosts = posts.slice(0, 3);
  const heroMobileImageUrl = hero.mobileImageUrl || hero.imageUrl;

  return (
    <div>
      {/* Redesigned Premium Dark Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1510] border-b border-emerald-950/40 developer-grid-dark py-12 md:py-24">
        {/* Glow overlay */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-npontu-green/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 h-[300px] w-[300px] rounded-full bg-npontu-gold/5 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-white space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-npontu-gold/30 bg-npontu-green/15 px-4 py-1.5 text-xs font-bold text-npontu-gold tracking-wide uppercase">
              ✨ {hero.eyebrow}
            </div>
            
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl tracking-tight">
              <span className="bg-gradient-to-r from-white via-slate-100 to-npontu-gold bg-clip-text text-transparent block">
                {hero.title.split(" ").slice(0, -1).join(" ")}
              </span>
              <span className="text-npontu-green-light block mt-1">
                {hero.title.split(" ").slice(-1)}
              </span>
            </h1>

            <p className="text-lg text-emerald-100/75 leading-relaxed max-w-2xl">
              {hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {hero.ctaLabel && hero.ctaHref ? (
                <Link
                  href={hero.ctaHref}
                  className="rounded-xl bg-npontu-green hover:bg-npontu-green-light text-white px-8 py-4 font-bold text-sm transition shadow-lg hover:shadow-npontu-green/20 hover:-translate-y-[2px] active:translate-y-0 duration-200"
                >
                  {hero.ctaLabel}
                </Link>
              ) : null}
              {hero.secondaryCtaLabel && hero.secondaryCtaHref ? (
                <Link
                  href={hero.secondaryCtaHref}
                  className="rounded-xl border border-emerald-800 hover:border-npontu-gold text-emerald-100 hover:text-npontu-gold px-8 py-4 font-bold text-sm transition duration-200"
                >
                  {hero.secondaryCtaLabel}
                </Link>
              ) : null}
              <a
                href="https://cal.com/kwakulotteryy"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-npontu-gold hover:bg-npontu-gold-warm text-npontu-surface-dark px-8 py-4 font-bold text-sm transition shadow-lg hover:-translate-y-[2px] active:translate-y-0 duration-200"
              >
                📅 Book via Cal.com
              </a>
            </div>
          </div>

          <div className="w-full lg:w-96 shrink-0 relative group">
            {/* Interactive backdrop glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-npontu-green to-npontu-gold opacity-20 blur-xl group-hover:opacity-30 transition duration-300" />
            <div className="relative rounded-2xl border border-emerald-900/60 bg-[#0F1A14]/80 p-3 shadow-2xl backdrop-blur">
              <img
                src={hero.imageUrl}
                alt="Kwaku Lotteryy Travel"
                className="w-full h-80 object-cover rounded-xl transition duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Meet Kwaku Section */}
      <section className="relative overflow-hidden py-24 developer-grid border-b border-npontu-green/5">
        <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-npontu-gold-warm">Personalized Relocation Guidance</span>
            <h2 className="text-4xl font-extrabold text-npontu-green tracking-tight">Meet Kwaku</h2>
            <div className="h-1 w-20 bg-npontu-gold rounded-full" />
            <p className="text-base text-slate-600 leading-relaxed">
              Kwaku shares practical guidance from real travel and relocation
              experience, helping you understand each step with clarity before you
              submit.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              From document readiness checks to interview strategy, every
              consultation is focused on reducing errors and improving confidence.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Outer decorative borders to look professional */}
              <div className="absolute -inset-4 rounded-3xl border border-npontu-green/10 pointer-events-none" />
              <div className="absolute -inset-2 rounded-3xl border border-npontu-gold/20 pointer-events-none group-hover:scale-[1.02] transition duration-300" />
              <figure className="relative overflow-hidden rounded-2xl border border-[#d8d6cf] bg-white shadow-xl">
                <Image
                  src={kwakuPortrait}
                  alt="Kwaku portrait"
                  width={640}
                  height={800}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sliding Destination Showcase */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-npontu-gold-warm">Interactive Showpiece</span>
          <h2 className="text-3xl font-extrabold text-npontu-green tracking-tight mt-1">Featured Travel Expeditions</h2>
          <p className="text-slate-500 text-sm mt-1">Explore real flight bookings, study guides, and visa packages dynamically.</p>
        </div>
        <TravelCarousel />
      </section>

      {/* Redesigned Featured Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 border-b border-npontu-green/5">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-npontu-gold-warm">Our Core Offerings</span>
            <h2 className="text-3xl font-extrabold text-npontu-green tracking-tight mt-1">
              Featured Services
            </h2>
            <p className="mt-2 text-slate-500 max-w-lg">
              Sleek, transparent, and step-by-step relocation/visa consultation packages.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center text-sm font-bold text-npontu-green hover:text-npontu-green-light transition duration-150 group"
          >
            Explore all services <span className="ml-1 group-hover:translate-x-1 transition duration-150">&rarr;</span>
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {featuredServices.map((item) => (
            <PackageCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Redesigned Gallery Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 border-b border-npontu-green/5">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-npontu-gold-warm">Visual Highlights</span>
            <h2 className="text-3xl font-extrabold text-npontu-green tracking-tight mt-1">Gallery Portfolio</h2>
            <p className="mt-2 text-slate-500">
              Snapshots of student orientations, travel arrivals, and client successes.
            </p>
          </div>
          <Link href="/promo" className="inline-flex items-center text-sm font-bold text-npontu-green hover:text-npontu-green-light transition duration-150 group">
            View full gallery <span className="ml-1 group-hover:translate-x-1 transition duration-150">&rarr;</span>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {galleryItems.map((photo) => (
            <Link
              key={photo.id}
              href={`/gallery/${photo.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <div className="overflow-hidden h-52 w-full bg-slate-50 relative">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {photo.caption ? (
                <div className="p-4 border-t border-slate-100 bg-white">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-npontu-green transition duration-150 truncate">
                    {photo.caption}
                  </p>
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {/* Redesigned Blog Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 border-b border-npontu-green/5">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-npontu-gold-warm">Insights & Updates</span>
            <h2 className="text-3xl font-extrabold text-npontu-green tracking-tight mt-1">Latest Travel News</h2>
            <p className="mt-2 text-slate-500">
              Guidance write-ups, visa updates, and documentation requirements.
            </p>
          </div>
          <Link href="/blog" className="inline-flex items-center text-sm font-bold text-npontu-green hover:text-npontu-green-light transition duration-150 group">
            Read all updates <span className="ml-1 group-hover:translate-x-1 transition duration-150">&rarr;</span>
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {latestPosts.length ? (
            latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1.5"
              >
                {post.imageUrl ? (
                  <div className="overflow-hidden h-48 w-full bg-slate-50">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <span className="text-[10px] font-bold text-npontu-gold-warm uppercase tracking-wider">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                      : "General Guide"}
                  </span>
                  <h3 className="line-clamp-2 font-bold text-lg text-slate-800 group-hover:text-npontu-green transition duration-150 mt-1">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-500 leading-relaxed">
                    {getExcerpt(post.content)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-slate-500 col-span-3 text-center py-6">
              Published blog posts will appear here shortly.
            </p>
          )}
        </div>
      </section>

      {/* Redesigned Testimonials & Core Stats Section */}
      <section className="bg-white py-24 border-b border-npontu-green/5">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-npontu-gold-warm">Proven Track Record</span>
            <h2 className="text-3xl font-extrabold text-npontu-green tracking-tight mt-1">
              Why People Relocate with Kwaku
            </h2>
            <div className="h-1 w-16 bg-npontu-gold mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid gap-8 rounded-3xl border border-slate-150 bg-npontu-surface-light/40 p-8 md:grid-cols-3 shadow-inner">
            <div className="space-y-2 p-4">
              <p className="text-4xl font-extrabold text-npontu-green">500+</p>
              <h4 className="font-bold text-slate-800">Success Consultations</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Consultations and travel guidance sessions completed with direct feedback loops.
              </p>
            </div>
            <div className="space-y-2 p-4 border-t md:border-t-0 md:border-l border-slate-200/60">
              <p className="text-4xl font-extrabold text-npontu-green">15+</p>
              <h4 className="font-bold text-slate-800">Supported Countries</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Visa policies and relocation routes supported globally across Europe, Americas & Asia.
              </p>
            </div>
            <div className="space-y-2 p-4 border-t md:border-t-0 md:border-l border-slate-200/60">
              <p className="text-4xl font-extrabold text-npontu-green">24h</p>
              <h4 className="font-bold text-slate-800">Response Speed</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Fast first-response window, making sure your documents are processed without delay.
              </p>
            </div>
          </div>

          {/* Testimonial Cards */}
          {reviews.length ? (
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {reviews.map((review) => (
                <blockquote key={review.id} className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                  <div>
                    <div className="text-sm font-bold tracking-[0.18em] text-[#d9a441]" aria-label={`${review.rating} out of 5 stars`}>
                      {renderStars(review.rating)}
                    </div>
                    <p className="mt-4 text-slate-600 italic text-sm leading-relaxed">“{review.reviewText}”</p>
                  </div>
                  <footer className="mt-6 border-t border-slate-100 pt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-npontu-green/10 flex items-center justify-center font-bold text-xs text-npontu-green">
                      {review.name[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {review.name}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : null}

          {/* mailing list block */}
          <div className="mt-20">
            <MailingList />
          </div>
        </div>
      </section>
    </div>
  );
}
