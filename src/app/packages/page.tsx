import { packages } from "@/lib/site-content";

export default function PackagesPage() {
  return (
    <section className="stack">
      <h1>Packages</h1>
      <p>Structured offers for first-time travelers, students, and relocation clients.</p>
      <ul>
        {packages.map((pkg) => (
          <li key={pkg}>{pkg}</li>
        ))}
      </ul>
    </section>
  );
}
