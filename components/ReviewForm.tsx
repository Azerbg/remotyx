"use client";

import { useState } from "react";

const SERVICES = ["IT Support", "Custom Development", "Specialized Services", "Other"];
type Errors = Partial<Record<string, string>>;

const initial = { name: "", company: "", service: "", rating: 5, message: "", website: "" };

export function ReviewForm() {
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (data.name.trim().length < 2) e.name = "Enter your name.";
    if (data.message.trim().length < 10) e.message = "Please write at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setStatus("sending");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (json.fieldErrors) setErrors(json.fieldErrors);
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⭐</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Thank you!</h3>
        <p style={{ margin: 0, color: "var(--muted)" }}>Your review has been submitted and will appear once approved.</p>
      </div>
    );
  }

  return (
    <div className="fields">
      {/* Star rating */}
      <div>
        <label style={{ fontSize: 14, fontWeight: 500, display: "block", marginBottom: 8 }}>Your rating</label>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => set("rating", star)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 28, lineHeight: 1, color: star <= data.rating ? "#f59e0b" : "#d1d5db", padding: 0 }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="two">
        <label className="field">
          Full name
          <input type="text" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" aria-invalid={errors.name ? "true" : undefined} />
          {errors.name && <span className="err">{errors.name}</span>}
        </label>
        <label className="field">
          Company <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
          <input type="text" value={data.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Inc." />
        </label>
      </div>

      <label className="field">
        Service used <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
        <select value={data.service} onChange={(e) => set("service", e.target.value)}>
          <option value="">Select a service…</option>
          {SERVICES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>

      <label className="field">
        Your review
        <textarea
          rows={4}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Share your experience with Remotyx…"
          aria-invalid={errors.message ? "true" : undefined}
        />
        {errors.message && <span className="err">{errors.message}</span>}
      </label>

      {/* honeypot */}
      <div className="hp" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} /></label>
      </div>

      {status === "error" && <p className="form-error" role="alert">Something went wrong. Please try again.</p>}

      <button type="button" className="btn btn-ink" onClick={submit} disabled={status === "sending"} style={{ alignSelf: "flex-start" }}>
        {status === "sending" ? "Submitting…" : "Submit review"}
      </button>
    </div>
  );
}
