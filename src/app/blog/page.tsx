const topics = [
  "Schengen visa document checklist",
  "How to relocate to the Netherlands through studies",
  "Common visa mistakes and how to avoid them",
  "Cost breakdown for moving from Ghana to Europe",
];

export default function BlogPage() {
  return (
    <section className="stack">
      <h1>Travel Updates Blog</h1>
      <p>Search-friendly updates pulled from real questions and relocation trends.</p>
      <ul>
        {topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
    </section>
  );
}
