import Link from "next/link";

type CountryGuide = {
  country: string;
  visaType: string;
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
    whoNeedsIt: ["Applicants from non–Visa Waiver Program countries.", "Tourism, family visit, and short business travelers.", "Transit travelers depending on itinerary and nationality."],
    steps: ["Choose visa class.", "Complete DS-160.", "Pay MRV fee and book appointments.", "Attend biometrics/interview.", "Track decision and passport return."],
    documents: ["Valid passport.", "DS-160 confirmation page.", "Appointment confirmation.", "Financial proof and home ties.", "Travel plan and supporting letters."],
    processingAndFees: ["Timeline varies by embassy.", "Fee depends on visa class.", "Apply early during peak season."],
    tips: ["Keep all answers consistent.", "Explain your trip purpose clearly.", "Organize documents by section."]
  },
  {
    country: "Germany",
    visaType: "Schengen visa (Type C) for short stay",
    whoNeedsIt: ["Travelers from visa-required countries.", "Visitors staying up to 90 days in 180 days.", "Applicants with Germany as main destination or first entry under Schengen routing."],
    steps: ["Identify category and appointment center.", "Complete Schengen form.", "Book and attend submission appointment.", "Provide biometrics.", "Wait for processing and collect passport."],
    documents: ["Passport and photos.", "Schengen travel insurance.", "Flight and accommodation proof.", "Bank statements/sponsor documents.", "Employment or study proof."],
    processingAndFees: ["Usually a few weeks.", "Standard Schengen fee applies.", "Peak months may increase wait times."],
    tips: ["Ensure matching dates across documents.", "Use genuine reservations.", "Attach a clear cover letter."]
  },
  {
    country: "Canada",
    visaType: "Visitor visa or transit visa (based on route and purpose)",
    whoNeedsIt: ["Nationals of visa-required countries.", "Transit passengers without exemption.", "Travelers who do not qualify for eTA-only travel."],
    steps: ["Check if you need visitor/transit visa or eTA.", "Create online profile and complete forms.", "Upload documents and pay fees.", "Give biometrics when requested.", "Follow account updates until decision."],
    documents: ["Valid passport.", "Application forms.", "Travel itinerary and destination proof.", "Financial proof.", "Additional medical/police docs if asked."],
    processingAndFees: ["Depends on country of residence.", "Biometrics fee may apply.", "Apply well before travel date."],
    tips: ["Upload clear scans.", "Double-check passport number entries.", "Keep payment receipts and submission copies."]
  },
  {
    country: "United Kingdom",
    visaType: "Standard Visitor Visa",
    whoNeedsIt: ["Travelers from countries that need prior UK entry clearance.", "Tourism, family, and business visitors.", "Some transit travelers based on route and airport."],
    steps: ["Apply online.", "Pay visa fee and health-related charges if required.", "Book TLS/VFS appointment.", "Submit biometrics and documents.", "Track application and collect passport."],
    documents: ["Passport.", "Proof of funds and employment/business.", "Travel/accommodation details.", "Invitation letter if applicable.", "Relationship and sponsor proof for family visits."],
    processingAndFees: ["Standard and priority timelines differ.", "Fees depend on visa duration/service level.", "Early application reduces stress."],
    tips: ["Show return intention.", "Explain source of funds clearly.", "Avoid contradictory travel history statements."]
  },
  {
    country: "Netherlands",
    visaType: "Schengen visa (Type C) for short stay",
    whoNeedsIt: ["Travelers from visa-required countries.", "Tourism, business, and family visitors staying up to 90 days.", "Applicants entering the Netherlands as main Schengen destination."],
    steps: ["Pick visa purpose and appointment center.", "Complete Schengen form.", "Book appointment and submit biometrics.", "Submit supporting documents.", "Track application until passport collection."],
    documents: ["Passport and photos.", "Travel insurance for Schengen area.", "Flight and accommodation documents.", "Proof of funds or sponsorship.", "Employment/student documents."],
    processingAndFees: ["Processing is usually a few weeks.", "Standard Schengen visa fees apply.", "Peak season can increase waiting times."],
    tips: ["Ensure trip dates align across all documents.", "Include a clear daily itinerary.", "Provide complete bank statements."]
  },
  {
    country: "Spain",
    visaType: "Schengen visa (Type C) for tourism and short visits",
    whoNeedsIt: ["Travelers from countries that require Schengen visas.", "Visitors staying up to 90 days in 180 days.", "Applicants with Spain as primary destination."],
    steps: ["Select the correct visa category.", "Fill Schengen application accurately.", "Book BLS/consulate appointment.", "Attend biometrics and document submission.", "Await decision and collect passport."],
    documents: ["Valid passport.", "Travel insurance.", "Flight reservation and hotel booking.", "Financial proof and employment evidence.", "Invitation/sponsorship documents if relevant."],
    processingAndFees: ["Processing timeline varies by location.", "Schengen visa fees and service charges may apply.", "Apply early during holidays and summer travel."],
    tips: ["Submit legible copies and originals where needed.", "Keep your cover letter specific and honest.", "Do not overbook non-refundable travel before approval."]
  },
  {
    country: "Italy",
    visaType: "Schengen visa (Type C) for short-term travel",
    whoNeedsIt: ["Visa-required nationals visiting Italy.", "Tourists, business visitors, and family visitors.", "Applicants spending the longest stay in Italy within Schengen."],
    steps: ["Determine visa purpose.", "Complete the Schengen application form.", "Book appointment at consulate/VFS.", "Submit biometrics and supporting file.", "Track status and collect passport."],
    documents: ["Passport with validity.", "Travel health insurance.", "Round-trip reservations and lodging proof.", "Bank statements and sponsor proof if applicable.", "Employment, student, or business evidence."],
    processingAndFees: ["Processing typically takes a few weeks.", "Standard Schengen fees plus service fees can apply.", "Complex files may require additional review time."],
    tips: ["Use matching names and dates on all records.", "Include proof of ties to your home country.", "Apply with complete documentation to avoid delays."]
  },
  {
    country: "Australia",
    visaType: "Visitor visa (subclass 600) or transit visa",
    whoNeedsIt: ["Visa-required nationals visiting or transiting Australia.", "Travelers not eligible for ETA/eVisitor routes.", "Applicants needing short stay for tourism/business visitor activities."],
    steps: ["Pick correct visa stream.", "Create ImmiAccount and complete application.", "Attach supporting evidence.", "Pay fee and submit.", "Respond to additional requests if any."],
    documents: ["Passport and identity page.", "Proof of funds.", "Travel purpose evidence.", "Family/employment ties.", "Previous travel history documents."],
    processingAndFees: ["Processing varies by stream and case load.", "Fee changes by visa stream.", "Medical checks may be requested."],
    tips: ["Use complete, readable PDF uploads.", "Do not omit prior refusals.", "Submit realistic itinerary details."]
  }
];

