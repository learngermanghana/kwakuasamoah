import { NextResponse } from "next/server";

const BASE = (process.env.SEDIFEX_API_BASE_URL || process.env.SEDIFEX_INTEGRATION_API_BASE_URL || "https://us-central1-sedifex-web.cloudfunctions.net").replace(/\/$/, "");
const CONTRACT = "2026-04-13";

type R = Record<string, unknown>;

type AmountLookupResult = {
  itemAmount: number;
  checkoutAmount: number;
  currency: string;
  source: string;
  item?: R | null;
  preview?: R | null;
};

const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const key = () => process.env.SEDIFEX_CHECKOUT_API_KEY || process.env.SEDIFEX_BOOKING_API_KEY || process.env.SEDIFEX_INTEGRATION_API_KEY || process.env.SEDIFEX_INTEGRATION_KEY || "";
const store = () => process.env.SEDIFEX_BOOKING_TARGET_STORE_ID || process.env.SEDIFEX_STORE_ID || "";
const checkoutUrl = () => process.env.SEDIFEX_INTEGRATION_CHECKOUT_CREATE_URL || `${BASE}/integrationCheckoutCreate`;
const ret = (req: Request) => process.env.SEDIFEX_CHECKOUT_RETURN_URL || new URL("/payment/return", req.url).toString();
const currency = () => process.env.BOOKING_CHECKOUT_CURRENCY || process.env.SEDIFEX_CHECKOUT_CURRENCY || "GHS";

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

function numberFrom(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }
  return 0;
}

function normalize(value: unknown) {
  return s(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function collectItems(value: unknown, depth = 0): R[] {
  if (!value || depth > 5) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        return [item as R, ...collectItems(item, depth + 1)];
      }
      return [];
    });
  }

  if (typeof value !== "object") return [];

  const record = value as R;
  const results: R[] = [];
  const likelyItemKeys = new Set([
    "items",
    "products",
    "services",
    "courses",
    "publicProducts",
    "publicServices",
    "publicCourses",
    "data",
    "catalog"
  ]);

  for (const [entryKey, entryValue] of Object.entries(record)) {
    if (Array.isArray(entryValue) && likelyItemKeys.has(entryKey)) {
      results.push(...collectItems(entryValue, depth + 1));
    } else if (entryValue && typeof entryValue === "object" && likelyItemKeys.has(entryKey)) {
      results.push(...collectItems(entryValue, depth + 1));
    }
  }

  return results;
}

function itemMatches(item: R, serviceId: string, serviceName: string) {
  const targets = [normalize(serviceId), normalize(serviceName)].filter(Boolean);
  const identifiers = [
    item.id,
    item.item_id,
    item.itemId,
    item.serviceId,
    item.service_id,
    item.productId,
    item.product_id,
    item.courseId,
    item.course_id,
    item.sku,
    item.slug,
    item.name,
    item.title,
    item.serviceName,
    item.service_name
  ].map(normalize).filter(Boolean);

  return targets.some((target) =>
    identifiers.some((identifier) => identifier === target || (target.length > 5 && identifier.includes(target)))
  );
}

function priceFrom(item: R) {
  const keys = [
    "price",
    "unitPrice",
    "unit_price",
    "amount",
    "checkoutAmount",
    "checkout_amount",
    "servicePrice",
    "service_price",
    "productPrice",
    "product_price",
    "coursePrice",
    "course_price",
    "salePrice",
    "sale_price",
    "sellingPrice",
    "selling_price",
    "finalPrice",
    "final_price",
    "basePrice",
    "base_price",
    "discountedPrice",
    "discounted_price"
  ];

  for (const priceKey of keys) {
    const amount = numberFrom(item[priceKey]);
    if (amount) return amount;
  }

  const pricing = item.pricing;
  if (pricing && typeof pricing === "object" && !Array.isArray(pricing)) {
    for (const priceKey of keys) {
      const amount = numberFrom((pricing as R)[priceKey]);
      if (amount) return amount;
    }
  }

  return 0;
}

