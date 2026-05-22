import { NextResponse } from "next/server";

type BookingPayload = {
  serviceId?: string;
  slotId?: string;
  slotID?: string;
  slot_id?: string;
  serviceName?: string;
  bookingDate?: string;
  bookingTime?: string;
  notes?: string;
  quantity?: number | string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  website?: string;
  attributes?: Record<string, unknown>;
  paymentMethod?: string;
  paymentAmount?: number | string;
  branchLocationId?: string;
  branchLocationName?: string;
  eventLocation?: string;
  customerStayLocation?: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const SEDIFEX_CONTRACT_VERSION = "2026-04-13";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, RateLimitEntry>();

function getSedifexConfig() {
  return {
    baseUrl: process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL,
    apiKey: process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY,
    storeId: process.env.SEDIFEX_STORE_ID,
    defaultServiceId: process.env.BOOKING_DEFAULT_SERVICE_ID
  };
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function exceedsRateLimit(clientIp: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(clientIp);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;

  entry.count += 1;
  rateLimitStore.set(clientIp, entry);
  return false;
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalString(value: unknown) {
  const cleaned = cleanString(value);
  return cleaned || undefined;
}

function resolveCustomer(booking: BookingPayload, body: Record<string, unknown>) {
  return {
    name:
      cleanOptionalString(booking.customer?.name) ||
      cleanOptionalString(booking.customerName) ||
      cleanOptionalString(body.customerName) ||
      cleanOptionalString(body.fullName) ||
      cleanOptionalString(body.clientName) ||
      cleanOptionalString(body.name),
    phone:
      cleanOptionalString(booking.customer?.phone) ||
      cleanOptionalString(booking.customerPhone) ||
      cleanOptionalString(body.phoneNumber) ||
      cleanOptionalString(body.mobile) ||
      cleanOptionalString(body.whatsapp) ||
      cleanOptionalString(body.phone),
    email:
      cleanOptionalString(booking.customer?.email) ||
      cleanOptionalString(booking.customerEmail) ||
      cleanOptionalString(body.emailAddress) ||
      cleanOptionalString(body.email)
  };
}

function resolveQuantity(value: unknown) {
  const quantity = Number(value || 1);
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  return Math.floor(quantity);
}

function resolvePaymentAmount(value: unknown) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  return amount;
}

function resolveBookingId(responseData: Record<string, unknown> | null) {
  if (!responseData) return undefined;
  const data = (responseData.data || responseData.booking || responseData) as Record<string, unknown>;
  return cleanOptionalString(data.id) || cleanOptionalString(data.bookingId) || cleanOptionalString(data.orderId);
}

export async function POST(req: Request) {
  const { baseUrl, apiKey, storeId, defaultServiceId } = getSedifexConfig();

  if (!baseUrl || !apiKey || !storeId) {
    return NextResponse.json(
      { ok: false, error: "sedifex-not-configured", message: "Sedifex integration is not configured." },
      { status: 500 }
    );
  }

  const clientIp = getClientIp(req);
  if (exceedsRateLimit(clientIp)) {
    return NextResponse.json(
      { ok: false, error: "too-many-requests", message: "Too many booking attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    }

    const booking = body as BookingPayload;

    if (booking.website && cleanString(booking.website)) {
      return NextResponse.json(
        { ok: false, error: "invalid-request", message: "Booking could not be created." },
        { status: 400 }
      );
    }

    const customer = resolveCustomer(booking, body);
    if (!customer.name && !customer.phone && !customer.email) {
      return NextResponse.json(
        { ok: false, error: "missing-customer", message: "Please provide at least one customer contact field." },
        { status: 400 }
      );
    }

    const serviceId = cleanOptionalString(booking.serviceId) || cleanOptionalString(defaultServiceId);
    if (!serviceId && !booking.slotId && !booking.slotID && !booking.slot_id) {
      return NextResponse.json(
        { ok: false, error: "missing-service", message: "Please choose a service before submitting." },
        { status: 400 }
      );
    }

    const bookingDate = cleanOptionalString(booking.bookingDate) || cleanOptionalString(body.date);
    const bookingTime = cleanOptionalString(booking.bookingTime) || cleanOptionalString(body.time);
    const paymentAmount = resolvePaymentAmount(booking.paymentAmount || body.amount || body.total || body.price);

    const payload = {
      serviceId,
      slotId: cleanOptionalString(booking.slotId || booking.slotID || booking.slot_id || body.slotId),
      customer,
      quantity: resolveQuantity(booking.quantity || body.quantity),
      notes: cleanOptionalString(booking.notes || body.message),
      bookingDate,
      bookingTime,
      serviceName: cleanOptionalString(booking.serviceName || body.productName || body.service_note_name),
      paymentMethod: cleanOptionalString(booking.paymentMethod || body.payment_method || body.paymentType),
      paymentAmount,
      branchLocationId: cleanOptionalString(booking.branchLocationId || body.branchId || body.locationId || body.storeBranchId),
      branchLocationName: cleanOptionalString(booking.branchLocationName || body.branchName || body.storeBranch || body.locationName),
      eventLocation: cleanOptionalString(booking.eventLocation || body.eventVenue || body.venue || body.eventAddress),
      customerStayLocation: cleanOptionalString(booking.customerStayLocation || body.stayLocation || body.hotelLocation || body.guestLocation),
      attributes: {
        source: "website_booking_form",
        sourceChannel: "client_website",
        sourceLabel: "Client website",
        websiteName: new URL(req.url).hostname,
        pageUrl: req.headers.get("referer") || undefined,
        bookingDate,
        bookingTime,
        paymentAmount,
        ...(booking.attributes || {})
      }
    };

    const endpoint = new URL("/v1IntegrationBookings", baseUrl);
    endpoint.searchParams.set("storeId", storeId);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "X-Sedifex-Contract-Version": SEDIFEX_CONTRACT_VERSION,
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const responseData = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    const requestId = response.headers.get("x-sedifex-request-id") || undefined;

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: responseData?.error || "booking-request-failed",
          message: responseData?.message || "Booking could not be created.",
          requestId
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Booking request saved. We will contact you shortly.",
      bookingId: resolveBookingId(responseData),
      requestId,
      data: responseData
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid-request-payload", message: "Invalid request payload." },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  const { baseUrl, apiKey, storeId: defaultStoreId } = getSedifexConfig();

  if (!baseUrl || !apiKey || !defaultStoreId) {
    return NextResponse.json(
      { ok: false, error: "sedifex-not-configured", message: "Sedifex integration is not configured." },
      { status: 500 }
    );
  }

  const requestUrl = new URL(req.url);
  const storeId = requestUrl.searchParams.get("storeId") || defaultStoreId;
  const status = requestUrl.searchParams.get("status");
  const serviceId = requestUrl.searchParams.get("serviceId");

  const endpoint = new URL("/v1IntegrationBookings", baseUrl);
  endpoint.searchParams.set("storeId", storeId);
  if (status) endpoint.searchParams.set("status", status);
  if (serviceId) endpoint.searchParams.set("serviceId", serviceId);

  const response = await fetch(endpoint, {
    headers: {
      "x-api-key": apiKey,
      "X-Sedifex-Contract-Version": SEDIFEX_CONTRACT_VERSION,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  const responseData = await response.json().catch(() => null);
  const requestId = response.headers.get("x-sedifex-request-id") || undefined;

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: responseData?.error || "booking-list-request-failed",
        message: responseData?.message || "Booking list could not be fetched.",
        requestId
      },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true, requestId, data: responseData });
}