export default function CountriesPage() {
  return (
    <div>
      <section className="bg-[#0b2d4f]">
        <div className="mx-auto max-w-6xl px-4 py-16 text-white md:py-20">
          <p className="inline-block rounded-full border border-[#89d5d2]/40 bg-[#0d6f73]/40 px-3 py-1 text-sm font-semibold text-[#d9f7f5]">Countries Visa Guide</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Visa Preparation by Country: Expanded Guide</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#f4f1e6]">This expanded page groups visa preparation under key destinations: USA, Germany, Canada, United Kingdom, Netherlands, Spain, Italy, and Australia. Use each country block as a practical checklist before submission.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-[#0b2d4f]">Countries covered</h2>
        <ul className="mt-4 grid gap-3 text-slate-700 md:grid-cols-2">
          {guides.map((guide) => <li key={guide.country} className="rounded-xl border bg-white px-4 py-3 shadow-sm">{guide.country}</li>)}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {guides.map((guide) => (
          <article key={guide.country} className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0b2d4f]">{guide.country}</h2>
            <p className="mt-2 text-slate-700"><strong>Visa type:</strong> {guide.visaType}</p>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div><h3 className="text-lg font-semibold text-[#0d6f73]">Who needs this visa?</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-600">{guide.whoNeedsIt.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3 className="text-lg font-semibold text-[#0d6f73]">Step-by-step application guide</h3><ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-600">{guide.steps.map((item) => <li key={item}>{item}</li>)}</ol></div>
              <div><h3 className="text-lg font-semibold text-[#0d6f73]">Required documents</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-600">{guide.documents.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3 className="text-lg font-semibold text-[#0d6f73]">Processing times and fees</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-600">{guide.processingAndFees.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            <div className="mt-5 rounded-xl bg-[#f8f4ea] p-4"><h3 className="font-semibold text-[#0b2d4f]">Tips for a successful application</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">{guide.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul></div>
          </article>
        ))}

        <div className="rounded-2xl bg-[#0d6f73] p-8 text-white">
          <h2 className="text-2xl font-bold">Conclusion</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#e9fffe]">You now have an expanded country-based template you can adapt quickly for your own application plan. Before final submission, always confirm the newest embassy/immigration checklist for your nationality.</p>
          <Link href="/contact" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-[#0d6f73]">Get personalized visa support</Link>
        </div>
      </section>
    </div>
  );
}
