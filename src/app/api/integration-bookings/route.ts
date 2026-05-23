import { NextResponse } from "next/server";

type BookingPayload = {
  serviceId?: string;
  serviceName?: string;
  bookingDate?: string;
  bookingTime?: string;
  notes?: string;
  quantity?: number | string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  website?: string;
  paymentAmount?: number | string;
  attributes?: Record<string, unknown>;
};

type SedifexConfig = {
  baseUrl: string;
  apiKey?: string;
  storeId?: string;
  contractVersion: string;
  checkoutReturnUrl: string;
};

const FALLBACK_BASE_URL = "https://us-central1-sedifex-web.cloudfunctions.net";
const FALLBACK_RETURN_URL = "https://www.kwakulotteryy.com/payment/return";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalString(value: unknown) {
  const cleaned = cleanString(value);
  return cleaned || undefined;
}

function toPositiveNumber(value: unknown) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  return amount;
}

function normalizeServiceId(serviceId?: string) {
  if (!serviceId) return undefined;
  const cleaned = serviceId.trim();
  if (!cleaned.toLowerCase().startsWith("draft-")) return cleaned;
  const withoutPrefix = cleaned.slice("draft-".length).trim();
  return withoutPrefix || undefined;
}

function getSedifexConfig(): SedifexConfig {
  const baseUrl =
    process.env.SEDIFEX_API_BASE_URL ||
    process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
    FALLBACK_BASE_URL;

  return {
    baseUrl,
    apiKey:
      process.env.SEDIFEX_INTEGRATION_API_KEY ||
      process.env.SEDIFEX_PRODUCTS_API_KEY ||
      process.env.SEDIFEX_BOOKING_API_KEY,
    storeId:
      process.env.SEDIFEX_BOOKING_TARGET_STORE_ID ||
      process.env.SEDIFEX_STORE_ID ||
      process.env.NEXT_PUBLIC_SEDIFEX_STORE_ID,
    contractVersion: process.env.SEDIFEX_CONTRACT_VERSION || "2026-04-13",
    checkoutReturnUrl: process.env.SEDIFEX_CHECKOUT_RETURN_URL || FALLBACK_RETURN_URL
  };
}

function getHeaders(config: SedifexConfig): Record<string, string> {
  const apiKey = config.apiKey || "";

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
    Authorization: `Bearer ${apiKey}`,
    "X-Sedifex-Contract-Version": config.contractVersion
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function resolveNestedString(data: Record<string, unknown>, path: string[]) {
  let current: unknown = data;

  for (const key of path) {
    const next = asRecord(current);
    current = next[key];
  }

  return cleanOptionalString(current);
}

function resolveBookingId(data: Record<string, unknown>) {
  return (
    resolveNestedString(data, ["bookingId"]) ||
    resolveNestedString(data, ["id"]) ||
    resolveNestedString(data, ["booking", "bookingId"]) ||
    resolveNestedString(data, ["booking", "id"]) ||
    resolveNestedString(data, ["data", "bookingId"]) ||
    resolveNestedString(data, ["data", "id"])
  );
}

function resolveCheckoutUrl(data: Record<string, unknown>) {
  return (
    resolveNestedString(data, ["checkoutUrl"]) ||
    resolveNestedString(data, ["authorizationUrl"]) ||
    resolveNestedString(data, ["authorization_url"]) ||
    resolveNestedString(data, ["checkout", "checkoutUrl"]) ||
    resolveNestedString(data, ["checkout", "authorizationUrl"]) ||
    resolveNestedString(data, ["checkout", "authorization_url"]) ||
    resolveNestedString(data, ["data", "checkoutUrl"]) ||
    resolveNestedString(data, ["data", "authorizationUrl"]) ||
    resolveNestedString(data, ["data", "authorization_url"])
  );
}

function resolveTrackingFields(data: Record<string, unknown>) {
  return {
    reference:
      resolveNestedString(data, ["reference"]) ||
      resolveNestedString(data, ["data", "reference"]) ||
      resolveNestedString(data, ["checkout", "reference"]),
    sedifexOrderId:
      resolveNestedString(data, ["sedifexOrderId"]) ||
      resolveNestedString(data, ["data", "sedifexOrderId"]),
    orderId: resolveNestedString(data, ["orderId"]) || resolveNestedString(data, ["data", "orderId"]),
    clientOrderId:
      resolveNestedString(data, ["clientOrderId"]) ||
      resolveNestedString(data, ["client_order_id"]) ||
      resolveNestedString(data, ["data", "clientOrderId"]) ||
      resolveNestedString(data, ["data", "client_order_id"]),
    bookingId:
      resolveNestedString(data, ["bookingId"]) ||
      resolveNestedString(data, ["data", "bookingId"]) ||
      resolveNestedString(data, ["metadata", "bookingId"])
  };
}

async function resolveServiceAmount(config: SedifexConfig, serviceId: string, serviceName?: string) {
  const endpoint = new URL("/v1IntegrationProducts", config.baseUrl);
  endpoint.searchParams.set("storeId", config.storeId || "");

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "x-api-key": config.apiKey || "",
      "X-Sedifex-Contract-Version": config.contractVersion,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return undefined;
  }

  const payload = asRecord(await response.json().catch(() => ({})));
  const publicServices = Array.isArray(payload.publicServices) ? payload.publicServices : [];
  const publicProducts = Array.isArray(payload.publicProducts) ? payload.publicProducts : [];
  const products = Array.isArray(payload.products) ? payload.products : [];
  const items = [...publicServices, ...publicProducts, ...products].map(asRecord);

  const normalizedId = normalizeServiceId(serviceId);

  const match = items.find((item) => {
    const itemId = normalizeServiceId(cleanOptionalString(item.id));
    const itemName = cleanOptionalString(item.name);

    if (normalizedId && itemId && normalizedId === itemId) return true;
    if (serviceName && itemName && serviceName === itemName) return true;
    return false;
  });

  if (!match) return undefined;

  return toPositiveNumber(match.price ?? match.unitPrice ?? match.amount);
}