function pickPreviewAmount(data: R | null) {
  const candidates = [
    data,
    data?.data as R | undefined,
    data?.checkout as R | undefined,
    data?.preview as R | undefined,
    data?.pricing as R | undefined,
    (data?.data as R | undefined)?.pricing as R | undefined,
    (data?.data as R | undefined)?.checkout as R | undefined
  ].filter((entry): entry is R => Boolean(entry && typeof entry === "object"));

  const keys = [
    "final_total",
    "finalTotal",
    "final_amount",
    "finalAmount",
    "checkoutAmount",
    "checkout_amount",
    "total",
    "totalAmount",
    "total_amount",
    "amount",
    "subtotal",
    "subTotal"
  ];

  for (const candidate of candidates) {
    for (const amountKey of keys) {
      const amount = numberFrom(candidate[amountKey]);
      if (amount) return amount;
    }
  }

  return 0;
}

function pickPreviewCurrency(data: R | null) {
  const candidates = [
    data,
    data?.data as R | undefined,
    data?.checkout as R | undefined,
    data?.preview as R | undefined,
    data?.pricing as R | undefined
  ].filter((entry): entry is R => Boolean(entry && typeof entry === "object"));

  for (const candidate of candidates) {
    const value = candidate.currency || candidate.checkoutCurrency || candidate.checkout_currency;
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return currency();
}

function headers(apiKey: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
    Authorization: `Bearer ${apiKey}`,
    "X-Sedifex-Contract-Version": CONTRACT
  };
}

async function catalogAmountFor(serviceId: string, serviceName: string, apiKey: string, storeId: string) {
  const endpoints = ["/integrationProducts", "/v1IntegrationProducts"];

  for (const path of endpoints) {
    try {
      const url = new URL(path, `${BASE}/`);
      url.searchParams.set("storeId", storeId);

      const res = await fetch(url, {
        headers: headers(apiKey),
        cache: "no-store"
      });

      if (!res.ok) continue;

      const data = (await res.json().catch(() => null)) as R | null;
      const items = collectItems(data);
      const found = items.find((item) => itemMatches(item, serviceId, serviceName));

      if (!found) continue;

      const amount = priceFrom(found);
      if (amount) {
        return { amount, item: found, source: path };
      }
    } catch {
      continue;
    }
  }

  return { amount: 0, item: null as R | null, source: "" };
}

function previewUrls() {
  const custom = process.env.SEDIFEX_INTEGRATION_CHECKOUT_PREVIEW_URL;
  return [
    custom,
    `${BASE}/integration/checkout/preview`,
    `${BASE}/integrationCheckoutPreview`
  ].filter((value): value is string => Boolean(value));
}

async function previewAmountFor(serviceId: string, serviceName: string, apiKey: string, storeId: string, itemAmount: number) {
  const payload = {
    storeId,
    merchantId: storeId,
    merchant_id: storeId,
    currency: currency(),
    fulfillment_type: "service",
    fulfillmentType: "service",
    items: [
      {
        id: serviceId,
        item_id: serviceId,
        serviceId,
        name: serviceName,
        serviceName,
        type: "SERVICE",
        item_type: "service",
        qty: 1,
        quantity: 1,
        ...(itemAmount ? { price: itemAmount, unitPrice: itemAmount, unit_price: itemAmount } : {})
      }
    ]
  };

  for (const endpoint of previewUrls()) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: headers(apiKey),
        body: JSON.stringify(payload),
        cache: "no-store"
      });

      if (!res.ok) continue;

      const data = (await res.json().catch(() => null)) as R | null;
      const amount = pickPreviewAmount(data);

      if (amount) {
        return { amount, currency: pickPreviewCurrency(data), preview: data, source: endpoint };
      }
    } catch {
      continue;
    }
  }

  return { amount: 0, currency: currency(), preview: null as R | null, source: "" };
}

