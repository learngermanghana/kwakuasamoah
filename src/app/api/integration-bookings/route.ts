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
  paymentCollectionMode?: string;
  paymentConfirmed?: boolean | string;
  status?: string;
};

const BOOKING_STATUS = "booked";
const PAYMENT_COLLECTION_MODE = "online_checkout";
const PAYMENT_STATUS_CHECKOUT_CREATED = "checkout_created";

type SedifexCheckoutResponse = {
  ok?: boolean;
  reference?: string;
  sedifexOrderId?: string;
  authorizationUrl?: string;
  expiresAt?: string;
  error?: string;
  message?: string;
};

type CheckoutEnvelope = {
  ok?: boolean;
  data?: SedifexCheckoutResponse | Record<string, unknown>;
  checkout?: SedifexCheckoutResponse | Record<string, unknown>;
  authorizationUrl?: string;
  authorization_url?: string;
  reference?: string;
  expiresAt?: string;
  expires_at?: string;
  error?: string;
  message?: string;
};

type SedifexServiceItem = {
  id?: string;
  name?: string;
  price?: number;
};

type SedifexProductsPayload = {
  products?: SedifexServiceItem[];
  publicProducts?: SedifexServiceItem[];
  publicServices?: SedifexServiceItem[];
};

function resolveCheckoutResponse(payload: CheckoutEnvelope | SedifexCheckoutResponse | null) {
  if (!payload) return null;
  const source = (payload as CheckoutEnvelope).data || (payload as CheckoutEnvelope).checkout || payload;
  const record = source as Record<string, unknown>;

  const authorizationUrl =
    (record.authorizationUrl as string | undefined) ||
    (record.authorization_url as string | undefined) ||
    ((payload as CheckoutEnvelope).authorizationUrl as string | undefined) ||
    ((payload as CheckoutEnvelope).authorization_url as string | undefined);

  const reference =
    (record.reference as string | undefined) || ((payload as CheckoutEnvelope).reference as string | undefined);

  return {
    ok: Boolean((record.ok as boolean | undefined) ?? (payload as CheckoutEnvelope).ok ?? true),
    reference,
    sedifexOrderId: (record.sedifexOrderId as string | undefined) || (record.sedifex_order_id as string | undefined),
    authorizationUrl,
    expiresAt:
      (record.expiresAt as string | undefined) ||
      (record.expires_at as string | undefined) ||
      ((payload as CheckoutEnvelope).expiresAt as string | undefined) ||
      ((payload as CheckoutEnvelope).expires_at as string | undefined),
    error: (record.error as string | undefined) || (payload as CheckoutEnvelope).error,
    message: (record.message as string | undefined) || (payload as CheckoutEnvelope).message
  } satisfies SedifexCheckoutResponse;
}

function resolveRuntimeReturnUrl(req: Request) {
  return new URL("/payment/return", req.url).toString();
}