export async function POST(req: Request) {
  const config = getSedifexConfig();

  if (!config.apiKey || !config.storeId) {
    return NextResponse.json(
      { ok: false, error: "sedifex-not-configured", message: "Sedifex booking integration is not configured." },
      { status: 500 }
    );
  }

  const requestBody = asRecord(await req.json().catch(() => ({})));
  const booking = requestBody as BookingPayload;

  if (cleanString(booking.website)) {
    return NextResponse.json({ ok: false, error: "invalid-request", message: "Booking could not be created." }, { status: 400 });
  }

  const customerName = cleanOptionalString(booking.customerName);
  const customerEmail = cleanOptionalString(booking.customerEmail);
  const customerPhone = cleanOptionalString(booking.customerPhone);
  const rawServiceId = cleanOptionalString(booking.serviceId);
  const serviceId = normalizeServiceId(rawServiceId);
  const serviceName = cleanOptionalString(booking.serviceName) || "Service booking";
  const bookingDate = cleanOptionalString(booking.bookingDate);
  const bookingTime = cleanOptionalString(booking.bookingTime);

  if (!customerName) return NextResponse.json({ ok: false, error: "missing-customer-name", message: "Customer name is required." }, { status: 400 });
  if (!customerEmail) return NextResponse.json({ ok: false, error: "missing-customer-email", message: "Customer email is required for checkout." }, { status: 400 });
  if (!serviceId) return NextResponse.json({ ok: false, error: "missing-service", message: "Service is required." }, { status: 400 });
  if (!bookingDate) return NextResponse.json({ ok: false, error: "missing-booking-date", message: "Booking date is required." }, { status: 400 });
  if (!bookingTime) return NextResponse.json({ ok: false, error: "missing-booking-time", message: "Booking time is required." }, { status: 400 });

  const pageUrl = cleanOptionalString(asRecord(booking.attributes).pageUrl) || req.headers.get("referer") || undefined;

  let amount = toPositiveNumber(booking.paymentAmount);
  if (!amount) {
    amount = await resolveServiceAmount(config, serviceId, serviceName);
  }

  if (!amount) {
    return NextResponse.json(
      { ok: false, error: "missing-price", message: "Service price is required before Paystack checkout can open." },
      { status: 400 }
    );
  }

  const syncRequestedAt = new Date().toISOString();
  const bookingPayload = {
    serviceId,
    serviceName,
    customer: { name: customerName, phone: customerPhone, email: customerEmail },
    customerName,
    customerPhone,
    customerEmail,
    bookingDate,
    bookingTime,
    quantity: 1,
    notes: cleanOptionalString(booking.notes),
    paymentMethod: "paystack",
    paymentAmount: amount,
    depositAmount: amount,
    bookingStatus: "booked",
    paymentCollectionMode: "online_checkout",
    paymentStatus: "checkout_created",
    syncStatus: "pending",
    syncRequestedAt,
    attributes: {
      source: "website_booking_form",
      sourceChannel: "client_website",
      sourceLabel: "Client website",
      channel: "client-website",
      orderType: "service",
      websiteName: "kwakulotteryy.com",
      pageUrl,
      bookingDate,
      bookingTime,
      serviceName,
      paymentMethod: "paystack",
      payment_method: "paystack",
      paymentAmount: amount,
      depositAmount: amount,
      paymentStatus: "checkout_created",
      paymentCollectionMode: "online_checkout",
      syncStatus: "pending",
      syncRequestedAt,
      ...asRecord(booking.attributes)
    }
  };

  const bookingEndpoint = new URL("/v1IntegrationBookings", config.baseUrl);
  bookingEndpoint.searchParams.set("storeId", config.storeId);

  const bookingResponse = await fetch(bookingEndpoint, {
    method: "POST",
    headers: getHeaders(config),
    body: JSON.stringify(bookingPayload),
    cache: "no-store"
  });

  const bookingData = asRecord(await bookingResponse.json().catch(() => ({})));
  const requestId = bookingResponse.headers.get("x-sedifex-request-id") || undefined;

  if (!bookingResponse.ok) {
    console.error("Sedifex booking create failed", {
      status: bookingResponse.status,
      body: bookingData,
      serviceId,
      serviceName,
      storeId: config.storeId,
      customerEmail
    });

    return NextResponse.json(
      {
        ok: false,
        error: cleanOptionalString(bookingData.error) || "booking-request-failed",
        message: cleanOptionalString(bookingData.message) || "Booking could not be created.",
        requestId
      },
      { status: bookingResponse.status }
    );
  }

  const bookingId = resolveBookingId(bookingData);
  if (!bookingId) {
    return NextResponse.json(
      { ok: false, error: "missing-booking-id", message: "Booking created but booking ID was not returned.", requestId },
      { status: 502 }
    );
  }

  const clientOrderId = `BOOKING-${bookingId}`;
  const checkoutPayload = {
    storeId: config.storeId,
    store_id: config.storeId,
    merchantId: config.storeId,
    merchant_id: config.storeId,
    clientOrderId,
    client_order_id: clientOrderId,
    orderType: "service",
    order_type: "service",
    currency: "GHS",
    amount,
    customer: { name: customerName, email: customerEmail, phone: customerPhone },
    returnUrl: config.checkoutReturnUrl,
    items: [{ id: serviceId, item_id: serviceId, serviceId, name: serviceName, serviceName, unitPrice: amount, price: amount, qty: 1, quantity: 1, type: "SERVICE", item_type: "service" }],
    metadata: { bookingId, clientOrderId, channel: "client-website", sourceChannel: "client_website", source: "kwaku_website_booking_form", bookingDate, bookingTime, serviceName },
    syncStatus: "pending",
    syncRequestedAt
  };

  const checkoutPaths = ["/integration/checkout/create", "/integrationCheckoutCreate"];
  let checkoutResponse: Response | undefined;
  let checkoutData: Record<string, unknown> = {};

  for (const path of checkoutPaths) {
    const endpoint = new URL(path, config.baseUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: getHeaders(config),
      body: JSON.stringify(checkoutPayload),
      cache: "no-store"
    });

    const data = asRecord(await response.json().catch(() => ({})));
    checkoutResponse = response;
    checkoutData = data;

    if (response.ok) break;
    if (path === checkoutPaths[0] && response.status === 404) continue;
    if (path === checkoutPaths[0]) continue;
  }

  const checkoutUrl = resolveCheckoutUrl(checkoutData);
  if (!checkoutResponse?.ok || !checkoutUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "checkout-create-failed",
        message: "Booking was created but Paystack checkout could not open.",
        bookingId,
        reference: resolveTrackingFields(checkoutData).reference,
        details: checkoutData
      },
      { status: checkoutResponse?.status || 502 }
    );
  }

  const tracking = resolveTrackingFields(checkoutData);

  return NextResponse.json({
    ok: true,
    message: "Booking created. Redirecting to secure checkout.",
    bookingId,
    reference: tracking.reference,
    sedifexOrderId: tracking.sedifexOrderId,
    orderId: tracking.orderId,
    clientOrderId: tracking.clientOrderId || clientOrderId,
    checkoutUrl,
    authorizationUrl: checkoutUrl,
    booking: bookingData,
    checkout: checkoutData
  });
}
