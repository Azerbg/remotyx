import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";
import { z } from "zod";

export const runtime = "nodejs";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  return verifySession(token);
}

export async function GET(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");
  if (!requestId) return NextResponse.json({ error: "Missing requestId." }, { status: 400 });

  const db = await getDb();
  const messages = await db.collection("messages").find({ requestId }).sort({ createdAt: 1 }).toArray();
  return NextResponse.json({ messages: messages.map((m) => ({ ...m, _id: String(m._id) })) });
}

const schema = z.object({ requestId: z.string().min(1), text: z.string().trim().min(1).max(2000) });

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 422 });

  const db = await getDb();
  await db.collection("messages").insertOne({
    requestId: parsed.data.requestId,
    from: "admin",
    text: parsed.data.text,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
