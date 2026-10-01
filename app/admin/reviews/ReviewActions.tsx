"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewActions({ reviewId, status }: { reviewId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const update = async (newStatus: string) => {
    setLoading(newStatus);
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(null);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Delete this review?")) return;
    setLoading("delete");
    await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {status !== "approved" && (
        <Btn onClick={() => update("approved")} loading={loading === "approved"} color="#2e7d32" bg="#e8f5e9">✓ Approve</Btn>
      )}
      {status !== "rejected" && (
        <Btn onClick={() => update("rejected")} loading={loading === "rejected"} color="#b42318" bg="#fef2f2">Reject</Btn>
      )}
      <Btn onClick={remove} loading={loading === "delete"} color="#555e70" bg="#f4f5f7">Delete</Btn>
    </div>
  );
}

function Btn({ onClick, loading, color, bg, children }: { onClick: () => void; loading: boolean; color: string; bg: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} style={{ background: bg, color, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
      {loading ? "…" : children}
    </button>
  );
}
