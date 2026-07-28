import { NextResponse } from "next/server";
import { readDB, writeDB, DBData } from "@/lib/db-client";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_TOKEN = "kwaku-crm-session-token-secure-2026";

async function isAuthorized(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader === `Bearer ${SESSION_TOKEN}`) {
    return true;
  }
  
  // Also check cookies for easier server-side rendering auth checks
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === SESSION_TOKEN;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "check-auth") {
    const authorized = await isAuthorized(req);
    return NextResponse.json({ authorized });
  }

  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = readDB();
    return NextResponse.json(db);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // Handle Login Action
  if (action === "login") {
    const body = await req.json().catch(() => ({}));
    if (body.password === ADMIN_PASSWORD) {
      // Set secure cookie
      const response = NextResponse.json({ success: true, token: SESSION_TOKEN });
      response.cookies.set("admin_token", SESSION_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
      return response;
    }
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Handle Logout Action
  if (action === "logout") {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_token");
    return response;
  }

  // All other POST actions require authorization
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = readDB();
    const body = await req.json().catch(() => ({}));

    switch (action) {
      case "update_settings":
        db.settings = { ...db.settings, ...body };
        break;

      case "update_packages":
        // body should contain the full packages list from CRM
        if (Array.isArray(body)) {
          db.packages = body;
        }
        break;

      case "update_blogs":
        // body should contain the full blogs list from CRM
        if (Array.isArray(body)) {
          db.blogs = body;
        }
        break;

      case "update_gallery":
        // body should contain the full gallery list from CRM
        if (Array.isArray(body)) {
          db.gallery = body;
        }
        break;

      case "update_bookings":
        // body should contain the full bookings list from CRM
        if (Array.isArray(body)) {
          db.bookings = body;
        }
        break;

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    writeDB(db);
    return NextResponse.json({ success: true, db });
  } catch (error) {
    console.error("API POST error", error);
    return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
  }
}
