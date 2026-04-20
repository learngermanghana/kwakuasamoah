export default function BookConsultationPage() {
  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Book Consultation</h1>
        <p>
          Complete this form so we can review your case before the call and provide focused guidance.
        </p>
      </section>

      <form className="stack form card">
        <label>
          Full name
          <input type="text" name="name" required />
        </label>
        <label>
          Email address
          <input type="email" name="email" required />
        </label>
        <label>
          Phone / WhatsApp number
          <input type="tel" name="phone" required />
        </label>
        <label>
          Current country
          <input type="text" name="country" required />
        </label>
        <label>
          Preferred destination
          <input type="text" name="destination" required />
        </label>
        <label>
          Intended travel date
          <input type="text" name="dates" placeholder="e.g. September 2026" />
        </label>
        <label>
          Approximate budget
          <input type="text" name="budget" placeholder="e.g. €3,000 - €5,000" />
        </label>
        <label>
          Message
          <textarea name="message" rows={5} placeholder="Tell us your goals and main challenges." />
        </label>
        <button type="submit" className="button">
          Submit Inquiry
        </button>
      </form>
    </section>
  );
}
