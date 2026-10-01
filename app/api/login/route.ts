import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { createUserSession, USER_SESSION_COOKIE } from "@/lib/userAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email.trim().toLowerCase() });

    if (!user || user.passwordHash !== `__plain__${password}`) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createUserSession(String(user._id));
    const res = NextResponse.json({ ok: true, name: user.name });

    res.cookies.set(USER_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    // Non-httpOnly cookie for display only (name in header)
    res.cookies.set("user_name", user.name, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
