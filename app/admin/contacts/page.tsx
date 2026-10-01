import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function AdminContacts() {
  const db = await getDb();
  const rows = await db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray();

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700 }}>Messages</h1>
      <p style={{ margin: "0 0 28px", color: "#555e70" }}>{rows.length} contact message{rows.length !== 1 ? "s" : ""}.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, padding: 32, color: "#9aa3b5", textAlign: "center" }}>
            No messages yet.
          </div>
        )}
        {rows.map((r) => (
          <div key={String(r._id)} style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                <a href={`mailto:${r.email}`} style={{ color: "#555e70", fontSize: 14 }}>{r.email}</a>
                <span style={{ background: "#f4f5f7", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 500, color: "#555e70" }}>{r.type}</span>
              </div>
              <span style={{ color: "#9aa3b5", fontSize: 13, whiteSpace: "nowrap" }}>
                {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
              </span>
            </div>
            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{r.subject}</div>
            <p style={{ margin: 0, color: "#555e70", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
