const services = [
  "Study abroad guidance",
  "Visa document review",
  "Europe, Canada, and USA travel planning",
  "Schengen and visitor visa preparation",
  "Relocation support (excluding Asia)",
  "Interview preparation",
  "Flight and hotel guidance",
  "Custom itinerary planning"
];

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold">Services</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <div key={service} className="rounded-2xl border p-5">
            <h2 className="text-xl font-semibold">{service}</h2>
            <p className="mt-2 text-slate-600">
              Professional support tailored to travelers, students, and relocation clients.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
