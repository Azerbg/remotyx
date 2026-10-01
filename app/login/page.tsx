"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(json.error || "Invalid credentials."); return; }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dark dots" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", color: "#0b0d12", border: "1px solid #e3e6ec", borderRadius: 28, padding: "48px 40px", width: "100%", maxWidth: 420, margin: "0 24px" }}>
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700 }}>Sign in</h1>
        <p style={{ margin: "0 0 32px", color: "#555e70", fontSize: 15 }}>
          No account yet?{" "}
          <Link href="/?tab=register#request" style={{ color: "#0b0d12", fontWeight: 600 }}>
            Create one for free
          </Link>
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <label className="field">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="jane@company.com"
            />
          </label>
          <label className="field">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Your password"
            />
          </label>

          {error && <p style={{ margin: 0, color: "#b42318", fontSize: 14 }}>{error}</p>}

          <button
            type="submit"
            className="btn btn-ink"
            disabled={loading}
            style={{ width: "100%", marginTop: 4 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
