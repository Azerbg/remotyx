import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { getUserIdFromSession, USER_SESSION_COOKIE } from "@/lib/userAuth";
import { ObjectId } from "mongodb";
import { Discussion } from "./Discussion";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value ?? "";
  const userId = await getUserIdFromSession(token);
  if (!userId) redirect("/login");

  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) redirect("/login");

  const requests = await db.collection("requests")
    .find({ email: user.email })
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = requests.map((r) => ({
    id: String(r._id),
    service: r.serviceLabel ?? r.service,
    category: r.category,
    description: r.description,
    plan: r.plan,
    urgency: r.urgency,
    status: r.status,
    createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—",
  }));

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-mono)", letterSpacing: "1px" }}>MY ACCOUNT</p>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Welcome, {user.name.split(" ")[0]}</h1>
      </div>

      {serialized.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: 40, textAlign: "center" }}>
          <p style={{ margin: "0 0 20px", color: "var(--muted)" }}>You have no requests yet.</p>
          <a href="/#request" className="btn btn-ink">Send a request</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {serialized.map((r) => (
            <div key={r.id} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden" }}>
              {/* Request header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{r.service}</span>
                    <span style={{ background: "var(--light)", borderRadius: 999, padding: "2px 10px", fontSize: 12, color: "var(--muted)" }}>{r.category}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>{r.description}</p>
                </div>
                <div style={{ textAlign: "right", fontSize: 13, color: "var(--muted)", flexShrink: 0 }}>
                  <div>{r.plan}</div>
                  <div>{r.createdAt}</div>
                </div>
              </div>
              {/* Discussion */}
              <Discussion requestId={r.id} />
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/#request" className="btn btn-ghost">New request</a>
        <form action="/api/logout" method="POST">
          <button type="submit" style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>Sign out</button>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    new: { bg: "#e8f5e9", color: "#2e7d32" },
    pending: { bg: "#fff8e1", color: "#f57f17" },
    done: { bg: "#e3f2fd", color: "#1565c0" },
  };
  const s = map[status] ?? { bg: "var(--light)", color: "var(--muted)" };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>
      {status}
    </span>
  );
}
