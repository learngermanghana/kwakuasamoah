import { NextResponse } from "next/server";

const BASE = (process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL || "https://us-central1-sedifex-web.cloudfunctions.net").replace(/\/$/, "");
const CONTRACT = "2026-04-13";

type R = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const key = () => process.env.SEDIFEX_CHECKOUT_API_KEY || process.env.SEDIFEX_BOOKING_API_KEY || process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY || "";
const store = () => process.env.SEDIFEX_BOOKING_TARGET_STORE_ID || process.env.SEDIFEX_STORE_ID || "";
const checkoutUrl = () => process.env.SEDIFEX_INTEGRATION_CHECKOUT_CREATE_URL || `${BASE}/integrationCheckoutCreate`;
const ret = (req: Request) => process.env.SEDIFEX_CHECKOUT_RETURN_URL || new URL("/payment/return", req.url).toString();

function pickUrl(data: R | null) {
  const d = ((data?.data as R) || (data?.checkout as R) || data || {}) as R;
  const value = d.authorizationUrl || d.authorization_url || d.checkoutUrl || d.checkout_url;
  return typeof value === "string" ? value : "";
}

function pickId(data: R | null) {
  const d = ((data?.data as R) || (data?.booking as R) || data || {}) as R;
  const value = d.bookingId || d.booking_id || d.id;
  return typeof value === "string" ? value : "";
}

async function amountFor(serviceId: string, serviceName: string, apiKey: string, storeId: string) {
  const fallback = Number(process.env.BOOKING_CHECKOUT_AMOUNT || 0);
  try {
    const url = new URL(`${BASE}/v1IntegrationProducts`);
    url.searchParams.set("storeId", storeId);
    const res = await fetch(url, { headers: { "x-api-key": apiKey, Authorization: `Bearer ${apiKey}`, "X-Sedifex-Contract-Version": CONTRACT, Accept: "application/json" }, cache: "no-store" });
    if (!res.ok) return fallback;
    const data = await res.json();
    const items = data.publicServices || data.publicProducts || data.products || [];
    const found = items.find((x: R) => s(x.id) === serviceId) || items.find((x: R) => s(x.name) === serviceName);
    const price = Number(found?.price || 0);
    return price > 0 ? price : fallback;
  } catch { return fallback; }
}

export async function POST(req: Request) {
  const apiKey = key();
  const storeId = store();
  if (!apiKey || !storeId) return NextResponse.json({ ok: false, error: "sedifex-not-configured" }, { status: 500 });

  const body = await req.json().catch(() => ({} as R));
  if (s(body.website)) return NextResponse.json({ ok: false, error: "invalid-request" }, { status: 400 });

  const customer = (body.customer || {}) as R;
  const serviceId = s(body.serviceId || process.env.BOOKING_DEFAULT_SERVICE_ID);
  const serviceName = s(body.serviceName) || "Service booking";
  const name = s(customer.name || body.customerName);
  const email = s(customer.email || body.customerEmail).toLowerCase();
  const phone = s(customer.phone || body.customerPhone);
  if (!serviceId) return NextResponse.json({ ok: false, error: "missing-service" }, { status: 400 });

  const amount = await amountFor(serviceId, serviceName, apiKey, storeId);
  if (!amount) return NextResponse.json({ ok: false, error: "missing-checkout-amount" }, { status: 502 });

  const headers = { "Content-Type": "application/json", Accept: "application/json", "x-api-key": apiKey, Authorization: `Bearer ${apiKey}`, "X-Sedifex-Contract-Version": CONTRACT };
  const bookingEndpoint = new URL(`${BASE}/v1IntegrationBookings`);
  bookingEndpoint.searchParams.set("storeId", storeId);
  const bookingPayload = { serviceId, serviceName, customer: { name, email, phone }, quantity: Number(body.quantity || 1), notes: s(body.notes), bookingDate: s(body.bookingDate || body.date), bookingTime: s(body.bookingTime), paymentMethod: "paystack_checkout", paymentAmount: amount, bookingStatus: "booked", paymentCollectionMode: "online_checkout", paymentStatus: "checkout_created", syncStatus: "pending", syncRequestedAt: new Date().toISOString(), attributes: { source: "website_booking_form", ...(body.attributes as R || {}) } };
  const bRes = await fetch(bookingEndpoint, { method: "POST", headers, body: JSON.stringify(bookingPayload), cache: "no-store" });
  const bData = await bRes.json().catch(() => null) as R | null;
  if (!bRes.ok) return NextResponse.json({ ok: false, error: bData?.error || "booking-create-failed" }, { status: bRes.status });

  const bookingId = pickId(bData);
  const clientOrderId = bookingId ? `BOOKING-${bookingId}` : `BOOKING-${Date.now()}`;
  const cPayload = { storeId, merchantId: storeId, clientOrderId, orderType: "service", sourceChannel: "client_website", sourceLabel: "Client Website", currency: process.env.BOOKING_CHECKOUT_CURRENCY || "GHS", amount, customer: { name, email, phone }, items: [{ id: serviceId, item_id: serviceId, serviceId, name: serviceName, serviceName, unitPrice: amount, price: amount, qty: 1, quantity: 1, type: "SERVICE", item_type: "service" }], returnUrl: ret(req), metadata: { bookingId, clientOrderId, channel: "client-website" } };
  const cRes = await fetch(checkoutUrl(), { method: "POST", headers, body: JSON.stringify(cPayload), cache: "no-store" });
  const cData = await cRes.json().catch(() => null) as R | null;
  const url = pickUrl(cData);
  if (!cRes.ok || !url) return NextResponse.json({ ok: false, error: cData?.error || "checkout-create-failed", bookingId }, { status: cRes.status || 502 });

  return NextResponse.json({ ok: true, message: "Booking created. Redirecting to secure checkout.", data: bData, checkout: { bookingId, clientOrderId, authorizationUrl: url, checkoutUrl: url } });
}