async function amountFor(serviceId: string, serviceName: string, apiKey: string, storeId: string): Promise<AmountLookupResult> {
  const fallback = numberFrom(process.env.BOOKING_CHECKOUT_AMOUNT || 0);
  const catalog = await catalogAmountFor(serviceId, serviceName, apiKey, storeId);
  const preview = await previewAmountFor(serviceId, serviceName, apiKey, storeId, catalog.amount);

  const itemAmount = catalog.amount || preview.amount || fallback;
  const checkoutAmount = preview.amount || catalog.amount || fallback;

  return {
    itemAmount,
    checkoutAmount,
    currency: preview.currency || currency(),
    source: preview.source ? `sedifex-preview:${preview.source}` : catalog.source ? `sedifex-catalog:${catalog.source}` : fallback ? "env:BOOKING_CHECKOUT_AMOUNT" : "",
    item: catalog.item,
    preview: preview.preview
  };
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

  const amountDetails = await amountFor(serviceId, serviceName, apiKey, storeId);
  const amount = amountDetails.checkoutAmount;
  const itemAmount = amountDetails.itemAmount || amount;
  if (!amount) return NextResponse.json({ ok: false, error: "missing-checkout-amount" }, { status: 502 });

  const requestHeaders = headers(apiKey);
  const bookingEndpoint = new URL(`${BASE}/v1IntegrationBookings`);
  bookingEndpoint.searchParams.set("storeId", storeId);
  const bookingPayload = {
    serviceId,
    serviceName,
    customer: { name, email, phone },
    quantity: Number(body.quantity || 1),
    notes: s(body.notes),
    bookingDate: s(body.bookingDate || body.date),
    bookingTime: s(body.bookingTime),
    paymentMethod: "paystack_checkout",
    paymentAmount: amount,
    bookingStatus: "booked",
    paymentCollectionMode: "online_checkout",
    paymentStatus: "checkout_created",
    syncStatus: "pending",
    syncRequestedAt: new Date().toISOString(),
    attributes: {
      source: "website_booking_form",
      amountSource: amountDetails.source,
      itemAmount,
      checkoutAmount: amount,
      ...((body.attributes as R | undefined) || {})
    }
  };
  const bRes = await fetch(bookingEndpoint, { method: "POST", headers: requestHeaders, body: JSON.stringify(bookingPayload), cache: "no-store" });
  const bData = await bRes.json().catch(() => null) as R | null;
  if (!bRes.ok) return NextResponse.json({ ok: false, error: bData?.error || "booking-create-failed" }, { status: bRes.status });

  const bookingId = pickId(bData);
  const clientOrderId = bookingId ? `BOOKING-${bookingId}` : `BOOKING-${Date.now()}`;
  const cPayload = {
    storeId,
    merchantId: storeId,
    clientOrderId,
    orderType: "service",
    sourceChannel: "client_website",
    sourceLabel: "Client Website",
    currency: amountDetails.currency,
    amount,
    checkoutAmount: amount,
    customer: { name, email, phone },
    items: [
      {
        id: serviceId,
        item_id: serviceId,
        serviceId,
        name: serviceName,
        serviceName,
        unitPrice: itemAmount,
        unit_price: itemAmount,
        price: itemAmount,
        qty: 1,
        quantity: 1,
        type: "SERVICE",
        item_type: "service"
      }
    ],
    returnUrl: ret(req),
    metadata: {
      bookingId,
      clientOrderId,
      channel: "client-website",
      amountSource: amountDetails.source,
      itemAmount,
      checkoutAmount: amount
    }
  };
  const cRes = await fetch(checkoutUrl(), { method: "POST", headers: requestHeaders, body: JSON.stringify(cPayload), cache: "no-store" });
  const cData = await cRes.json().catch(() => null) as R | null;
  const url = pickUrl(cData);
  if (!cRes.ok || !url) return NextResponse.json({ ok: false, error: cData?.error || "checkout-create-failed", bookingId }, { status: cRes.status || 502 });

  return NextResponse.json({ ok: true, message: "Booking created. Redirecting to secure checkout.", data: bData, checkout: { bookingId, clientOrderId, authorizationUrl: url, checkoutUrl: url } });
}
