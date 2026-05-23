"use client";

import { FormEvent, useMemo, useState } from "react";

type ServiceOption = {
  id: string;
  name: string;
  priceLabel?: string;
  category?: string;
};

type BookingFormProps = {
  serviceOptions: ServiceOption[];
  prefilledServiceId?: string;
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
  agreement: boolean;
};

type BookingApiResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  bookingId?: string;
  requestId?: string;
  checkoutUrl?: string;
  authorizationUrl?: string;
  checkout?: {
    checkoutUrl?: string;
    authorizationUrl?: string;
    authorization_url?: string;
  };
};

type ValidationErrors = Partial<Record<keyof FormState, string>>;

const PHONE_PATTERN = /^[+0-9()\-\s]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? "00" : "30";
  const label = `${String(hours).padStart(2, "0")}:${minutes}`;
  return { value: label, label };
});

function getSelectedService(serviceOptions: ServiceOption[], serviceId: string) {
  return serviceOptions.find((option) => option.id === serviceId);
}

function getInitialService(
  serviceOptions: ServiceOption[],
  prefilledServiceId?: string,
  prefilledServiceName?: string
) {
  return (
    serviceOptions.find((service) => service.id === prefilledServiceId) ||
    serviceOptions.find((service) => service.name === prefilledServiceName) ||
    null
  );
}

function getCheckoutUrl(data: BookingApiResponse | null) {
  return (
    data?.checkoutUrl ||
    data?.authorizationUrl ||
    data?.checkout?.checkoutUrl ||
    data?.checkout?.authorizationUrl ||
    data?.checkout?.authorization_url ||
    ""
  );
}

