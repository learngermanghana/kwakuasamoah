import { destinations } from "@/lib/site-content";

export default function DestinationsPage() {
  return (
    <section className="stack">
      <h1>Destinations</h1>
      <p>Country-specific travel and relocation guidance tailored to your plans.</p>
      <ul>
        {destinations.map((destination) => (
          <li key={destination}>{destination}</li>
        ))}
      </ul>
    </section>
  );
}
