import Link from "next/link";

const resourceLinks = [
  {
    href: "/resources/cv",
    title: "CV Samples",
    description: "Templates and examples for building a strong student-to-work CV for opportunities abroad."
  },
  {
    href: "/resources/cover-letter",
    title: "Cover Letter (Job)",
    description: "Practical cover letter formats that connect your school background to job requirements."
  },
  {
    href: "/resources/important-documents",
    title: "Important Extras",
    description: "Reference letters, SOP guidance, interview preparation, and document checklists."
  }
];

export default function ResourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <p className="inline-block rounded-full border border-[#9fd7d5] bg-[#eaf7f6] px-3 py-1 text-sm font-semibold text-[#0d6f73]">
        Resources
      </p>
      <h1 className="mt-4 text-4xl font-bold text-[#0b2d4f]">Resource Navigation</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        Choose a resource category below to view sample documents and practical guidance for moving from school to
        work opportunities abroad.
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
            <span className="mt-4 inline-block text-sm font-semibold text-[#0d6f73]">Open resource →</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
