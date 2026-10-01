import { getDb } from "@/lib/mongodb";
import { UserActions } from "./UserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const db = await getDb();
  const rows = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray();

  const pending = rows.filter((r) => r.status === "pending").length;
  const active = rows.filter((r) => r.status === "active").length;
  const suspended = rows.filter((r) => r.status === "suspended").length;

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700 }}>Accounts</h1>
      <p style={{ margin: "0 0 24px", color: "#555e70" }}>{rows.length} total account{rows.length !== 1 ? "s" : ""}.</p>

      {/* Status summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <Chip label="Pending" count={pending} color="#f57f17" bg="#fff8e1" />
        <Chip label="Active" count={active} color="#2e7d32" bg="#e8f5e9" />
        <Chip label="Suspended" count={suspended} color="#b45309" bg="#fef3c7" />
      </div>

      {/* Pending section first */}
      {pending > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600, color: "#f57f17" }}>⏳ Pending approval ({pending})</h2>
          <UserTable rows={rows.filter((r) => r.status === "pending")} />
        </div>
      )}

      {/* All accounts */}
      <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>All accounts</h2>
      <UserTable rows={rows} />
    </div>
  );
}

function UserTable({ rows }: { rows: any[] }) {
  if (rows.length === 0) return (
    <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, padding: 24, color: "#9aa3b5", textAlign: "center", fontSize: 14 }}>
      No accounts.
    </div>
  );

  return (
    <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 700 }}>
        <thead>
          <tr style={{ background: "#f4f5f7", borderBottom: "1px solid #e3e6ec" }}>
            {["Name", "Email", "Company", "Role", "Status", "Registered", "Actions"].map((h) => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#555e70", fontSize: 12 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={String(r._id)} style={{ borderBottom: i < rows.length - 1 ? "1px solid #f0f1f3" : undefined }}>
              <td style={{ padding: "12px 14px", fontWeight: 500 }}>{r.name}</td>
              <td style={{ padding: "12px 14px", color: "#555e70" }}>
                <a href={`mailto:${r.email}`} style={{ color: "#555e70", textDecoration: "none" }}>{r.email}</a>
              </td>
              <td style={{ padding: "12px 14px", color: "#555e70" }}>{r.company || "—"}</td>
              <td style={{ padding: "12px 14px" }}>
                <span style={{ background: r.role === "expert" ? "#ede7f6" : "#e3f2fd", color: r.role === "expert" ? "#4527a0" : "#1565c0", borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
                  {r.role}
                </span>
              </td>
              <td style={{ padding: "12px 14px" }}>
                <StatusBadge status={r.status} />
              </td>
              <td style={{ padding: "12px 14px", color: "#9aa3b5", fontSize: 12, whiteSpace: "nowrap" }}>
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <UserActions userId={String(r._id)} status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    active: { bg: "#e8f5e9", color: "#2e7d32" },
    pending: { bg: "#fff8e1", color: "#f57f17" },
    suspended: { bg: "#fef2f2", color: "#b42318" },
  };
  const s = map[status] ?? { bg: "#f5f5f5", color: "#555e70" };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
      {status}
    </span>
  );
}

function Chip({ label, count, color, bg }: { label: string; count: number; color: string; bg: string }) {
  return (
    <div style={{ background: bg, color, borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
      <span>{label}</span>
      <span style={{ background: color, color: "#fff", borderRadius: 999, padding: "1px 8px", fontSize: 12 }}>{count}</span>
    </div>
  );
}
