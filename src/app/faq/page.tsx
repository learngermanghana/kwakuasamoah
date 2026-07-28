"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  { 
    category: "General Consultation",
    questions: [
      { q: "Do you guarantee visa approval?", a: "No. Guidance improves preparation, but no genuine service can guarantee approval. Our goal is to ensure your application is as strong and accurate as possible." },
      { q: "Which destinations do you support?", a: "We provide worldwide support, with specialized guides for the US, UK, Canada, Schengen Area (Germany, Spain, Italy, Netherlands), and Australia." },
      { q: "How quickly can I get a consultation?", a: "We typically respond to new inquiries within 24 hours. You can book a 15-minute introductory call directly using the Book Now button." }
    ]
  },
  {
    category: "Services & Pricing",
    questions: [
      { q: "What is included in the visa package?", a: "Our packages typically include document checklists, application review, mock interviews, and step-by-step guidance. Specifics vary by the selected service." },
      { q: "Can I book through WhatsApp?", a: "Yes! WhatsApp is one of our fastest support channels. However, we recommend booking a structured consultation call first for detailed inquiries." },
      { q: "Do you review Statements of Purpose (SOP)?", a: "Yes, we offer SOP reviews and resume edits as part of our comprehensive coaching and application review services." }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#FAFBF9] min-h-screen">
      {/* Dark Hero Section */}
      <section className="relative overflow-hidden bg-[#050D0A] text-white border-b border-emerald-950/40 developer-grid-dark py-20">
        <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-npontu-gold/10 blur-[100px] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-4 text-center space-y-6">
          <span className="inline-flex rounded-full bg-[#1B6B3A]/20 border border-[#1B6B3A]/50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1B6B3A] bg-white/10 text-emerald-300">
            Support Center
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-emerald-100/75 leading-relaxed max-w-2xl mx-auto">
            Find quick answers to common questions about our visa consultation, travel packages, and support process.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="space-y-12">
          {faqs.map((group, groupIdx) => (
            <div key={group.category} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <span className="h-8 w-1 bg-npontu-green rounded-full block"></span>
                {group.category}
              </h2>
              
              <div className="space-y-4">
                {group.questions.map((item, itemIdx) => {
                  const id = `${groupIdx}-${itemIdx}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <div 
                      key={id} 
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen 
                          ? "border-npontu-green/30 bg-white shadow-md" 
                          : "border-slate-200 bg-white hover:border-npontu-green/20 hover:shadow-sm"
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                      >
                        <span className={`font-bold text-lg transition-colors duration-200 ${isOpen ? "text-npontu-green" : "text-slate-700"}`}>
                          {item.q}
                        </span>
                        <span className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isOpen ? "border-npontu-green bg-npontu-green text-white rotate-180" : "border-slate-200 text-slate-400 bg-slate-50"
                        }`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      
                      <div 
                        className={`px-6 transition-all duration-300 ease-in-out origin-top ${
                          isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0 overflow-hidden"
                        }`}
                      >
                        <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Contact CTA */}
        <div className="mt-16 rounded-3xl bg-npontu-green p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-npontu-green-light rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold text-white">Still have questions?</h3>
            <p className="text-emerald-100/90 text-lg">
              We&apos;re here to help you navigate your travel and relocation journey.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-xl bg-npontu-gold hover:bg-npontu-gold-warm text-slate-900 px-8 py-3 font-bold transition shadow-lg hover:-translate-y-1 duration-200"
              >
                Contact Us Directly
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
