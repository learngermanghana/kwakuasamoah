import Link from "next/link";
import { getGalleryData, getServiceData, getWhatsAppLink, getYouTubeVideos } from "@/lib/data";
import { PackageCard } from "@/components/package-card";

export default async function HomePage() {
  const services = await getServiceData();
  const featuredServices = services.slice(0, 3);
  const gallery = await getGalleryData();
  const videos = await getYouTubeVideos();

  return (
    <div>
      <section
        className="relative overflow-hidden bg-[#0b2d4f]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(7, 33, 58, 0.9), rgba(11, 45, 79, 0.65)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-28">
          <div className="max-w-3xl text-white">
            <p className="mb-3 inline-block rounded-full border border-[#89d5d2]/40 bg-[#0d6f73]/40 px-3 py-1 text-sm font-semibold text-[#d9f7f5]">
              Travel, Relocation and Study Abroad Support
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              From Africa to Europe, Canada, and the USA — helping you travel and relocate smarter.
            </h1>
            <p className="mt-5 text-lg text-[#f4f1e6]">
              Get trusted travel updates, relocation guidance, visa support, and one-on-one consultation for destinations outside Asia.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="rounded-2xl bg-[#0d6f73] px-6 py-3 font-semibold text-white transition hover:bg-[#0a5b5f]">
                Book Consultation
              </Link>
              <a
                href={getWhatsAppLink("Hello, I want travel or relocation support.")}
                target="_blank"
                className="rounded-2xl border border-[#e9ddc3] px-6 py-3 font-semibold text-[#f4f1e6] transition hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0b2d4f]">Featured Services</h2>
          <p className="mt-2 text-slate-600">Popular services for travel, study, and relocation support.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredServices.map((item) => <PackageCard key={item.id} item={item} />)}
        </div>
        <div className="mt-8">
          <Link href="/services" className="text-sm font-semibold text-[#0d6f73]">
            View more services
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Gallery</h2>
            <p className="mt-2 text-slate-600">Photos synced from Sedifex integration gallery.</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {gallery.map((photo) => (
            <figure key={photo.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              {photo.caption ? <h3 className="px-3 pt-3 text-base font-semibold">{photo.caption}</h3> : null}
              <img src={photo.url} alt={photo.alt} className="h-48 w-full object-cover" />
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Latest Videos</h2>
            <p className="mt-2 text-slate-600">Fresh updates from the Kwaku Lottery YouTube channel.</p>
          </div>
          <a href="https://www.youtube.com/@kwakulotteryy" target="_blank" className="text-sm font-semibold text-[#0d6f73]">
            View channel
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {videos.length ? videos.map((video) => (
            <a key={video.id} href={video.link} target="_blank" className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <img src={video.thumbnail} alt={video.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="line-clamp-2 font-semibold">{video.title}</h3>
                <p className="mt-2 text-xs text-slate-500">{video.published ? new Date(video.published).toLocaleDateString() : ""}</p>
              </div>
            </a>
          )) : (
            <p className="text-slate-600">Videos will appear here shortly.</p>
          )}
        </div>
      </section>

      <section className="bg-[#f8f4ea]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-3xl font-bold text-[#0b2d4f]">Why people choose Kwaku</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-[#4fb6b2]/30 bg-[#d8f2f1] px-3 py-1 text-sm font-semibold text-[#0d6f73]">Response within 24h</span>
            <span className="rounded-full border border-[#4fb6b2]/30 bg-[#d8f2f1] px-3 py-1 text-sm font-semibold text-[#0d6f73]">One-on-one guidance</span>
            <span className="rounded-full border border-[#4fb6b2]/30 bg-[#d8f2f1] px-3 py-1 text-sm font-semibold text-[#0d6f73]">Transparent next steps</span>
          </div>
          <div className="mt-8 grid gap-6 rounded-2xl border bg-white p-6 md:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-[#0b2d4f]">500+</p>
              <p className="mt-1 text-sm text-slate-600">Consultations and travel guidance sessions completed.</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0b2d4f]">15+</p>
              <p className="mt-1 text-sm text-slate-600">Visa and relocation routes supported across Europe, Canada, and the USA.</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0b2d4f]">24h</p>
              <p className="mt-1 text-sm text-slate-600">Typical first-response window for new inquiries.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-bold">Real Experience</h3><p className="mt-2 text-slate-600">Built from real migration journeys from Africa to Europe through studies and relocation.</p></div>
            <div className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-bold">Clear Guidance</h3><p className="mt-2 text-slate-600">Simple travel and relocation advice tailored for beginners and first-time applicants.</p></div>
            <div className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-bold">Fast Support</h3><p className="mt-2 text-slate-600">Quick consultation and WhatsApp support for urgent travel questions.</p></div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <blockquote className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-slate-700">“I got clear steps for my study route and avoided costly mistakes.”</p>
              <footer className="mt-3 text-sm font-semibold text-slate-600">Ama — Netherlands</footer>
            </blockquote>
            <blockquote className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-slate-700">“The consultation made my Canada visitor planning straightforward.”</p>
              <footer className="mt-3 text-sm font-semibold text-slate-600">Kojo — Canada</footer>
            </blockquote>
            <blockquote className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-slate-700">“Very responsive on WhatsApp and practical with document prep.”</p>
              <footer className="mt-3 text-sm font-semibold text-slate-600">Abena — USA</footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
}
