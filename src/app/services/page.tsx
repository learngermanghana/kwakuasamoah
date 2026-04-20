import { services } from "@/lib/site-content";

export default function ServicesPage() {
  return (
    <section className="stack">
      <h1>Services</h1>
      <p>Pick a support option based on your travel or relocation goals.</p>
      <ul>
        {services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </section>
  );
}
