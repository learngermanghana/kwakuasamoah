export type TravelPackage = {
  slug: string;
  title: string;
  destination: string;
  durationDays: number;
  priceFrom: string;
  summary: string;
  includes: string[];
  image: string;
};

export const packages: TravelPackage[] = [
  {
    slug: "netherlands-study-route",
    title: "Netherlands Study Route Guide",
    destination: "Netherlands",
    durationDays: 30,
    priceFrom: "GHS 500",
    summary: "Guidance for students planning to relocate to the Netherlands through studies.",
    includes: ["Consultation", "Document checklist", "Application guidance", "Travel advice"],
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    slug: "schengen-visa-preparation",
    title: "Schengen Visa Preparation",
    destination: "Europe",
    durationDays: 14,
    priceFrom: "GHS 350",
    summary: "Step-by-step support for first-time Schengen visa applicants.",
    includes: ["Visa checklist", "Travel plan review", "Interview tips", "Booking guidance"],
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop"
  },
  {
    slug: "custom-europe-travel-plan",
    title: "Custom Europe Travel Plan",
    destination: "Europe",
    durationDays: 7,
    priceFrom: "GHS 300",
    summary: "Personalized travel planning for holidays, visits, and relocation scouting.",
    includes: ["Trip consultation", "Destination advice", "Budget planning", "WhatsApp support"],
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop"
  }
];
