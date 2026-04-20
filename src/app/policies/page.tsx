export default function PoliciesPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Policies</h1>
        <p>Important legal and service information for all clients and website visitors.</p>
      </section>

      <article className="card stack">
        <h2>Privacy Policy</h2>
        <p>Personal details are collected only to deliver consultation and service support.</p>
      </article>

      <article className="card stack">
        <h2>Terms of Service</h2>
        <p>Service scope, responsibilities, and communication expectations are defined before engagement.</p>
      </article>

      <article className="card stack">
        <h2>Refund & Cancellation</h2>
        <p>Consultations may be rescheduled with notice. Package refund terms vary by service stage.</p>
      </article>

      <article className="card stack">
        <h2>Service Disclaimer</h2>
        <p>
          Guidance does not guarantee visa approvals, admissions, or decisions by official institutions.
        </p>
      </article>
    </section>
  );
}
