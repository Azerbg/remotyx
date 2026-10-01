import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

async function checkAdmin() {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value ?? "");
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json().catch(() => ({}));
  if (!["approved", "rejected"].includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const db = await getDb();
  await db.collection("reviews").updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const db = await getDb();
  await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
