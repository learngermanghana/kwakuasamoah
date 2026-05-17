import Link from "next/link";
import { notFound } from "next/navigation";
import { getGalleryData, type GalleryItem } from "@/lib/data";

function getCountryGuideLink(caption: string) {
  const text = caption.toLowerCase();

  if (text.includes("america") || text.includes("usa") || text.includes("united states")) {
    return {
      label: "Read the United States of America visa guide",
      href: "/countries#country-united-states-of-america"
    };
  }

  return {
    label: "Read all country visa guides",
    href: "/countries"
  };
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gallery = await getGalleryData();
  const photo = gallery.find((item: GalleryItem) => item.id === id);

  if (!photo) {
    notFound();
  }

  const countryGuide = getCountryGuideLink(photo.caption || photo.alt);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/" className="text-sm font-semibold text-[#0d6f73]">
        ← Back to Home
      </Link>
      <article className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <img src={photo.url} alt={photo.alt} className="h-[420px] w-full bg-slate-50 object-contain" />
        <div className="space-y-4 p-6">
          <h1 className="text-2xl font-bold text-[#0b2d4f]">{photo.caption || "Travel Story"}</h1>
          <p className="text-slate-700">
            Explore this destination and use our country-based visa guide to understand requirements, documents,
            and practical next steps before you apply.
          </p>
          <Link href={countryGuide.href} className="inline-block rounded-xl bg-[#0d6f73] px-4 py-2 font-semibold text-white">
            {countryGuide.label}
          </Link>
        </div>
      </article>
    </div>
  );
}
