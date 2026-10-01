import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { getUserIdFromSession, USER_SESSION_COOKIE } from "@/lib/userAuth";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  requestId: z.string().min(1),
  text: z.string().trim().min(1).max(2000),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");
  if (!requestId) return NextResponse.json({ error: "Missing requestId." }, { status: 400 });

  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value ?? "";
  const userId = await getUserIdFromSession(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const db = await getDb();
  const messages = await db.collection("messages")
    .find({ requestId })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json({ messages: messages.map((m) => ({ ...m, _id: String(m._id) })) });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value ?? "";
  const userId = await getUserIdFromSession(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 422 });

  const db = await getDb();

  // Verify the request belongs to this user
  const request = await db.collection("requests").findOne({ _id: new ObjectId(parsed.data.requestId) });
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!request || !user || request.email !== user.email) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const doc = {
    requestId: parsed.data.requestId,
    userId,
    from: "client",
    text: parsed.data.text,
    createdAt: new Date(),
  };

  const result = await db.collection("messages").insertOne(doc);
  return NextResponse.json({ ok: true, id: String(result.insertedId) }, { status: 201 });
}
