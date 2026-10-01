import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().default(""),
  service: z.string().trim().max(80).optional().default(""),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(1000),
  website: z.string().max(0).optional().default(""),
});

export async function GET() {
  const db = await getDb();
  const reviews = await db.collection("reviews")
    .find({ status: "approved" })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json({ reviews: reviews.map((r) => ({ ...r, _id: String(r._id) })) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
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

  const db = await getDb();
  await db.collection("reviews").insertOne({ ...data, status: "pending", createdAt: new Date() });
  return NextResponse.json({ ok: true }, { status: 201 });
}
