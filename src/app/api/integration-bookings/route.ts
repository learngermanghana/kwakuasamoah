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
};

export async function POST(req: Request) {
  const baseUrl = process.env.SEDIFEX_API_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY;
  const storeId = process.env.SEDIFEX_STORE_ID;
  const defaultServiceId = process.env.BOOKING_DEFAULT_SERVICE_ID;

  if (!baseUrl || !apiKey || !storeId) {
    return NextResponse.json(
      { ok: false, error: "Sedifex integration is not configured." },
      { status: 500 }
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
    const customerName = booking.customerName || (body.name as string | undefined);
    const customerPhone = booking.customerPhone || (body.phone as string | undefined);
    const customerEmail = booking.customerEmail || (body.email as string | undefined);
    const bookingDate = booking.bookingDate || (body.travelDates as string | undefined);
    const notes = booking.notes || (body.message as string | undefined);

    if (!customerName && !customerPhone && !customerEmail) {
      return NextResponse.json(
        { ok: false, error: "At least one customer contact field is required." },
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
        source: "website_booking_form"
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

    return NextResponse.json({ ok: true, message: "Booking created.", data: responseData });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request payload." }, { status: 400 });
  }
}