export function BookingForm({ serviceOptions, prefilledServiceId, prefilledServiceName }: BookingFormProps) {
  const preselectedService = getInitialService(serviceOptions, prefilledServiceId, prefilledServiceName);

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
    consent: false,
    agreement: false
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
    const hasEmail = Boolean(nextState.customerEmail.trim());
    const hasPhone = Boolean(nextState.customerPhone.trim());

    if (!nextState.customerName.trim()) nextErrors.customerName = "Please enter your full name.";
    if (!hasEmail && !hasPhone) nextErrors.customerEmail = "Please enter your email or phone number.";
    if (hasEmail && !EMAIL_PATTERN.test(nextState.customerEmail)) nextErrors.customerEmail = "Enter a valid email address.";
    if (hasPhone && !PHONE_PATTERN.test(nextState.customerPhone)) nextErrors.customerPhone = "Enter a valid phone or WhatsApp number.";
    if (!nextState.serviceId) nextErrors.serviceId = "Please choose a service from Sedifex.";
    if (!nextState.bookingDate) nextErrors.bookingDate = "Please choose your preferred date.";
    else if (nextState.bookingDate < minimumDate) nextErrors.bookingDate = "Please choose a future date.";
    if (!nextState.bookingTime) nextErrors.bookingTime = "Please choose your preferred time.";
    if (nextState.notes.length > 1000) nextErrors.notes = "Notes can be up to 1000 characters.";
    if (!nextState.consent) nextErrors.consent = "Please confirm consent so we can follow up.";
    if (!nextState.agreement) nextErrors.agreement = "Please accept the booking terms to continue.";
    return nextErrors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResultMessage(null);

    const nextErrors = validate(formState);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const selectedService = getSelectedService(serviceOptions, formState.serviceId);

    const payload = {
      customerName: formState.customerName,
      customerEmail: formState.customerEmail,
      customerPhone: formState.customerPhone,
      serviceId: formState.serviceId,
      serviceName: selectedService?.name || formState.serviceName,
      bookingDate: formState.bookingDate,
      bookingTime: formState.bookingTime,
      notes: formState.notes,
      quantity: 1,
      website: formState.website,
      attributes: {
        source: "website_booking_form",
        sourceChannel: "client_website",
        sourceLabel: "Client website",
        pageUrl: window.location.href,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language
      }
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/integration-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json().catch(() => null)) as BookingApiResponse | null;

      if (!response.ok || !data?.ok) {
        const fallbackMessage = "We could not submit your booking right now. Please try again in a few minutes.";
        const serverMessage = data?.message || data?.error || fallbackMessage;
        const errorDetails = [data?.error ? `Code: ${data.error}` : "", data?.requestId ? `Request ID: ${data.requestId}` : ""]
          .filter(Boolean)
          .join(" · ");

        setResultMessage({
          kind: "error",
          text: errorDetails ? `${serverMessage} (${errorDetails})` : serverMessage
        });
        return;
      }

      const checkoutUrl = getCheckoutUrl(data);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      setResultMessage({
        kind: "success",
        text: data?.message || "Booking request saved. We will contact you shortly."
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
        consent: false,
        agreement: false
      }));
      setErrors({});
    } catch {
      setResultMessage({ kind: "error", text: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-3xl border border-[#d8d6cf] bg-white p-6 shadow-sm" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="customerName" className="block text-sm font-medium text-zinc-900">Full name *</label>
          <input
            id="customerName"
            name="customerName"
            value={formState.customerName}
            onChange={(event) => setFormState((previous) => ({ ...previous, customerName: event.target.value }))}
            className="w-full rounded-xl border border-[#d8d6cf] px-4 py-3 outline-none transition focus:border-[#0d6f73] focus:ring-2 focus:ring-[#0d6f73]/20"
            autoComplete="name"
          />
          {errors.customerName ? <p className="text-sm text-red-700">{errors.customerName}</p> : null}
        </div>
        <div className="space-y-1">
          <label htmlFor="customerPhone" className="block text-sm font-medium text-zinc-900">Phone / WhatsApp</label>
          <input
            id="customerPhone"
            name="customerPhone"
            value={formState.customerPhone}
            onChange={(event) => setFormState((previous) => ({ ...previous, customerPhone: event.target.value }))}
            className="w-full rounded-xl border border-[#d8d6cf] px-4 py-3 outline-none transition focus:border-[#0d6f73] focus:ring-2 focus:ring-[#0d6f73]/20"
            autoComplete="tel"
          />
          {errors.customerPhone ? <p className="text-sm text-red-700">{errors.customerPhone}</p> : null}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="customerEmail" className="block text-sm font-medium text-zinc-900">Email address</label>
        <input
          id="customerEmail"
          name="customerEmail"
          type="email"
          value={formState.customerEmail}
          onChange={(event) => setFormState((previous) => ({ ...previous, customerEmail: event.target.value }))}
          className="w-full rounded-xl border border-[#d8d6cf] px-4 py-3 outline-none transition focus:border-[#0d6f73] focus:ring-2 focus:ring-[#0d6f73]/20"
          autoComplete="email"
        />
        {errors.customerEmail ? <p className="text-sm text-red-700">{errors.customerEmail}</p> : null}
      </div>

      <div className="space-y-1">
        <label htmlFor="serviceId" className="block text-sm font-medium text-zinc-900">Service from Sedifex *</label>
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
          className="w-full rounded-xl border border-[#d8d6cf] px-4 py-3 outline-none transition focus:border-[#0d6f73] focus:ring-2 focus:ring-[#0d6f73]/20"
        >
          <option value="">Select a service</option>
          {serviceOptions.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}{service.priceLabel ? ` — ${service.priceLabel}` : ""}
            </option>
          ))}
        </select>
        {errors.serviceId ? <p className="text-sm text-red-700">{errors.serviceId}</p> : null}
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
            className="w-full rounded-xl border border-[#d8d6cf] px-4 py-3 outline-none transition focus:border-[#0d6f73] focus:ring-2 focus:ring-[#0d6f73]/20"
          />
          {errors.bookingDate ? <p className="text-sm text-red-700">{errors.bookingDate}</p> : null}
        </div>
        <div className="space-y-1">
          <label htmlFor="bookingTime" className="block text-sm font-medium text-zinc-900">Preferred time *</label>
          <select
            id="bookingTime"
            name="bookingTime"
            value={formState.bookingTime}
            onChange={(event) => setFormState((previous) => ({ ...previous, bookingTime: event.target.value }))}
            className="w-full rounded-xl border border-[#d8d6cf] px-4 py-3 outline-none transition focus:border-[#0d6f73] focus:ring-2 focus:ring-[#0d6f73]/20"
          >
            <option value="">Select time</option>
            {TIME_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {errors.bookingTime ? <p className="text-sm text-red-700">{errors.bookingTime}</p> : null}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-900">What do you need help with?</label>
        <textarea
          id="notes"
          name="notes"
          value={formState.notes}
          onChange={(event) => setFormState((previous) => ({ ...previous, notes: event.target.value }))}
          className="min-h-36 w-full rounded-xl border border-[#d8d6cf] px-4 py-3 outline-none transition focus:border-[#0d6f73] focus:ring-2 focus:ring-[#0d6f73]/20"
          maxLength={1000}
        />
        {errors.notes ? <p className="text-sm text-red-700">{errors.notes}</p> : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          value={formState.website}
          onChange={(event) => setFormState((previous) => ({ ...previous, website: event.target.value }))}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-zinc-700" htmlFor="consent">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={formState.consent}
          onChange={(event) => setFormState((previous) => ({ ...previous, consent: event.target.checked }))}
          className="mt-1"
        />
        <span>I consent to being contacted about this booking request.</span>
      </label>
      {errors.consent ? <p className="text-sm text-red-700">{errors.consent}</p> : null}

      <label className="flex items-start gap-2 text-sm text-zinc-700" htmlFor="agreement">
        <input
          id="agreement"
          name="agreement"
          type="checkbox"
          checked={formState.agreement}
          onChange={(event) => setFormState((previous) => ({ ...previous, agreement: event.target.checked }))}
          className="mt-1"
        />
        <span>I understand this creates a booking request in Sedifex for admin confirmation.</span>
      </label>
      {errors.agreement ? <p className="text-sm text-red-700">{errors.agreement}</p> : null}

      {resultMessage ? (
        <p className={resultMessage.kind === "success" ? "rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"}>
          {resultMessage.text}
        </p>
      ) : null}

      <button
        type="submit"
        className="rounded-2xl bg-[#0d6f73] px-6 py-3 font-semibold text-white transition hover:bg-[#0a5b5f] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving booking..." : "Submit booking request"}
      </button>
    </form>
  );
}
