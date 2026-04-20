export default function BookConsultationPage() {
  return (
    <section className="stack">
      <h1>Book Consultation</h1>
      <p>Collect qualified leads with required details before your call.</p>
      <form className="stack form">
        <label>
          Full name
          <input type="text" name="name" required />
        </label>
        <label>
          Email address
          <input type="email" name="email" required />
        </label>
        <label>
          Preferred destination
          <input type="text" name="destination" required />
        </label>
        <label>
          Travel dates
          <input type="text" name="dates" placeholder="e.g. Aug 2026" />
        </label>
        <label>
          Message
          <textarea name="message" rows={4} />
        </label>
        <button type="submit" className="button">
          Submit Inquiry
        </button>
      </form>
    </section>
  );
}
