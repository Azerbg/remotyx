"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "pending" | "active" | "suspended";

export function UserActions({ userId, status }: { userId: string; status: Status }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const update = async (newStatus: Status) => {
    setLoading(newStatus);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(null);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Delete this account permanently?")) return;
    setLoading("delete");
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setLoading(null);
    router.refresh();
  };

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {status === "pending" && (
        <Btn onClick={() => update("active")} loading={loading === "active"} color="#2e7d32" bg="#e8f5e9">
          ✓ Approve
        </Btn>
      )}
      {status === "active" && (
        <Btn onClick={() => update("suspended")} loading={loading === "suspended"} color="#b45309" bg="#fff8e1">
          Suspend
        </Btn>
      )}
      {status === "suspended" && (
        <Btn onClick={() => update("active")} loading={loading === "active"} color="#1565c0" bg="#e3f2fd">
          Reactivate
        </Btn>
      )}
      <Btn onClick={remove} loading={loading === "delete"} color="#b42318" bg="#fef2f2">
        Delete
      </Btn>
    </div>
  );
}

function Btn({ onClick, loading, color, bg, children }: { onClick: () => void; loading: boolean; color: string; bg: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{ background: bg, color, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
    >
      {loading ? "…" : children}
    </button>
  );
}
