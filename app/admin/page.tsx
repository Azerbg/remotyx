import { getDb } from "@/lib/mongodb";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await getDb();
  const [reqCount, userCount, contactCount] = await Promise.all([
    db.collection("requests").countDocuments(),
    db.collection("users").countDocuments(),
    db.collection("contacts").countDocuments(),
  ]);

  const recent = await db.collection("requests")
    .find({})
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ margin: "0 0 32px", color: "#555e70" }}>Overview of all activity on Remotyx.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
        <StatCard label="Total Requests" value={reqCount} href="/admin/requests" />
        <StatCard label="Registered Accounts" value={userCount} href="/admin/users" />
        <StatCard label="Contact Messages" value={contactCount} href="/admin/contacts" />
      </div>

      <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>Recent requests</h2>
      <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f4f5f7", borderBottom: "1px solid #e3e6ec" }}>
              {["Name", "Company", "Service", "Plan", "Status", "Date"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#555e70", fontSize: 13 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 24, color: "#9aa3b5", textAlign: "center" }}>No requests yet.</td></tr>
            )}
            {recent.map((r, i) => (
              <tr key={String(r._id)} style={{ borderBottom: i < recent.length - 1 ? "1px solid #f0f1f3" : undefined }}>
                <td style={{ padding: "12px 16px" }}>{r.name}</td>
                <td style={{ padding: "12px 16px", color: "#555e70" }}>{r.company}</td>
                <td style={{ padding: "12px 16px" }}>{r.serviceLabel ?? r.service}</td>
                <td style={{ padding: "12px 16px", color: "#555e70" }}>{r.plan}</td>
                <td style={{ padding: "12px 16px" }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: "12px 16px", color: "#9aa3b5", fontSize: 13 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {reqCount > 8 && (
        <div style={{ marginTop: 12 }}>
          <Link href="/admin/requests" style={{ color: "#0b0d12", fontSize: 14, fontWeight: 500 }}>View all {reqCount} requests →</Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#9aa3b5", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 36, fontWeight: 800, color: "#0b0d12", lineHeight: 1 }}>{value}</span>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    new: { bg: "#e8f5e9", color: "#2e7d32" },
    pending: { bg: "#fff8e1", color: "#f57f17" },
    done: { bg: "#e3f2fd", color: "#1565c0" },
  };
  const s = colors[status] ?? { bg: "#f5f5f5", color: "#555e70" };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
      {status}
    </span>
  );
}
