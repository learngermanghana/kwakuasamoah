import { NextResponse } from "next/server";

type BookingPayload = {
  serviceId?: string;
  serviceName?: string;
  bookingDate?: string;
  bookingTime?: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  website?: string;
  attributes?: Record<string, unknown>;
};

type SedifexCheckoutResponse = {
  ok?: boolean;
  reference?: string;
  sedifexOrderId?: string;
  authorizationUrl?: string;
  expiresAt?: string;
  error?: string;
  message?: string;
};

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
  const baseUrl = process.env.SEDIFEX_API_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY;
  const storeId = process.env.SEDIFEX_STORE_ID;
  const defaultServiceId = process.env.BOOKING_DEFAULT_SERVICE_ID;
  const checkoutAmount = Number(process.env.BOOKING_CHECKOUT_AMOUNT || 0);
  const checkoutCurrency = process.env.BOOKING_CHECKOUT_CURRENCY || "GHS";
  const checkoutReturnUrl = process.env.BOOKING_CHECKOUT_RETURN_URL;

  if (!baseUrl || !apiKey || !storeId) {
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

    const customerName = booking.customerName || (body.name as string | undefined);
    const customerPhone = booking.customerPhone || (body.phone as string | undefined);
    const customerEmail = booking.customerEmail || (body.email as string | undefined);
    const bookingDate = booking.bookingDate || (body.travelDates as string | undefined);
    const notes = booking.notes || (body.message as string | undefined);

    if (!customerName) {
      return NextResponse.json(
        { ok: false, error: "missing-name", message: "Please provide your full name." },
        { status: 400 }
      );
    }

    if (!customerPhone && !customerEmail) {
      return NextResponse.json(
        { ok: false, error: "missing-contact", message: "Please provide an email or phone number." },
        { status: 400 }
      );
    }

    const endpoint = new URL("/v1IntegrationBookings", baseUrl);
    endpoint.searchParams.set("storeId", storeId);

    const payload = {
      serviceId: booking.serviceId || defaultServiceId,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail
      },
      notes,
      bookingDate,
      bookingTime: booking.bookingTime,
      serviceName: booking.serviceName,
      attributes: {
        source: "website_booking_form",
        ...(booking.attributes || {})
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "X-Sedifex-Contract-Version": "2026-04-13",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const responseData = await response.json().catch(() => null);

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

    if (!checkoutAmount || !checkoutReturnUrl) {
      return NextResponse.json({ ok: true, message: "Booking created.", data: responseData });
    }

    const bookingRecord = responseData?.data || responseData;
    const sedifexOrderId = bookingRecord?.id || bookingRecord?.bookingId || bookingRecord?.orderId;
    const resolvedClientOrderId =
      bookingRecord?.clientOrderId || `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const checkoutEndpoint = new URL("/integration/checkout/create", baseUrl);
    const checkoutPayload = {
      storeId,
      clientOrderId: resolvedClientOrderId,
      orderType: "service",
      currency: checkoutCurrency,
      items: [
        {
          id: booking.serviceId || defaultServiceId || "service",
          name: booking.serviceName || "Service booking",
          unitPrice: checkoutAmount,
          qty: 1
        }
      ],
      amount: checkoutAmount,
      customer: {
        email: customerEmail,
        phone: customerPhone,
        name: customerName
      },
      returnUrl: checkoutReturnUrl,
      metadata: {
        channel: "client-website",
        bookingId: sedifexOrderId,
        sedifexOrderId,
        clientOrderId: resolvedClientOrderId
      }
    };

    const checkoutResponse = await fetch(checkoutEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "X-Sedifex-Contract-Version": "2026-04-13",
        Accept: "application/json"
      },
      body: JSON.stringify(checkoutPayload),
      cache: "no-store"
    });

    const checkoutData = (await checkoutResponse.json().catch(() => null)) as SedifexCheckoutResponse | null;

    if (!checkoutResponse.ok || !checkoutData?.ok || !checkoutData.authorizationUrl || !checkoutData.reference) {
      return NextResponse.json(
        {
          ok: false,
          error: checkoutData?.error || "checkout-create-failed",
          message: checkoutData?.message || "Booking was created but checkout could not be initialized."
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
        sedifexOrderId: checkoutData.sedifexOrderId || sedifexOrderId,
        clientOrderId: resolvedClientOrderId,
        authorizationUrl: checkoutData.authorizationUrl,
        expiresAt: checkoutData.expiresAt
      }
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
  }
}
