"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(json.error || "Invalid credentials."); return; }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7" }}>
      <div style={{ background: "#fff", border: "1px solid #e3e6ec", borderRadius: 24, padding: 40, width: "100%", maxWidth: 400 }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#0b0d12", marginBottom: 4 }}>
          <span style={{ color: "#c8f031" }}>✦</span> Remotyx
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>Admin login</h1>
        <p style={{ margin: "0 0 28px", color: "#555e70", fontSize: 15 }}>Sign in to access the dashboard.</p>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label className="field">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="field">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error && <p style={{ margin: 0, color: "#b42318", fontSize: 14 }}>{error}</p>}
          <button type="submit" className="btn btn-ink" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
