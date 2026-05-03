const resourceTabs = [
  {
    id: "cv",
    label: "CV Samples",
    title: "Student-to-Work CV Samples",
    description:
      "Use these CV structures when transitioning from school to international work opportunities. Focus on measurable outcomes, relevant projects, and clear visa-friendly formatting.",
    tips: [
      "Keep your CV to 1-2 pages with clean headings and no graphics-heavy layout.",
      "Add a short profile summary showing your study background and work direction.",
      "Highlight internships, projects, volunteering, and certifications with results.",
      "Match keywords to the job posting so recruiters and ATS tools can find your profile faster."
    ]
  },
  {
    id: "cover-letter",
    label: "Cover Letter (Job)",
    title: "Job Cover Letter Samples",
    description:
      "These cover letter examples help you explain why you are a strong match for a role abroad, even if your experience started in school or entry-level positions.",
    tips: [
      "Open with the exact role title and a one-line value statement.",
      "Connect your academic and practical experience to the employer's needs.",
      "Mention relocation readiness, language skills, and legal work pathways where relevant.",
      "Close with confidence and a request for an interview."
    ]
  },
  {
    id: "extras",
    label: "Important Extras",
    title: "Other Important Documents",
    description:
      "Beyond your CV and cover letter, these supporting resources can improve your chances for school-to-work migration plans.",
    tips: [
      "Reference letter samples from lecturers, supervisors, or mentors.",
      "Statement of purpose templates for study-to-work progression.",
      "Interview preparation checklists for online and embassy-related appointments.",
      "Document checklist for passport, transcripts, certificates, and translated records."
    ]
  }
];

export default function ResourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <p className="inline-block rounded-full border border-[#9fd7d5] bg-[#eaf7f6] px-3 py-1 text-sm font-semibold text-[#0d6f73]">
        Resources
      </p>
      <h1 className="mt-4 text-4xl font-bold text-[#0b2d4f]">CV and Job Document Samples for Travel Abroad</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        Explore practical templates and guidance for moving from school to work opportunities abroad. Start with CV
        samples, review job cover letters, and use the extra document checklist to stay prepared.
      </p>

      <nav className="mt-8 flex flex-wrap gap-3" aria-label="Resource tabs">
        {resourceTabs.map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className="rounded-full border border-[#c9c7bf] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0d6f73] hover:text-[#0d6f73]"
          >
            {tab.label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-8">
        {resourceTabs.map((tab) => (
          <article key={tab.id} id={tab.id} className="scroll-mt-28 rounded-2xl border bg-[#fffdf8] p-6">
            <h2 className="text-2xl font-bold text-[#0b2d4f]">{tab.title}</h2>
            <p className="mt-3 leading-8 text-slate-600">{tab.description}</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {tab.tips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#0d6f73]" aria-hidden />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
