import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "Admin credentials not configured." }, { status: 500 });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return res;
}
