import Link from "next/link";

type CountryGuide = {
  country: string;
  visaType: string;
  writeUp: string;
  whoNeedsIt: string[];
  steps: string[];
  documents: string[];
  processingAndFees: string[];
  tips: string[];
};

const guides: CountryGuide[] = [
  {
    country: "United States of America",
    visaType: "Nonimmigrant visa (most commonly B1/B2)",
    writeUp: "The United States remains one of the most requested destinations for tourism, family visits, conferences, and short business meetings. A strong U.S. file is built on clarity: your DS-160 details, your interview answers, your travel plan, and your financial evidence should all tell the same story. Applicants who prepare a simple timeline of trip purpose, funding source, and return plans usually communicate better at interview.",
    whoNeedsIt: ["Applicants from non–Visa Waiver Program countries.", "Tourism, family visit, and short business travelers.", "Transit travelers depending on itinerary and nationality."],
    steps: ["Choose visa class.", "Complete DS-160.", "Pay MRV fee and book appointments.", "Attend biometrics/interview.", "Track decision and passport return."],
    documents: ["Valid passport.", "DS-160 confirmation page.", "Appointment confirmation.", "Financial proof and home ties.", "Travel plan and supporting letters."],
    processingAndFees: ["Timeline varies by embassy.", "Fee depends on visa class.", "Apply early during peak season."],
    tips: ["Keep all answers consistent.", "Explain your trip purpose clearly.", "Organize documents by section."]
  },
  {
    country: "Germany",
    visaType: "Schengen visa (Type C) for short stay",
    writeUp: "Germany is often chosen for trade fairs, tourism, and family visits, and Schengen documentation quality is very important. Your itinerary should be realistic and match your insurance, hotel, and transport records. If Germany is your main stay destination, your supporting documents should clearly justify duration, accommodation, and available funds for daily expenses.",
    whoNeedsIt: ["Travelers from visa-required countries.", "Visitors staying up to 90 days in 180 days.", "Applicants with Germany as main destination or first entry under Schengen routing."],
    steps: ["Identify category and appointment center.", "Complete Schengen form.", "Book and attend submission appointment.", "Provide biometrics.", "Wait for processing and collect passport."],
    documents: ["Passport and photos.", "Schengen travel insurance.", "Flight and accommodation proof.", "Bank statements/sponsor documents.", "Employment or study proof."],
    processingAndFees: ["Usually a few weeks.", "Standard Schengen fee applies.", "Peak months may increase wait times."],
    tips: ["Ensure matching dates across documents.", "Use genuine reservations.", "Attach a clear cover letter."]
  },
  {
    country: "Canada",
    visaType: "Visitor visa or transit visa (based on route and purpose)",
    writeUp: "Canada applications are mostly document-driven and reviewed in your online account, so neat uploads matter. A practical approach is to group your documents into identity, finances, travel purpose, and home-country ties. Clear naming of files and complete statements reduce delays and help officers understand your case quickly.",
    whoNeedsIt: ["Nationals of visa-required countries.", "Transit passengers without exemption.", "Travelers who do not qualify for eTA-only travel."],
    steps: ["Check if you need visitor/transit visa or eTA.", "Create online profile and complete forms.", "Upload documents and pay fees.", "Give biometrics when requested.", "Follow account updates until decision."],
    documents: ["Valid passport.", "Application forms.", "Travel itinerary and destination proof.", "Financial proof.", "Additional medical/police docs if asked."],
    processingAndFees: ["Depends on country of residence.", "Biometrics fee may apply.", "Apply well before travel date."],
    tips: ["Upload clear scans.", "Double-check passport number entries.", "Keep payment receipts and submission copies."]
  },
  {
    country: "United Kingdom",
    visaType: "Standard Visitor Visa",
    writeUp: "The UK visitor route is straightforward when purpose and funding are well explained. Most refusals come from unclear finances or weak evidence of return plans. A short personal cover letter that explains why you are traveling, how long you will stay, and who is paying can make the entire application easier to assess.",
    whoNeedsIt: ["Travelers from countries that need prior UK entry clearance.", "Tourism, family, and business visitors.", "Some transit travelers based on route and airport."],
    steps: ["Apply online.", "Pay visa fee and health-related charges if required.", "Book TLS/VFS appointment.", "Submit biometrics and documents.", "Track application and collect passport."],
    documents: ["Passport.", "Proof of funds and employment/business.", "Travel/accommodation details.", "Invitation letter if applicable.", "Relationship and sponsor proof for family visits."],
    processingAndFees: ["Standard and priority timelines differ.", "Fees depend on visa duration/service level.", "Early application reduces stress."],
    tips: ["Show return intention.", "Explain source of funds clearly.", "Avoid contradictory travel history statements."]
  },
  {
    country: "Netherlands",
    visaType: "Schengen visa (Type C) for short stay",
    writeUp: "For Netherlands short-stay travel, consistency across every document is key. Your trip dates, hotel bookings, and invitation details should align with your cover letter and insurance. If you are visiting multiple Schengen countries, explain why the Netherlands is your main destination using nights of stay and purpose.",
    whoNeedsIt: ["Travelers from visa-required countries.", "Tourism, business, and family visitors staying up to 90 days.", "Applicants entering the Netherlands as main Schengen destination."],
    steps: ["Pick visa purpose and appointment center.", "Complete Schengen form.", "Book appointment and submit biometrics.", "Submit supporting documents.", "Track application until passport collection."],
    documents: ["Passport and photos.", "Travel insurance for Schengen area.", "Flight and accommodation documents.", "Proof of funds or sponsorship.", "Employment/student documents."],
    processingAndFees: ["Processing is usually a few weeks.", "Standard Schengen visa fees apply.", "Peak season can increase waiting times."],
    tips: ["Ensure trip dates align across all documents.", "Include a clear daily itinerary.", "Provide complete bank statements."]
  },
  {
    country: "Spain",
    visaType: "Schengen visa (Type C) for tourism and short visits",
    writeUp: "Spain is a popular tourism and family-visit destination, especially during summer and holiday periods. Because appointment slots can fill quickly, early planning helps. Applicants should present a clear daily or city-by-city plan, and avoid overcommitting to non-refundable bookings before a visa decision is issued.",
    whoNeedsIt: ["Travelers from countries that require Schengen visas.", "Visitors staying up to 90 days in 180 days.", "Applicants with Spain as primary destination."],
    steps: ["Select the correct visa category.", "Fill Schengen application accurately.", "Book BLS/consulate appointment.", "Attend biometrics and document submission.", "Await decision and collect passport."],
    documents: ["Valid passport.", "Travel insurance.", "Flight reservation and hotel booking.", "Financial proof and employment evidence.", "Invitation/sponsorship documents if relevant."],
    processingAndFees: ["Processing timeline varies by location.", "Schengen visa fees and service charges may apply.", "Apply early during holidays and summer travel."],
    tips: ["Submit legible copies and originals where needed.", "Keep your cover letter specific and honest.", "Do not overbook non-refundable travel before approval."]
  },
  {
    country: "Italy",
    visaType: "Schengen visa (Type C) for short-term travel",
    writeUp: "Italy applications benefit from strong travel history explanation and complete proof of accommodation and transport. If you are moving between cities, keep your bookings and date flow simple and verifiable. Applicants with sponsors should include sponsor identity, relationship proof, and funding documents in one organized section.",
    whoNeedsIt: ["Visa-required nationals visiting Italy.", "Tourists, business visitors, and family visitors.", "Applicants spending the longest stay in Italy within Schengen."],
    steps: ["Determine visa purpose.", "Complete the Schengen application form.", "Book appointment at consulate/VFS.", "Submit biometrics and supporting file.", "Track status and collect passport."],
    documents: ["Passport with validity.", "Travel health insurance.", "Round-trip reservations and lodging proof.", "Bank statements and sponsor proof if applicable.", "Employment, student, or business evidence."],
    processingAndFees: ["Processing typically takes a few weeks.", "Standard Schengen fees plus service fees can apply.", "Complex files may require additional review time."],
    tips: ["Use matching names and dates on all records.", "Include proof of ties to your home country.", "Apply with complete documentation to avoid delays."]
  },
  {
    country: "Australia",
    visaType: "Visitor visa (subclass 600) or transit visa",
    writeUp: "Australia visitor processing can vary by stream and personal profile, so complete disclosures are essential. Be honest about prior refusals, previous travel, and employment history. A concise purpose statement with reliable financial proof and family/work ties helps officers assess whether your visit is temporary and credible.",
    whoNeedsIt: ["Visa-required nationals visiting or transiting Australia.", "Travelers not eligible for ETA/eVisitor routes.", "Applicants needing short stay for tourism/business visitor activities."],
    steps: ["Pick correct visa stream.", "Create ImmiAccount and complete application.", "Attach supporting evidence.", "Pay fee and submit.", "Respond to additional requests if any."],
    documents: ["Passport and identity page.", "Proof of funds.", "Travel purpose evidence.", "Family/employment ties.", "Previous travel history documents."],
    processingAndFees: ["Processing varies by stream and case load.", "Fee changes by visa stream.", "Medical checks may be requested."],
    tips: ["Use complete, readable PDF uploads.", "Do not omit prior refusals.", "Submit realistic itinerary details."]
  }
];

