const cvTips = [
  "Keep your CV to 1-2 pages with clean headings and no graphics-heavy layout.",
  "Add a short profile summary showing your study background and work direction.",
  "Highlight internships, projects, volunteering, and certifications with results.",
  "Match keywords to the job posting so recruiters and ATS tools can find your profile faster."
];

const completedCvSample = {
  name: "Ama Mensah",
  location: "Rotterdam, Netherlands",
  title: "Customer Support Associate (Student-to-Work)",
  email: "ama.mensah@email.com",
  phone: "+31 6 1234 5678"
};

export default function CVResourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#0b2d4f]">Student-to-Work CV Samples</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        Use these practical examples when transitioning from school to international work opportunities.
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0d6f73]">Completed CV sample</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0b2d4f]">{completedCvSample.name}</h2>
        <p className="text-sm text-slate-600">{completedCvSample.location} • {completedCvSample.title}</p>
        <p className="mt-2 text-sm text-slate-600">{completedCvSample.email} • {completedCvSample.phone}</p>

        <div className="mt-6 space-y-4 text-sm text-slate-700">
          <div>
            <h3 className="font-semibold text-[#0b2d4f]">Profile Summary</h3>
            <p>Detail-oriented graduate with 2+ years of part-time customer service and admin support experience. Skilled in CRM updates, call handling, and bilingual communication (English/Twi).</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#0b2d4f]">Experience</h3>
            <p><span className="font-medium">Front Desk Assistant — BrightStay Hostel, Rotterdam</span> (2024–2026)</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Managed 40+ guest check-ins per shift with accurate ID/document validation.</li>
              <li>Reduced booking response time by 30% by using a daily message template system.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#0b2d4f]">Education</h3>
            <p>BSc Business Administration — University of Ghana (2023)</p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-bold text-[#0b2d4f]">CV template checklist</h2>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
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
