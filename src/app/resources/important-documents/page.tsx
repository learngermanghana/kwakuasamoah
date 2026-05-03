const extraDocs = [
  "Reference letter samples from lecturers, supervisors, or mentors.",
  "Statement of purpose templates for study-to-work progression.",
  "Interview preparation checklists for online and embassy-related appointments.",
  "Document checklist for passport, transcripts, certificates, and translated records."
];

export default function ImportantDocumentsResourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#0b2d4f]">Important Supporting Documents</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        Additional resources that can strengthen your application and migration plan.
      </p>
      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
        {extraDocs.map((tip) => (
          <li key={tip} className="flex gap-3 rounded-xl border bg-[#fffdf8] p-4">
            <span className="mt-2 h-2 w-2 rounded-full bg-[#0d6f73]" aria-hidden />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
