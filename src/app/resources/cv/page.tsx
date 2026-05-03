const cvTips = [
  "Keep your CV to 1-2 pages with clean headings and no graphics-heavy layout.",
  "Add a short profile summary showing your study background and work direction.",
  "Highlight internships, projects, volunteering, and certifications with results.",
  "Match keywords to the job posting so recruiters and ATS tools can find your profile faster."
];

export default function CVResourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#0b2d4f]">Student-to-Work CV Samples</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        Use these CV structures when transitioning from school to international work opportunities.
      </p>
      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
        {cvTips.map((tip) => (
          <li key={tip} className="flex gap-3 rounded-xl border bg-[#fffdf8] p-4">
            <span className="mt-2 h-2 w-2 rounded-full bg-[#0d6f73]" aria-hidden />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
