import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { getUserIdFromSession, USER_SESSION_COOKIE } from "@/lib/userAuth";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value ?? "";
  const userId = await getUserIdFromSession(token);
  if (!userId) return NextResponse.json({ count: 0 });

  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) return NextResponse.json({ count: 0 });

  // Get all request IDs for this user
  const requests = await db.collection("requests").find({ email: user.email }, { projection: { _id: 1 } }).toArray();
  const requestIds = requests.map((r) => String(r._id));

  // Count admin messages not yet read by the user
  const lastRead = user.messagesReadAt ? new Date(user.messagesReadAt) : new Date(0);
  const count = await db.collection("messages").countDocuments({
    requestId: { $in: requestIds },
    from: "admin",
    createdAt: { $gt: lastRead },
  });

  return NextResponse.json({ count });
}

export async function POST() {
  // Mark all messages as read
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value ?? "";
  const userId = await getUserIdFromSession(token);
  if (!userId) return NextResponse.json({ ok: false });

  const db = await getDb();
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { messagesReadAt: new Date() } },
  );

  return NextResponse.json({ ok: true });
}
