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
      <section className="bg-gradient-to-br from-emerald-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="max-w-3xl">
            <p className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              Travel, Relocation and Study Abroad Support
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              From Ghana to Europe, Canada, and the USA — helping you travel and relocate smarter.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Get trusted travel updates, relocation guidance, visa support, and one-on-one consultation for destinations outside Asia.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white">
                Book Consultation
              </Link>
              <a href={getWhatsAppLink("Hello, I want travel or relocation support.")} target="_blank" className="rounded-2xl border px-6 py-3 font-semibold">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Featured Services</h2>
          <p className="mt-2 text-slate-600">Popular services for travel, study, and relocation support.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredServices.map((item) => <PackageCard key={item.id} item={item} />)}
        </div>
        <div className="mt-8">
          <Link href="/services" className="text-sm font-semibold text-emerald-700">
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
          <a href="https://www.youtube.com/@kwakulotteryy" target="_blank" className="text-sm font-semibold text-emerald-700">
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

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-3xl font-bold">Why people choose Kwaku</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-bold">Real Experience</h3><p className="mt-2 text-slate-600">Built from a real migration journey from Ghana to the Netherlands through studies.</p></div>
            <div className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-bold">Clear Guidance</h3><p className="mt-2 text-slate-600">Simple travel and relocation advice tailored for beginners and first-time applicants.</p></div>
            <div className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-bold">Fast Support</h3><p className="mt-2 text-slate-600">Quick consultation and WhatsApp support for urgent travel questions.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
