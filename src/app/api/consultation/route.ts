import { NextResponse } from "next/server";

const requiredFields = ["name", "email", "phone", "country", "destination"];

function sanitize(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const payload = {
    name: sanitize(formData.get("name")),
    email: sanitize(formData.get("email")),
    phone: sanitize(formData.get("phone")),
    country: sanitize(formData.get("country")),
    destination: sanitize(formData.get("destination")),
    dates: sanitize(formData.get("dates")),
    budget: sanitize(formData.get("budget")),
    message: sanitize(formData.get("message")),
    submittedAt: new Date().toISOString(),
  };

  const missing = requiredFields.filter((field) => !payload[field as keyof typeof payload]);

  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  if (!payload.email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Please provide a valid email address." }, { status: 400 });
  }

  const webhookUrl = process.env.CONSULTATION_WEBHOOK_URL;

  if (webhookUrl) {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "We could not submit your request right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }
  } else {
    console.info("[consultation submission]", payload);
  }

  return NextResponse.json({ ok: true });
}
