import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { packages } from "@/data/packages";

type StudyGuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return packages.map((studyGuide) => ({ slug: studyGuide.slug }));
}

export async function generateMetadata({
  params,
}: StudyGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const studyGuide = packages.find((item) => item.slug === slug);

  if (!studyGuide) {
    return { title: "Study Guide" };
  }

  return {
    title: `${studyGuide.title} | Kwaku Lottery`,
    description: studyGuide.summary,
  };
}

export default async function StudyGuidePage({ params }: StudyGuidePageProps) {
  const { slug } = await params;
  const studyGuide = packages.find((item) => item.slug === slug);

  if (!studyGuide) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/" className="text-sm font-semibold text-[#0d6f73]">
        ← Back to Home
      </Link>

      <article className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="grid md:grid-cols-[1fr_1.1fr]">
          <img
            src={studyGuide.image}
            alt={studyGuide.title}
            className="h-full min-h-72 w-full bg-slate-50 object-cover"
          />

          <div className="p-6 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0d6f73]">
              Study Guide · {studyGuide.destination}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[#0b2d4f] md:text-4xl">
              {studyGuide.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {studyGuide.summary}
            </p>

            <div className="mt-8 rounded-2xl bg-[#f8f4ea] p-5">
              <p className="text-sm font-semibold text-slate-500">Guide support from</p>
              <p className="mt-1 text-2xl font-bold text-[#0b2d4f]">
                {studyGuide.priceFrom}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#0b2d4f]">
                What this study guide covers
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {studyGuide.includes.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
                  >
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-xl bg-[#0d6f73] px-5 py-3 font-semibold text-white transition hover:bg-[#0a5b5f]"
              >
                Ask about this study route
              </Link>
              <Link
                href="/services"
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-[#0b2d4f] transition hover:bg-slate-50"
              >
                View services
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
