import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(200),
  type: z.enum(["Message", "Request", "Special demand"]),
  subject: z.string().trim().min(2, "Enter a subject.").max(200),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(5000),
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }, { status: 201 });

  const doc = { ...data, status: "new", createdAt: new Date(), userAgent: req.headers.get("user-agent") ?? "" };

  try {
    const db = await getDb();
    const result = await db.collection("contacts").insertOne(doc);

    if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const tasks: Promise<unknown>[] = [
        resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: data.email,
          subject: "We received your message — Remotyx",
          html: `<p>Hi ${escape(data.name.split(" ")[0])},</p><p>Thanks for reaching out. We'll get back to you within one business day.</p><p>— Remotyx</p>`,
        }),
      ];
      if (process.env.NOTIFY_EMAIL) {
        tasks.push(
          resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: process.env.NOTIFY_EMAIL,
            replyTo: data.email,
            subject: `[${data.type}] ${data.subject} — ${data.name}`,
            html: `<p><b>From:</b> ${escape(data.name)} &lt;${escape(data.email)}&gt;</p><p><b>Type:</b> ${data.type}</p><p><b>Subject:</b> ${escape(data.subject)}</p><p>${escape(data.message).replace(/\n/g, "<br>")}</p><p>ID: ${result.insertedId}</p>`,
          }),
        );
      }
      await Promise.allSettled(tasks);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[contact] save failed", err);
    return NextResponse.json(
      { error: "Your message could not be sent right now. Please try again or email hello@remotyx.com." },
      { status: 500 },
    );
  }
}
