import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  return verifySession(token);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json().catch(() => ({}));

  const allowed = ["active", "pending", "suspended"];
  if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const db = await getDb();
  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const db = await getDb();
  const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
