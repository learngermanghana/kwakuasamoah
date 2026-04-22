"use client";

import { FormEvent, useMemo, useState } from "react";

type ServiceOption = {
  id: string;
  name: string;
};

type BookingFormProps = {
  serviceOptions: ServiceOption[];
  prefilledServiceName?: string;
};

type FormState = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  notes: string;
  website: string;
  consent: boolean;
};

type ValidationErrors = Partial<Record<keyof FormState, string>>;

const PHONE_PATTERN = /^[+0-9()\-\s]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSelectedService(serviceOptions: ServiceOption[], serviceId: string) {
  return serviceOptions.find((option) => option.id === serviceId);
}

export function BookingForm({ serviceOptions, prefilledServiceName }: BookingFormProps) {
  const preselectedService =
    serviceOptions.find((service) => service.name === prefilledServiceName) || serviceOptions[0];

  const [formState, setFormState] = useState<FormState>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: preselectedService?.id || "",
    serviceName: preselectedService?.name || prefilledServiceName || "",
    bookingDate: "",
    bookingTime: "",
    notes: "",
    website: "",
    consent: false
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const minimumDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  }, []);

  function validate(nextState: FormState) {
    const nextErrors: ValidationErrors = {};

    if (!nextState.customerName.trim()) {
      nextErrors.customerName = "Please enter your full name.";
    }

    if (!nextState.customerEmail.trim() && !nextState.customerPhone.trim()) {
      nextErrors.customerEmail = "Add an email or phone number so we can reach you.";
      nextErrors.customerPhone = "Add a phone number or email address so we can reach you.";
    }

    if (nextState.customerEmail && !EMAIL_PATTERN.test(nextState.customerEmail)) {
      nextErrors.customerEmail = "Enter a valid email address.";
    }

    if (nextState.customerPhone && !PHONE_PATTERN.test(nextState.customerPhone)) {
      nextErrors.customerPhone = "Enter a valid phone or WhatsApp number.";
    }

    if (!nextState.serviceId) {
      nextErrors.serviceId = "Please choose a service.";
    }

    if (!nextState.bookingDate) {
      nextErrors.bookingDate = "Please choose your preferred date.";
    } else if (nextState.bookingDate < minimumDate) {
      nextErrors.bookingDate = "Please choose a future date.";
    }

    if (!nextState.bookingTime) {
      nextErrors.bookingTime = "Please choose your preferred time.";
    }

    if (!nextState.notes.trim()) {
      nextErrors.notes = "Please share what you need help with.";
    } else if (nextState.notes.length > 1000) {
      nextErrors.notes = "Notes can be up to 1000 characters.";
    }

    if (!nextState.consent) {
      nextErrors.consent = "Please confirm consent so we can follow up.";
    }

    return nextErrors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResultMessage(null);

    const nextErrors = validate(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const selectedService = getSelectedService(serviceOptions, formState.serviceId);

    const payload = {
      ...formState,
      serviceName: selectedService?.name || formState.serviceName,
      attributes: {
        source: "website_booking_form",
        pageUrl: window.location.href,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
        campaign: {
          utmSource: new URLSearchParams(window.location.search).get("utm_source"),
          utmMedium: new URLSearchParams(window.location.search).get("utm_medium"),
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign"),
          utmContent: new URLSearchParams(window.location.search).get("utm_content"),
          utmTerm: new URLSearchParams(window.location.search).get("utm_term")
        }
      }
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/integration-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setResultMessage({
          kind: "error",
          text:
            data?.message ||
            data?.error ||
            "We could not submit your request right now. Please try again in a few minutes."
        });
        return;
      }

      setResultMessage({
        kind: "success",
        text: data.message || "Thanks! Your booking request has been received."
      });
      setFormState((previous) => ({
        ...previous,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        bookingDate: "",
        bookingTime: "",
        notes: "",
        website: "",
        consent: false
      }));
      setErrors({});
    } catch {
      setResultMessage({
        kind: "error",
        text: "Network error. Please check your connection and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="customerName" className="block text-sm font-medium text-zinc-900">Full name *</label>
        <input
          id="customerName"
          name="customerName"
          value={formState.customerName}
          onChange={(event) => setFormState((previous) => ({ ...previous, customerName: event.target.value }))}
          className="w-full rounded-xl border px-4 py-3"
          aria-invalid={Boolean(errors.customerName)}
          aria-describedby={errors.customerName ? "customerName-error" : undefined}
        />
        {errors.customerName ? <p id="customerName-error" className="text-sm text-red-700">{errors.customerName}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="customerEmail" className="block text-sm font-medium text-zinc-900">Email</label>
        <input
          id="customerEmail"
          name="customerEmail"
          type="email"
          value={formState.customerEmail}
          onChange={(event) => setFormState((previous) => ({ ...previous, customerEmail: event.target.value }))}
          className="w-full rounded-xl border px-4 py-3"
          aria-invalid={Boolean(errors.customerEmail)}
          aria-describedby={errors.customerEmail ? "customerEmail-error" : "contact-helper"}
        />
        {errors.customerEmail ? <p id="customerEmail-error" className="text-sm text-red-700">{errors.customerEmail}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="customerPhone" className="block text-sm font-medium text-zinc-900">Phone / WhatsApp</label>
        <input
          id="customerPhone"
          name="customerPhone"
          value={formState.customerPhone}
          onChange={(event) => setFormState((previous) => ({ ...previous, customerPhone: event.target.value }))}
          className="w-full rounded-xl border px-4 py-3"
          aria-invalid={Boolean(errors.customerPhone)}
          aria-describedby={errors.customerPhone ? "customerPhone-error" : "contact-helper"}
        />
        <p id="contact-helper" className="text-sm text-zinc-600">Please share at least one contact method (email or phone).</p>
        {errors.customerPhone ? <p id="customerPhone-error" className="text-sm text-red-700">{errors.customerPhone}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="serviceId" className="block text-sm font-medium text-zinc-900">Service *</label>
        <select
          id="serviceId"
          name="serviceId"
          value={formState.serviceId}
          onChange={(event) => {
            const selected = getSelectedService(serviceOptions, event.target.value);
            setFormState((previous) => ({
              ...previous,
              serviceId: event.target.value,
              serviceName: selected?.name || ""
            }));
          }}
          className="w-full rounded-xl border px-4 py-3"
          aria-invalid={Boolean(errors.serviceId)}
          aria-describedby={errors.serviceId ? "serviceId-error" : undefined}
        >
          <option value="">Select a service</option>
          {serviceOptions.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
        {errors.serviceId ? <p id="serviceId-error" className="text-sm text-red-700">{errors.serviceId}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="bookingDate" className="block text-sm font-medium text-zinc-900">Preferred date *</label>
          <input
            id="bookingDate"
            name="bookingDate"
            type="date"
            min={minimumDate}
            value={formState.bookingDate}
            onChange={(event) => setFormState((previous) => ({ ...previous, bookingDate: event.target.value }))}
            className="w-full rounded-xl border px-4 py-3"
            aria-invalid={Boolean(errors.bookingDate)}
            aria-describedby={errors.bookingDate ? "bookingDate-error" : undefined}
          />
          {errors.bookingDate ? <p id="bookingDate-error" className="text-sm text-red-700">{errors.bookingDate}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="bookingTime" className="block text-sm font-medium text-zinc-900">Preferred time *</label>
          <input
            id="bookingTime"
            name="bookingTime"
            type="time"
            value={formState.bookingTime}
            onChange={(event) => setFormState((previous) => ({ ...previous, bookingTime: event.target.value }))}
            className="w-full rounded-xl border px-4 py-3"
            aria-invalid={Boolean(errors.bookingTime)}
            aria-describedby={errors.bookingTime ? "bookingTime-error" : undefined}
          />
          {errors.bookingTime ? <p id="bookingTime-error" className="text-sm text-red-700">{errors.bookingTime}</p> : null}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-900">How can we help? *</label>
        <textarea
          id="notes"
          name="notes"
          value={formState.notes}
          onChange={(event) => setFormState((previous) => ({ ...previous, notes: event.target.value }))}
          className="min-h-40 w-full rounded-xl border px-4 py-3"
          maxLength={1000}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "notes-error" : "notes-helper"}
        />
        <p id="notes-helper" className="text-sm text-zinc-600">Tell us your goals and timeline. We typically reply within 24 hours.</p>
        {errors.notes ? <p id="notes-error" className="text-sm text-red-700">{errors.notes}</p> : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formState.website}
          onChange={(event) => setFormState((previous) => ({ ...previous, website: event.target.value }))}
        />
      </div>

      <div className="space-y-1">
        <label className="flex items-start gap-2 text-sm text-zinc-700" htmlFor="consent">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={formState.consent}
            onChange={(event) => setFormState((previous) => ({ ...previous, consent: event.target.checked }))}
            className="mt-1"
          />
          <span>I consent to being contacted about my booking request.</span>
        </label>
        {errors.consent ? <p className="text-sm text-red-700">{errors.consent}</p> : null}
      </div>

      {resultMessage ? (
        <p className={resultMessage.kind === "success" ? "text-sm text-emerald-700" : "text-sm text-red-700"}>
          {resultMessage.text}
        </p>
      ) : null}

      <button type="submit" className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white disabled:opacity-60" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Book on Sedifex"}
      </button>
    </form>
  );
}
