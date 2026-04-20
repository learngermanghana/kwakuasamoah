"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function BookConsultationPage() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.error ?? "Unable to submit your request right now.");
        return;
      }

      setState("success");
      setMessage("Thanks! Your consultation request has been submitted successfully.");
      form.reset();
    } catch {
      setState("error");
      setMessage("Network issue detected. Please try again.");
    }
  }

  return (
    <section className="stack-lg">
      <section className="stack">
        <h1>Book Consultation</h1>
        <p>
          Complete this form so we can review your case before the call and provide focused guidance.
        </p>
      </section>

      <form className="stack form card" onSubmit={handleSubmit}>
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
        <button type="submit" className="button" disabled={state === "loading"}>
          {state === "loading" ? "Submitting..." : "Submit Inquiry"}
        </button>
        {message && (
          <p className={state === "success" ? "status success" : "status error"} role="status">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
