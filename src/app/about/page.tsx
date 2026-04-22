import Link from "next/link";

const values = [
  {
    title: "Practical guidance",
    description:
      "Every recommendation is focused on clear next steps you can actually take, not generic motivation."
  },
  {
    title: "Transparent process",
    description:
      "You get realistic timelines, document expectations, and honest feedback before you spend time or money."
  },
  {
    title: "Support that follows through",
    description:
      "From your first question to your travel plan, the goal is to keep you confident and informed at each stage."
  }
];

const journeyMilestones = [
  "Started by sharing firsthand relocation lessons from Ghana to Europe.",
  "Expanded into consultation support for study, visit, and relocation routes.",
  "Built a trusted audience across TikTok, YouTube, Instagram, and Facebook.",
  "Now supports travel planning for Europe, Canada, and the USA."
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-[#0b2d4f]">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <p className="inline-block rounded-full border border-[#89d5d2]/40 bg-[#0d6f73]/40 px-3 py-1 text-sm font-semibold text-[#d9f7f5]">
            About Kwaku Lottery
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
            Trusted travel and relocation guidance built from real experience.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#f4f1e6]">
            Kwaku helps people who want to study, visit, or relocate to Europe, Canada, and the USA. The mission is
            simple: turn confusing migration information into clear, practical action plans.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-[#0b2d4f]">The Story</h2>
            <p className="mt-4 leading-8 text-slate-600">
              This brand started from a personal journey from Ghana to Europe through studies. Along the way, one
              truth became obvious: many people miss opportunities because they lack access to reliable and practical
              guidance.
            </p>
            <p className="mt-4 leading-8 text-slate-600">
              Today, Kwaku Lottery combines social content, one-on-one consultation, and structured services to help
              people make smarter decisions about travel, visa planning, and relocation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-2xl bg-[#0d6f73] px-6 py-3 font-semibold text-white transition hover:bg-[#0a5b5f]"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="rounded-2xl border border-[#0d6f73] px-6 py-3 font-semibold text-[#0d6f73] transition hover:bg-[#0d6f73]/5"
              >
                Contact Kwaku
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border bg-[#f8f4ea] p-6">
            <h3 className="text-lg font-bold text-[#0b2d4f]">Journey at a glance</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {journeyMilestones.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#0d6f73]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-16">
          <h2 className="text-2xl font-bold text-[#0b2d4f]">How Kwaku supports you</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="font-bold text-[#0b2d4f]">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
