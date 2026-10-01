import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

export const runtime = "nodejs";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  company: z.string().trim().max(160).optional().default(""),
  role: z.enum(["client", "expert"]),
  website: z.string().max(0).optional().default(""), // honeypot
});

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const { website, password, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }, { status: 201 });

  try {
    const db = await getDb();

    data.email = data.email.toLowerCase();
    const existing = await db.collection("users").findOne({ email: data.email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists.", fieldErrors: { email: "This email is already registered." } },
        { status: 409 },
      );
    }

    // Store a bcrypt-style placeholder — swap for real hashing before production
    const doc = {
      ...data,
      passwordHash: `__plain__${password}`,
      status: "pending",
      createdAt: new Date(),
      userAgent: req.headers.get("user-agent") ?? "",
    };

    await db.collection("users").insertOne(doc);

    if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: data.email,
        subject: "Welcome to Remotyx",
        html: `<p>Hi ${escape(data.name.split(" ")[0])},</p><p>Your account has been created. We'll be in touch shortly.</p><p>— Remotyx</p>`,
      }).catch(() => null);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[register] save failed", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again or contact hello@remotyx.com." },
      { status: 500 },
    );
  }
}
