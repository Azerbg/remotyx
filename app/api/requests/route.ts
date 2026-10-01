import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/mongodb";
import { requestSchema } from "@/lib/validation";
import { SERVICE_OPTIONS } from "@/lib/content";

export const runtime = "nodejs";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const { website, consent, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }, { status: 201 }); // bot: pretend success

  const serviceLabel = SERVICE_OPTIONS.find((o) => o.id === data.service)?.label ?? data.service;
  const doc = {
    ...data,
    serviceLabel,
    consentAt: new Date(),
    status: "new",
    createdAt: new Date(),
    userAgent: req.headers.get("user-agent") ?? "",
  };

  try {
    const db = await getDb();
    const result = await db.collection("requests").insertOne(doc);

    if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const rows = [
        ["Service", serviceLabel],
        ["Category", data.category],
        ["Urgency", data.urgency],
        ["Plan", data.plan],
        ["Language", data.language],
        ["Time zone", data.timezone],
        ["Name", data.name],
        ["Company", data.company],
        ["Email", data.email],
        ["Country", data.country],
        ["Phone", data.phone || "—"],
      ]
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555E70">${k}</td><td>${escape(v)}</td></tr>`)
        .join("");
      const tasks: Promise<unknown>[] = [
        resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: data.email,
          subject: "We received your request — Remotyx",
          html: `<p>Hi ${escape(data.name.split(" ")[0])},</p><p>Thanks for your request. The first experts will reply within 24 hours.</p><table>${rows}</table><p>${escape(data.description).replace(/\n/g, "<br>")}</p><p>— Remotyx</p>`,
        }),
      ];
      if (process.env.NOTIFY_EMAIL) {
        tasks.push(
          resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: process.env.NOTIFY_EMAIL,
            replyTo: data.email,
            subject: `New ${data.urgency === "Urgent" ? "URGENT " : ""}request: ${serviceLabel} — ${data.company}`,
            html: `<table>${rows}</table><p>${escape(data.description).replace(/\n/g, "<br>")}</p><p>ID: ${result.insertedId}</p>`,
          }),
        );
      }
      // Emails are best-effort: the request is already saved.
      await Promise.allSettled(tasks);
    }

    return NextResponse.json({ ok: true, id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error("[requests] save failed", err);
    return NextResponse.json(
      { error: "Your request could not be saved right now. Please try again in a minute or email hello@remotyx.com." },
      { status: 500 },
    );
  }
}
