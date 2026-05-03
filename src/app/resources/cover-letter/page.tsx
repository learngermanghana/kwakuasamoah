const coverLetterTips = [
  "Open with the exact role title and a one-line value statement.",
  "Connect your academic and practical experience to the employer's needs.",
  "Mention relocation readiness, language skills, and legal work pathways where relevant.",
  "Close with confidence and a request for an interview."
];

export default function CoverLetterResourcesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#0b2d4f]">Job Cover Letter Samples</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        Realistic sample language you can adapt for job applications abroad.
      </p>

      <article className="mt-8 rounded-2xl border bg-white p-6 shadow-sm text-sm leading-7 text-slate-700">
        <p>May 3, 2026</p>
        <p className="mt-3">Hiring Manager<br />Maple Guest Services<br />Toronto, Canada</p>
        <p className="mt-4">Dear Hiring Manager,</p>
        <p className="mt-3">
          I am applying for the Customer Service Representative role. I recently completed my business studies and have practical front-desk experience supporting international guests in fast-paced environments.
        </p>
        <p className="mt-3">
          In my current role, I manage high-volume check-ins, resolve booking issues, and maintain accurate records in CRM tools. I consistently receive positive feedback for clear communication and calm problem-solving, especially during peak travel periods.
        </p>
        <p className="mt-3">
          I am ready to relocate, available for shift schedules, and committed to representing your brand with professionalism. I would welcome the opportunity to discuss how I can contribute to your team.
        </p>
        <p className="mt-3">Thank you for your time and consideration.</p>
        <p className="mt-3">Sincerely,<br />Ama Mensah</p>
      </article>

      <h2 className="mt-10 text-2xl font-bold text-[#0b2d4f]">Cover letter template checklist</h2>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
        {coverLetterTips.map((tip) => (
          <li key={tip} className="flex gap-3 rounded-xl border bg-[#fffdf8] p-4">
            <span className="mt-2 h-2 w-2 rounded-full bg-[#0d6f73]" aria-hidden />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
