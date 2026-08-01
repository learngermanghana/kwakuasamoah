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
  "Started by sharing firsthand and adequate information on visa and travel service.",
  "Expanded into consultation support for study, visit, and relocation routes.",
  "Built a trusted audience across TikTok, YouTube, Instagram, and Facebook,X",
  "Now supports travel planning worldwide"
];

export default function AboutPage() {
  return (
    <div>
      {/* Dark Grid Hero */}
      <section className="relative overflow-hidden bg-[#0B1510] border-b border-emerald-950/40 developer-grid-dark py-16 md:py-20 text-white">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-npontu-green/10 blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 space-y-4">
          <span className="inline-flex rounded-full bg-npontu-green/20 border border-npontu-gold/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-npontu-gold">
            About Kwaku Lotteryy
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl tracking-tight">
            Trusted travel guidance built from real experience.
          </h1>
          <p className="max-w-3xl text-base text-emerald-100/75 leading-relaxed">
            Kwaku helps people who want to visit, study, or join family abroad. The mission is simple: turn confusing migration information into clear, practical action plans.
          </p>
        </div>
      </section>

      {/* Light Developer Grid Content */}
      <section className="mx-auto max-w-5xl px-4 py-20 developer-grid">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-npontu-green">The Story</h2>
            <div className="h-0.5 w-12 bg-npontu-gold rounded-full" />
            <p className="leading-relaxed text-slate-600">
              This brand started from a personal journey from Ghana to the world. Along the way, one truth became
              clear: many people miss life-changing opportunities simply because they lack access to reliable,
              practical guidance.
            </p>
            <p className="leading-relaxed text-slate-600">
              Today, Kwaku Lotteryy brings together engaging content, one-on-one consultations, and structured,
              trusted services to help people make smarter decisions about travel, visa planning, and relocation.
            </p>
            <p className="leading-relaxed text-slate-600 font-medium text-slate-800">
              I have combined real experience, proven strategies, and clear direction in my journey. Hi, I&apos;m
              Kwaku. I&apos;ve gone through this journey myself, and now I help others avoid mistakes.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/services"
                className="rounded-xl bg-npontu-green hover:bg-npontu-green-light px-6 py-3 font-bold text-white transition duration-150 shadow"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 hover:text-npontu-green transition duration-150 shadow-sm"
              >
                Contact Kwaku
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Journey at a glance</h3>
            <div className="h-0.5 w-8 bg-npontu-gold rounded-full" />
            <ul className="space-y-4 text-sm text-slate-600">
              {journeyMilestones.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-npontu-green" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Values Cards */}
      <section className="bg-white border-t border-slate-100 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-npontu-green text-center mb-12">How Kwaku Supports You</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition duration-200">
                <h3 className="font-bold text-slate-800 text-lg mb-2">{value.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
