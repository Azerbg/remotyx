import { getDb } from "@/lib/mongodb";
import { AdminDiscussion } from "./AdminDiscussion";

export const dynamic = "force-dynamic";

export default async function AdminRequests() {
  const db = await getDb();
  const rows = await db.collection("requests").find({}).sort({ createdAt: -1 }).toArray();

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700 }}>Requests</h1>
      <p style={{ margin: "0 0 28px", color: "#555e70" }}>{rows.length} total request{rows.length !== 1 ? "s" : ""}.</p>

      <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 900 }}>
          <thead>
            <tr style={{ background: "#f4f5f7", borderBottom: "1px solid #e3e6ec" }}>
              {["Name", "Email", "Company", "Service", "Category", "Plan", "Urgency", "Country", "Status", "Date"].map((h) => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#555e70", fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={10} style={{ padding: 32, color: "#9aa3b5", textAlign: "center" }}>No requests yet.</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={String(r._id)} style={{ borderBottom: i < rows.length - 1 ? "1px solid #f0f1f3" : undefined }}>
                <td style={{ padding: "11px 14px", fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: "11px 14px", color: "#555e70" }}>{r.email}</td>
                <td style={{ padding: "11px 14px", color: "#555e70" }}>{r.company}</td>
                <td style={{ padding: "11px 14px" }}>{r.serviceLabel ?? r.service}</td>
                <td style={{ padding: "11px 14px", color: "#555e70", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.category}</td>
                <td style={{ padding: "11px 14px" }}>{r.plan}</td>
                <td style={{ padding: "11px 14px", color: "#555e70" }}>{r.urgency}</td>
                <td style={{ padding: "11px 14px", color: "#555e70" }}>{r.country}</td>
                <td style={{ padding: "11px 14px" }}>
                  <StatusBadge status={r.status} />
                </td>
                <td style={{ padding: "11px 14px", color: "#9aa3b5", fontSize: 12, whiteSpace: "nowrap" }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <AdminDiscussion requestId={String(r._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
