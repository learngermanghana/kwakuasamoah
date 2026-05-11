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
  paymentOption: "pay_now" | "manual";
  manualPaymentMethod: string;
  manualPaymentAmount: string;
  website: string;
  consent: boolean;
  agreement: boolean;
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
    paymentOption: "pay_now",
    manualPaymentMethod: "bank_transfer",
    manualPaymentAmount: "",
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
    if (!nextState.customerName.trim()) nextErrors.customerName = "Please enter your full name.";
    if (!nextState.customerEmail.trim() && !nextState.customerPhone.trim()) {
      nextErrors.customerEmail = "Add an email or phone number so we can reach you.";
      nextErrors.customerPhone = "Add a phone number or email address so we can reach you.";
    }
    if (nextState.customerEmail && !EMAIL_PATTERN.test(nextState.customerEmail)) nextErrors.customerEmail = "Enter a valid email address.";
    if (nextState.customerPhone && !PHONE_PATTERN.test(nextState.customerPhone)) nextErrors.customerPhone = "Enter a valid phone or WhatsApp number.";
    if (!nextState.serviceId) nextErrors.serviceId = "Please choose a service.";
    if (!nextState.bookingDate) nextErrors.bookingDate = "Please choose your preferred date.";
    else if (nextState.bookingDate < minimumDate) nextErrors.bookingDate = "Please choose a future date.";
    if (!nextState.bookingTime) nextErrors.bookingTime = "Please choose your preferred time.";
    if (!nextState.notes.trim()) nextErrors.notes = "Please share what you need help with.";
    else if (nextState.notes.length > 1000) nextErrors.notes = "Notes can be up to 1000 characters.";

    if (nextState.paymentOption === "manual" && !nextState.manualPaymentAmount.trim()) {
      nextErrors.manualPaymentAmount = "Enter the agreed amount for manual payment.";
    }

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
    const paymentMethod = formState.paymentOption === "pay_now" ? "paystack_checkout" : formState.manualPaymentMethod;

    const payload = {
      ...formState,
      serviceName: selectedService?.name || formState.serviceName,
      paymentMethod,
      paymentAmount: formState.paymentOption === "manual" ? formState.manualPaymentAmount : undefined,
      paymentConfirmed: formState.paymentOption === "manual",
      attributes: {
        source: "website_booking_form",
        pageUrl: window.location.href,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language
      }
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/integration-bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; message?: string; checkout?: { authorizationUrl?: string } } | null;
      if (!response.ok || !data?.ok) {
        setResultMessage({ kind: "error", text: data?.message || data?.error || "We could not submit your request right now. Please try again in a few minutes." });
        return;
      }
      setResultMessage({ kind: "success", text: data.message || "Thanks! Your booking request has been received." });
      const checkoutUrl = data.checkout?.authorizationUrl || (data.checkout as { authorization_url?: string } | undefined)?.authorization_url;
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }
      setFormState((previous) => ({ ...previous, customerName: "", customerEmail: "", customerPhone: "", bookingDate: "", bookingTime: "", notes: "", manualPaymentAmount: "", website: "", consent: false, agreement: false }));
      setErrors({});
    } catch {
      setResultMessage({ kind: "error", text: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>{/* trimmed for brevity */}
    <div className="space-y-1"><label htmlFor="customerName" className="block text-sm font-medium text-zinc-900">Full name *</label><input id="customerName" name="customerName" value={formState.customerName} onChange={(event) => setFormState((previous) => ({ ...previous, customerName: event.target.value }))} className="w-full rounded-xl border px-4 py-3" /></div>
    <div className="space-y-1"><label htmlFor="customerEmail" className="block text-sm font-medium text-zinc-900">Email</label><input id="customerEmail" name="customerEmail" type="email" value={formState.customerEmail} onChange={(event) => setFormState((previous) => ({ ...previous, customerEmail: event.target.value }))} className="w-full rounded-xl border px-4 py-3" /></div>
    <div className="space-y-1"><label htmlFor="customerPhone" className="block text-sm font-medium text-zinc-900">Phone / WhatsApp</label><input id="customerPhone" name="customerPhone" value={formState.customerPhone} onChange={(event) => setFormState((previous) => ({ ...previous, customerPhone: event.target.value }))} className="w-full rounded-xl border px-4 py-3" /></div>
    <div className="space-y-1"><label htmlFor="serviceId" className="block text-sm font-medium text-zinc-900">Service *</label><select id="serviceId" name="serviceId" value={formState.serviceId} onChange={(event) => { const selected = getSelectedService(serviceOptions, event.target.value); setFormState((previous) => ({ ...previous, serviceId: event.target.value, serviceName: selected?.name || "" })); }} className="w-full rounded-xl border px-4 py-3"><option value="">Select a service</option>{serviceOptions.map((service) => (<option key={service.id} value={service.id}>{service.name}</option>))}</select></div>
    <div className="grid gap-4 md:grid-cols-2"><input id="bookingDate" name="bookingDate" type="date" min={minimumDate} value={formState.bookingDate} onChange={(event) => setFormState((previous) => ({ ...previous, bookingDate: event.target.value }))} className="w-full rounded-xl border px-4 py-3" /><input id="bookingTime" name="bookingTime" type="time" value={formState.bookingTime} onChange={(event) => setFormState((previous) => ({ ...previous, bookingTime: event.target.value }))} className="w-full rounded-xl border px-4 py-3" /></div>
    <div className="space-y-1"><label htmlFor="notes" className="block text-sm font-medium text-zinc-900">How can we help? *</label><textarea id="notes" name="notes" value={formState.notes} onChange={(event) => setFormState((previous) => ({ ...previous, notes: event.target.value }))} className="min-h-40 w-full rounded-xl border px-4 py-3" maxLength={1000} /></div>
    <fieldset className="space-y-2 rounded-xl border border-zinc-200 p-4"><legend className="px-1 text-sm font-semibold text-zinc-900">Payment preference *</legend><label className="flex gap-2 text-sm"><input type="radio" name="paymentOption" checked={formState.paymentOption === "pay_now"} onChange={() => setFormState((previous) => ({ ...previous, paymentOption: "pay_now" }))} /><span>Pay immediately with secure checkout (recommended)</span></label><label className="flex gap-2 text-sm"><input type="radio" name="paymentOption" checked={formState.paymentOption === "manual"} onChange={() => setFormState((previous) => ({ ...previous, paymentOption: "manual" }))} /><span>Pay manually (bank transfer / cash / mobile money)</span></label>{formState.paymentOption === "manual" ? <div className="grid gap-3 md:grid-cols-2"><input value={formState.manualPaymentMethod} onChange={(event) => setFormState((previous) => ({ ...previous, manualPaymentMethod: event.target.value }))} className="rounded-xl border px-4 py-3" placeholder="payment method" /><input value={formState.manualPaymentAmount} onChange={(event) => setFormState((previous) => ({ ...previous, manualPaymentAmount: event.target.value }))} className="rounded-xl border px-4 py-3" placeholder="agreed amount" /></div> : null}
    {errors.manualPaymentAmount ? <p className="text-sm text-red-700">{errors.manualPaymentAmount}</p> : null}
</fieldset>
    <label className="flex items-start gap-2 text-sm text-zinc-700" htmlFor="consent"><input id="consent" name="consent" type="checkbox" checked={formState.consent} onChange={(event) => setFormState((previous) => ({ ...previous, consent: event.target.checked }))} className="mt-1" /><span>I consent to being contacted about this booking and payment details.</span></label>
    {errors.consent ? <p className="text-sm text-red-700">{errors.consent}</p> : null}
    <label className="flex items-start gap-2 text-sm text-zinc-700" htmlFor="agreement"><input id="agreement" name="agreement" type="checkbox" checked={formState.agreement} onChange={(event) => setFormState((previous) => ({ ...previous, agreement: event.target.checked }))} className="mt-1" /><span>I agree to the booking terms, payment policy, and cancellation policy.</span></label>
    {errors.agreement ? <p className="text-sm text-red-700">{errors.agreement}</p> : null}
    {resultMessage ? <p className={resultMessage.kind === "success" ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{resultMessage.text}</p> : null}
    <button type="submit" className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white disabled:opacity-60" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Book"}</button>
  </form>;
}
