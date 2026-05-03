import Link from "next/link";

const resourceLinks = [
  {
    href: "/resources/cv",
    title: "CV Samples",
    description: "See a completed student-to-work CV sample and a practical template checklist.",
    sample: "Includes: profile summary, experience bullets with results, and education format."
  },
  {
    href: "/resources/cover-letter",
    title: "Cover Letter (Job)",
    description: "Open a realistic cover letter sample you can copy and adapt for job applications abroad.",
    sample: "Includes: greeting, achievement paragraph, relocation readiness, and strong close."
  },
  {
    href: "/resources/important-documents",
    title: "Important Extras",
    description: "Reference letters, SOP guidance, interview preparation, and document checklists.",
    sample: "Includes: travel document checklist and practical preparation notes."
  }
];

export default function ResourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <p className="inline-block rounded-full border border-[#9fd7d5] bg-[#eaf7f6] px-3 py-1 text-sm font-semibold text-[#0d6f73]">
        Resources
      </p>
      <h1 className="mt-4 text-4xl font-bold text-[#0b2d4f]">Practical Resource Library</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        Explore real samples, not just tips. Each section includes completed examples and clear templates you can use immediately.
      </p>

      <nav className="mt-10 grid gap-5 md:grid-cols-3" aria-label="Resource categories">
        {resourceLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border bg-[#fffdf8] p-6 transition hover:-translate-y-0.5 hover:border-[#0d6f73] hover:shadow-sm"
          >
            <h2 className="text-xl font-bold text-[#0b2d4f]">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            <p className="mt-3 rounded-lg bg-[#eaf7f6] px-3 py-2 text-xs font-medium text-[#0b2d4f]">{item.sample}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-[#0d6f73]">Open resource →</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
