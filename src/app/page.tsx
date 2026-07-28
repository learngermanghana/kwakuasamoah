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

  return (
    <div>
      {/* 1. Hero Section (DARK MODE) */}
      <section className="relative overflow-hidden bg-[#050D0A] text-white border-b border-emerald-950/40 developer-grid-dark py-20 md:py-32">
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-emerald-700/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 h-[280px] w-[280px] rounded-full bg-npontu-gold/5 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center gap-12">
          {/* Hero Left Content */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-npontu-gold/30 bg-[#0B2117] px-4 py-1.5 text-xs font-bold text-npontu-gold tracking-wide uppercase">
              {hero.eyebrow}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl tracking-tight">
              <span className="bg-gradient-to-r from-white via-slate-100 to-npontu-gold bg-clip-text text-transparent block">
                {hero.title.split(" ").slice(0, -1).join(" ")}
              </span>
              <span className="text-npontu-gold block mt-1">
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
                  className="rounded-xl bg-[#12492A] hover:bg-[#1B6B3A] text-white px-8 py-4 font-bold text-sm transition shadow-lg hover:shadow-emerald-950/40 hover:-translate-y-[2px] active:translate-y-0 duration-200"
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
                href="https://cal.com/kwakulotteryy/15min"
                data-cal-modal
                className="rounded-xl bg-[#F3BA00] hover:bg-[#E8A500] text-black px-8 py-4 font-bold text-sm transition shadow-lg hover:-translate-y-[2px] active:translate-y-0 duration-200 cursor-pointer"
              >
                Book Now
              </a>
            </div>
          </div>

          {/* Hero Right Media */}
          <div className="w-full lg:w-96 shrink-0 relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#1B6B3A] to-[#F5C518] opacity-25 blur-xl group-hover:opacity-30 transition duration-300" />
            <div className="relative rounded-2xl border border-emerald-900/60 bg-[#0B1510]/80 p-3 shadow-2xl backdrop-blur">
              <img
                src={hero.imageUrl}
                alt="Kwaku Lotteryy Travel"
                className="w-full h-80 object-cover rounded-xl transition duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Metrics Section (LIGHT MODE) */}
      <section className="relative bg-white py-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-[#FAFBF9] border border-slate-100 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-5xl font-extrabold text-[#0C3823] tracking-tight">500+</span>
              <h4 className="font-bold text-slate-800 mt-2 text-base">Successful Consultations</h4>
              <p className="text-sm text-slate-500 mt-1">
                Completed one-on-one travel routes and migration briefings.
              </p>
            </div>
            <div className="bg-[#FAFBF9] border border-slate-100 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-5xl font-extrabold text-[#0C3823] tracking-tight">15+</span>
              <h4 className="font-bold text-slate-800 mt-2 text-base">Supported Destinations</h4>
              <p className="text-sm text-slate-500 mt-1">
                Comprehensive visa & relocation guides across multiple continents.
              </p>
            </div>
            <div className="bg-[#FAFBF9] border border-slate-100 rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
              <span className="text-5xl font-extrabold text-[#0C3823] tracking-tight">99%</span>
              <h4 className="font-bold text-slate-800 mt-2 text-base">Client Satisfaction</h4>
              <p className="text-sm text-slate-500 mt-1">
                Feedback score based on documentation review and interview prep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Meet Kwaku Section (DARK MODE) */}
      <section className="relative overflow-hidden bg-[#050D0A] text-white py-24 developer-grid-dark border-b border-emerald-950/40">
        <div className="mx-auto max-w-7xl px-4 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3BA00]">Personalized Relocation Guidance</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Meet Kwaku</h2>
            <div className="h-1 w-20 bg-[#F3BA00] rounded-full" />
            <p className="text-base text-emerald-100/70 leading-relaxed">
              Kwaku shares practical guidance from real travel and relocation
              experience, helping you understand each step with clarity before you
              submit.
            </p>
            <p className="text-base text-emerald-100/70 leading-relaxed">
              From document readiness checks to interview strategy, every
              consultation is focused on reducing errors and improving confidence.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-emerald-100/80 font-semibold">
              <li className="flex items-center gap-2">
                <span className="text-[#F3BA00]">-</span> Tailored Document Checklists
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F3BA00]">-</span> Real Relocation Insights
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F3BA00]">-</span> Visa Interview Preparation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F3BA00]">-</span> One-on-One Action Plans
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-4 rounded-3xl border border-emerald-500/10 pointer-events-none" />
              <div className="absolute -inset-2 rounded-3xl border border-npontu-gold/20 pointer-events-none group-hover:scale-[1.02] transition duration-300" />
              <figure className="relative overflow-hidden rounded-2xl border border-emerald-900 bg-[#0B1510] shadow-2xl">
                <Image
                  src={kwakuPortrait}
                  alt="Kwaku portrait"
                  width={640}
                  height={800}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  priority
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Services Section (LIGHT MODE) */}
      <section className="bg-[#FAFBF9] mx-auto max-w-none px-4 py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E8A500]">Our Core Offerings</span>
              <h2 className="text-3xl font-extrabold text-[#0C3823] tracking-tight mt-1">
                Featured Services
              </h2>
              <p className="mt-2 text-slate-500 max-w-lg">
                Sleek, transparent, and step-by-step relocation/visa consultation packages.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-bold text-[#1B6B3A] hover:text-[#2A8F52] transition duration-150 group"
            >
              Explore all services <span className="ml-1 group-hover:translate-x-1 transition duration-150">&rarr;</span>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featuredServices.map((item) => (
              <PackageCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Destination Carousel Showcase (DARK MODE) */}
      <section className="bg-[#050D0A] max-w-none py-20 border-b border-emerald-950/40 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F3BA00]">Interactive Showpiece</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">Featured Travel Expeditions</h2>
            <p className="text-emerald-100/60 text-sm mt-1">Explore real flight bookings, study guides, and visa packages dynamically.</p>
          </div>
          <TravelCarousel slides={galleryItems} />
        </div>
      </section>

      {/* Supported Destinations / Countries (LIGHT MODE) */}
      <section className="bg-[#FAFBF9] py-24 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8A500]">Global Reach</span>
            <h2 className="text-3xl font-extrabold text-[#0C3823] tracking-tight mt-1">
              Supported Destinations
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              We provide comprehensive visa guidance and travel planning for the most requested destinations worldwide.
            </p>
            <div className="h-1 w-16 bg-[#F3BA00] mx-auto mt-6 rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["United States", "United Kingdom", "Canada", "Germany", "Netherlands", "Spain", "Italy", "Australia"].map((country) => (
              <Link 
                href={`/countries#country-${country.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                key={country}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-npontu-green/30 transition duration-300"
              >
                <span className="text-sm font-bold text-slate-700 group-hover:text-npontu-green transition duration-150 text-center">
                  {country}
                </span>
                <span className="mt-2 text-[10px] uppercase font-bold text-slate-400 group-hover:text-[#F3BA00] transition duration-150">
                  View Guide &rarr;
                </span>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/countries"
              className="inline-flex items-center text-sm font-bold text-[#1B6B3A] hover:text-[#2A8F52] transition duration-150 group"
            >
              See all country guides <span className="ml-1 group-hover:translate-x-1 transition duration-150">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section (LIGHT MODE) */}
      <section className="bg-white py-24 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8A500]">Client Stories</span>
            <h2 className="text-3xl font-extrabold text-[#0C3823] tracking-tight mt-1">
              What Relocators Say
            </h2>
            <div className="h-1 w-16 bg-[#F3BA00] mx-auto mt-4 rounded-full" />
          </div>

          {reviews.length ? (
            <div className="grid gap-8 md:grid-cols-3">
              {reviews.map((review) => (
                <blockquote key={review.id} className="rounded-2xl border border-slate-200 bg-[#FAFBF9] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
                  <div>
                    <div className="text-sm font-bold tracking-[0.18em] text-[#E8A500]" aria-label={`${review.rating} out of 5 stars`}>
                      {renderStars(review.rating)}
                    </div>
                    <p className="mt-4 text-slate-600 italic text-sm leading-relaxed">“{review.reviewText}”</p>
                  </div>
                  <footer className="mt-6 border-t border-slate-200 pt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#1B6B3A]/10 flex items-center justify-center font-bold text-xs text-[#1B6B3A]">
                      {review.name[0]}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {review.name}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-6">Reviews will appear here shortly.</p>
          )}
        </div>
      </section>

      {/* 7. Latest Insights Blog Section (DARK MODE) */}
      <section className="bg-[#050D0A] text-white py-24 border-b border-emerald-950/40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F3BA00]">Insights & Updates</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">Latest Travel News</h2>
              <p className="mt-2 text-emerald-100/60">
                Guidance write-ups, visa updates, and documentation requirements.
              </p>
            </div>
            <Link href="/blog" className="inline-flex items-center text-sm font-bold text-[#F3BA00] hover:text-[#F3BA00]/80 transition duration-150 group">
              Read all updates <span className="ml-1 group-hover:translate-x-1 transition duration-150">&rarr;</span>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {latestPosts.length ? (
              latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-emerald-900/40 bg-[#0B1510] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5"
                >
                  {post.imageUrl ? (
                    <div className="overflow-hidden h-48 w-full bg-emerald-950/30">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    </div>
                  ) : null}
                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-bold text-[#F3BA00] uppercase tracking-wider">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                        : "General Guide"}
                    </span>
                    <h3 className="line-clamp-2 font-bold text-lg text-white group-hover:text-[#F3BA00] transition duration-150">{post.title}</h3>
                    <p className="line-clamp-3 text-sm text-emerald-100/60 leading-relaxed">
                      {getExcerpt(post.content)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-emerald-100/60 col-span-3 text-center py-6">
                Published blog posts will appear here shortly.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 8. Mailing List Cta Section (LIGHT MODE) */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <MailingList />
        </div>
      </section>
    </div>
  );
}
