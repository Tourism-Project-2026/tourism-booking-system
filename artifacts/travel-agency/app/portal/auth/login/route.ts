import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { password?: string };
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password is not configured on this server." },
        { status: 503 }
      );
    }

    if (!body.password || body.password !== adminPassword) {
      // Uniform delay to resist timing-based enumeration
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
