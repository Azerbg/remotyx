import { getDb } from "@/lib/mongodb";
import { ReviewActions } from "./ReviewActions";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const db = await getDb();
  const rows = await db.collection("reviews").find({}).sort({ createdAt: -1 }).toArray();

  const pending = rows.filter((r) => r.status === "pending").length;

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700 }}>Reviews</h1>
      <p style={{ margin: "0 0 28px", color: "#555e70" }}>{rows.length} total · {pending} pending approval.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, padding: 32, color: "#9aa3b5", textAlign: "center" }}>No reviews yet.</div>
        )}
        {rows.map((r) => (
          <div key={String(r._id)} style={{ background: "#fff", border: `1px solid ${r.status === "pending" ? "#fcd34d" : "#e3e6ec"}`, borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                {r.company && <span style={{ color: "#555e70", fontSize: 14 }}>{r.company}</span>}
                {r.service && <span style={{ background: "#f4f5f7", borderRadius: 999, padding: "2px 10px", fontSize: 12, color: "#555e70" }}>{r.service}</span>}
                <span style={{ color: "#f59e0b", fontSize: 14 }}>{"★".repeat(r.rating)}</span>
                <StatusBadge status={r.status} />
              </div>
              <span style={{ color: "#9aa3b5", fontSize: 13 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</span>
            </div>
            <p style={{ margin: "0 0 14px", color: "#555e70", fontSize: 14, lineHeight: 1.6 }}>"{r.message}"</p>
            <ReviewActions reviewId={String(r._id)} status={r.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    approved: { bg: "#e8f5e9", color: "#2e7d32" },
    pending: { bg: "#fff8e1", color: "#f57f17" },
    rejected: { bg: "#fef2f2", color: "#b42318" },
  };
  const s = map[status] ?? { bg: "#f5f5f5", color: "#555e70" };
  return <span style={{ ...s, borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{status}</span>;
}