async function resolveServiceCheckoutAmount({
  baseUrl,
  apiKey,
  storeId,
  serviceId,
  serviceName
}: {
  baseUrl: string;
  apiKey: string;
  storeId: string;
  serviceId?: string;
  serviceName?: string;
}) {
  const endpoint = new URL("/v1IntegrationProducts", baseUrl);
  endpoint.searchParams.set("storeId", storeId);

  const response = await fetch(endpoint, {
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${apiKey}`,
      "X-Sedifex-Contract-Version": "2026-04-13",
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) return undefined;

  const payload = (await response.json()) as SedifexProductsPayload;
  const services = payload.publicServices || payload.publicProducts || payload.products || [];

  const matched =
    services.find((item) => item.id && serviceId && item.id === serviceId) ||
    services.find((item) => item.name && serviceName && item.name === serviceName);

  if (typeof matched?.price === "number" && Number.isFinite(matched.price) && matched.price > 0) {
    return matched.price;
  }

  return undefined;
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, RateLimitEntry>();


function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function exceedsRateLimit(clientIp: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(clientIp);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  rateLimitStore.set(clientIp, entry);
  return false;
}

export async function POST(req: Request) {
  const baseUrl = (process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL || "https://us-central1-sedifex-web.cloudfunctions.net").replace(/\/$/, "");
  const apiKey =
    process.env.SEDIFEX_CHECKOUT_API_KEY ||
    process.env.SEDIFEX_BOOKING_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_KEY ||
    "";
  const storeId =
    process.env.SEDIFEX_BOOKING_TARGET_STORE_ID ||
    process.env.SEDIFEX_CHECKOUT_STORE_ID ||
    process.env.SEDIFEX_STORE_ID ||
    "";
  const defaultServiceId = process.env.BOOKING_DEFAULT_SERVICE_ID;
  const checkoutCurrency = process.env.BOOKING_CHECKOUT_CURRENCY || "GHS";

  if (!apiKey || !storeId) {
    return NextResponse.json(
      { ok: false, error: "Sedifex integration is not configured." },
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

    if (booking.website && String(booking.website).trim()) {
      return NextResponse.json({ ok: false, error: "invalid-request", message: "Booking could not be created." }, { status: 400 });
    }

    const customerName =
      booking.customer?.name ||
      booking.customerName ||
      (body.customerName as string | undefined) ||
      (body.fullName as string | undefined) ||
      (body.clientName as string | undefined) ||
      (body.name as string | undefined);
    const customerPhone =
      booking.customer?.phone ||
      booking.customerPhone ||
      (body.phoneNumber as string | undefined) ||
      (body.mobile as string | undefined) ||
      (body.whatsapp as string | undefined) ||
      (body.phone as string | undefined);
    const customerEmail =
      booking.customer?.email ||
      booking.customerEmail ||
      (body.emailAddress as string | undefined) ||
      (body.email as string | undefined);
    const bookingDate = booking.bookingDate || (body.date as string | undefined) || (body.travelDates as string | undefined);
    const notes = booking.notes || (body.message as string | undefined);
    const slotId = booking.slotId || booking.slotID || booking.slot_id || (body.slotId as string | undefined);
    const quantity = Math.max(Number(booking.quantity || body.quantity || 1), 1);

    const paymentMethod = "paystack_checkout";
    const paymentConfirmed = false;

    if (!customerName && !customerPhone && !customerEmail) {
      return NextResponse.json(
        { ok: false, error: "missing-customer", message: "Please provide at least one customer contact field (name, phone, or email)." },
        { status: 400 }
      );
    }

    const endpoint = new URL("/v1IntegrationBookings", baseUrl);
    endpoint.searchParams.set("storeId", storeId);

    const checkoutAmount =
      (await resolveServiceCheckoutAmount({
        baseUrl,
        apiKey,
        storeId,
        serviceId: booking.serviceId || defaultServiceId,
        serviceName: booking.serviceName
      })) || Number(process.env.BOOKING_CHECKOUT_AMOUNT || 0);

    if (!checkoutAmount || checkoutAmount <= 0) {
      return NextResponse.json(
        { ok: false, error: "missing-checkout-amount", message: "Booking could not be created because service price could not be resolved." },
        { status: 502 }
      );
    }

    const syncRequestedAt = new Date().toISOString();

    const payload = {
      serviceId: booking.serviceId || defaultServiceId,
      slotId,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail
      },
      quantity,
      notes,
      bookingDate,
      bookingTime: booking.bookingTime,
      serviceName: booking.serviceName,
      bookingStatus: BOOKING_STATUS,
      paymentCollectionMode: PAYMENT_COLLECTION_MODE,
      paymentStatus: PAYMENT_STATUS_CHECKOUT_CREATED,
      paymentMethod,
      syncStatus: "pending",
      syncRequestedAt,
      paymentAmount: checkoutAmount,
      payment: {
        amount: checkoutAmount,
        method: paymentMethod,
        confirmed: paymentConfirmed,
        status: PAYMENT_STATUS_CHECKOUT_CREATED,
        collectionMode: PAYMENT_COLLECTION_MODE
      },
      attributes: {
        source: "website_booking_form",
        bookingStatus: BOOKING_STATUS,
        paymentCollectionMode: PAYMENT_COLLECTION_MODE,
        paymentStatus: PAYMENT_STATUS_CHECKOUT_CREATED,
        paymentMethod,
        paymentAmount: checkoutAmount,
        syncStatus: "pending",
        syncRequestedAt,
        ...(booking.attributes || {})
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
        "X-Sedifex-Contract-Version": "2026-04-13",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const responseData = await response.json().catch(() => null);
    console.log("booking raw response:", responseData);

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: responseData?.error || "booking-request-failed",
          message: responseData?.message || "Booking could not be created."
        },
        { status: response.status }
      );
    }


    const bookingRecord = responseData?.data || responseData;
    const bookingId = bookingRecord?.id || bookingRecord?.bookingId || bookingRecord?.orderId;
    const resolvedClientOrderId =
      bookingRecord?.clientOrderId || `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const checkoutEndpoint = process.env.SEDIFEX_INTEGRATION_CHECKOUT_CREATE_URL
      ? new URL(process.env.SEDIFEX_INTEGRATION_CHECKOUT_CREATE_URL)
      : new URL("/integrationCheckoutCreate", baseUrl);
    const checkoutPayload = {
      storeId,
      merchantId: storeId,
      sourceChannel: "client_website",
      sourceLabel: "Client Website",
      clientOrderId: resolvedClientOrderId,
      orderType: "service",
      currency: checkoutCurrency,
      items: [
        {
          id: booking.serviceId || defaultServiceId || "service",
          item_id: booking.serviceId || defaultServiceId || "service",
          serviceId: booking.serviceId || defaultServiceId || "service",
          name: booking.serviceName || "Service booking",
          serviceName: booking.serviceName || "Service booking",
          unitPrice: checkoutAmount,
          qty: 1,
          type: "SERVICE",
          item_type: "service"
        }
      ],
      amount: checkoutAmount,
      customer: {
        email: customerEmail,
        phone: customerPhone,
        name: customerName
      },
      returnUrl: resolveRuntimeReturnUrl(req),
      metadata: {
        channel: "client-website",
        bookingId,
        clientOrderId: resolvedClientOrderId
      }
    };

    const safeCheckoutPayload = {
      ...checkoutPayload,
      customer: {
        ...checkoutPayload.customer,
        email: checkoutPayload.customer.email ? "[REDACTED]" : checkoutPayload.customer.email,
        phone: checkoutPayload.customer.phone ? "[REDACTED]" : checkoutPayload.customer.phone,
        name: checkoutPayload.customer.name ? "[REDACTED]" : checkoutPayload.customer.name
      }
    };

    console.log("checkout payload sent:", safeCheckoutPayload);

    const checkoutResponse = await fetch(checkoutEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
        "X-Sedifex-Contract-Version": "2026-04-13",
        Accept: "application/json"
      },
      body: JSON.stringify(checkoutPayload),
      cache: "no-store"
    });

    console.log("checkout status:", checkoutResponse.status, checkoutResponse.statusText);

    const checkoutRawText = await checkoutResponse.text();
    console.log("checkout raw response:", checkoutRawText);

    let checkoutPayloadResponse: CheckoutEnvelope | SedifexCheckoutResponse | null = null;
    try {
      checkoutPayloadResponse = JSON.parse(checkoutRawText) as CheckoutEnvelope | SedifexCheckoutResponse;
      console.log("checkout parsed JSON:", checkoutPayloadResponse);
    } catch {
      console.log("checkout parsed JSON:", null);
    }

    const checkoutData = resolveCheckoutResponse(checkoutPayloadResponse);
    console.log("checkout normalized:", checkoutData);

    if (!checkoutResponse.ok || !checkoutData?.ok || !checkoutData.authorizationUrl || !checkoutData.reference) {
      return NextResponse.json(
        {
          ok: false,
          error: checkoutData?.error || checkoutData?.message || "checkout-create-failed",
          message: checkoutData?.message || checkoutData?.error || "checkout-create-failed"
        },
        { status: checkoutResponse.status || 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Booking created. Redirecting to secure checkout.",
      data: responseData,
      checkout: {
        reference: checkoutData.reference,
        sedifexOrderId: checkoutData.sedifexOrderId,
        bookingId,
        clientOrderId: resolvedClientOrderId,
        authorizationUrl: checkoutData.authorizationUrl,
        expiresAt: checkoutData.expiresAt
      }
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const baseUrl = process.env.SEDIFEX_API_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY;
  const defaultStoreId = process.env.SEDIFEX_STORE_ID;

  if (!baseUrl || !apiKey || !defaultStoreId) {
    return NextResponse.json(
      { ok: false, error: "Sedifex integration is not configured." },
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
      Authorization: `Bearer ${apiKey}`,
      "X-Sedifex-Contract-Version": "2026-04-13",
      Accept: "application/json"
    },
    cache: "no-store"
  });

  const responseData = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: responseData?.error || "booking-list-request-failed",
        message: responseData?.message || "Booking list could not be fetched."
      },
      { status: response.status }
    );
  }

  return NextResponse.json({
    ok: true,
    data: responseData
  });
}
