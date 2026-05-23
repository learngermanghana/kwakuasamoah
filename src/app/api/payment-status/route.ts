import { NextResponse } from "next/server";

const FALLBACK_BASE_URL = "https://us-central1-sedifex-web.cloudfunctions.net";

function getConfig() {
  return {
    baseUrl: process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL || FALLBACK_BASE_URL,
    apiKey:
      process.env.SEDIFEX_INTEGRATION_API_KEY ||
      process.env.SEDIFEX_PRODUCTS_API_KEY ||
      process.env.SEDIFEX_BOOKING_API_KEY,
    contractVersion: process.env.SEDIFEX_CONTRACT_VERSION || "2026-04-13"
  };
}

export async function GET(req: Request) {
  const { baseUrl, apiKey, contractVersion } = getConfig();
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "sedifex-not-configured", message: "Payment status is not configured." }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference")?.trim();

  if (!reference) {
    return NextResponse.json({ ok: false, error: "missing-reference", message: "reference is required." }, { status: 400 });
  }

  const endpoint = new URL(`/integration/orders/${encodeURIComponent(reference)}`, baseUrl);
  const response = await fetch(endpoint, {
    headers: {
      "x-api-key": apiKey,
      "X-Sedifex-Contract-Version": contractVersion,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: (data as { error?: string } | null)?.error || "payment-status-fetch-failed",
        message: (data as { message?: string } | null)?.message || "Could not fetch payment status.",
        data
      },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true, reference, data });
}