const getCountryId = (country: string) =>
  `country-${country.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

export default function CountriesPage() {
  return (
    <div>
      {/* Dark Grid Hero */}
      <section className="relative overflow-hidden bg-[#0B1510] border-b border-emerald-950/40 developer-grid-dark py-16 md:py-20 text-white">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-npontu-green/10 blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 space-y-4">
          <span className="inline-flex rounded-full bg-npontu-green/20 border border-npontu-gold/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-npontu-gold">
            Countries Visa Guide
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl tracking-tight">
            Visa Preparation by Country: Expanded Guide
          </h1>
          <p className="max-w-3xl text-base text-emerald-100/75 leading-relaxed">
            This expanded page groups visa preparation under key destinations: USA, Germany, Canada, United Kingdom, Netherlands, Spain, Italy, and Australia. Use each country block as a practical checklist before submission.
          </p>
        </div>
      </section>

      {/* Selector Section */}
      <section className="mx-auto max-w-6xl px-4 py-12 developer-grid">
        <h2 className="text-xl font-bold text-slate-800">Countries Covered</h2>
        <div className="h-0.5 w-10 bg-npontu-gold mt-2 mb-4 rounded-full" />
        <ul className="grid gap-4 text-slate-700 sm:grid-cols-2 md:grid-cols-4">
          {guides.map((guide) => (
            <li key={guide.country} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow transition duration-150">
              <a href={`#${getCountryId(guide.country)}`} className="font-bold text-npontu-green hover:text-npontu-green-light transition">
                🌍 {guide.country}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Guide Cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20 space-y-12">
        {guides.map((guide) => (
          <article id={getCountryId(guide.country)} key={guide.country} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-3xl font-extrabold text-npontu-green">{guide.country}</h2>
              <p className="text-sm text-slate-500 mt-1"><strong>Visa Type:</strong> {guide.visaType}</p>
            </div>
            
            <p className="rounded-xl bg-npontu-surface-light/60 border border-slate-100 p-5 text-slate-600 leading-relaxed text-sm mb-6">{guide.writeUp}</p>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-npontu-green">Who Needs This Visa?</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">{guide.whoNeedsIt.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-npontu-green">Step-by-Step Application Guide</h3>
                <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-600">{guide.steps.map((item) => <li key={item}>{item}</li>)}</ol>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-npontu-green">Required Documents</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">{guide.documents.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-npontu-green">Processing Times and Fees</h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">{guide.processingAndFees.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-npontu-green/5 border border-npontu-green/10 p-5">
              <h3 className="font-bold text-npontu-green text-sm">💡 Tips for a Successful Application</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">{guide.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
            </div>
          </article>
        ))}

        {/* Conclusion Callout */}
        <div className="rounded-2xl bg-[#0B1510] border border-emerald-950 developer-grid-dark p-8 md:p-12 text-white text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#F5C518]">Start Your Relocation Checklist</h2>
          <p className="max-w-2xl mx-auto leading-relaxed text-sm text-emerald-100/75">
            You now have an expanded country-based template you can adapt quickly for your own application plan. Before final submission, always confirm the newest embassy/immigration checklist.
          </p>
          <div className="pt-2">
            <Link href="/contact" className="inline-block rounded-xl bg-npontu-green hover:bg-npontu-green-light px-8 py-3.5 font-bold text-white transition shadow duration-150">
              Get Personalized Visa Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
