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
        Cover letter examples to explain why you are a strong match for a role abroad.
      </p>
      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
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
