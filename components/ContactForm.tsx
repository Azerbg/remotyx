"use client";

import { useState } from "react";

const TYPES = ["Message", "Request", "Special demand"] as const;
type ContactType = (typeof TYPES)[number];

type Errors = Partial<Record<string, string>>;

const initial = {
  name: "",
  email: "",
  type: "Message" as ContactType,
  subject: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (data.name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) e.email = "Enter a valid email address.";
    if (data.subject.trim().length < 2) e.subject = "Enter a subject.";
    if (data.message.trim().length < 10) e.message = "Please write at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        throw new Error(json.error || "Your message could not be sent.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Your message could not be sent.");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-form-wrap" aria-live="polite">
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <h3 style={{ margin: "0 0 8px" }}>Message sent!</h3>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Thanks, {data.name.split(" ")[0]}. We'll get back to you within one business day.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: 24 }}
            onClick={() => { setData(initial); setStatus("idle"); }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-wrap">
      <div className="fields">
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>Type of message</legend>
          <div className="pills">
            {TYPES.map((t) => (
              <button key={t} type="button" aria-pressed={data.type === t} onClick={() => set("type", t)}>
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="two">
          <label className="field">
            Full name
            <input
              type="text"
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={errors.name ? "true" : undefined}
              autoComplete="name"
            />
            {errors.name && <span className="err">{errors.name}</span>}
          </label>
          <label className="field">
            Email
            <input
              type="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={errors.email ? "true" : undefined}
              autoComplete="email"
            />
            {errors.email && <span className="err">{errors.email}</span>}
          </label>
        </div>

        <label className="field">
          Subject
          <input
            type="text"
            value={data.subject}
            onChange={(e) => set("subject", e.target.value)}
            aria-invalid={errors.subject ? "true" : undefined}
            placeholder="e.g. Question about monthly plan"
          />
          {errors.subject && <span className="err">{errors.subject}</span>}
        </label>

        <label className="field">
          Your message
          <textarea
            rows={5}
            value={data.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={errors.message ? "true" : undefined}
            placeholder="Describe your question, request or special demand…"
          />
          {errors.message && <span className="err">{errors.message}</span>}
        </label>

        {/* honeypot */}
        <div className="hp" aria-hidden="true">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
          </label>
        </div>

        {status === "error" && (
          <p className="form-error" role="alert">{serverError}</p>
        )}

        <button
          type="button"
          className="btn btn-ink"
          onClick={submit}
          disabled={status === "sending"}
          style={{ alignSelf: "flex-start" }}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </div>
  );
}
