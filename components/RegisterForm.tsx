"use client";

import { useState } from "react";

type Errors = Partial<Record<string, string>>;

const initial = {
  name: "",
  email: "",
  password: "",
  company: "",
  role: "client" as "client" | "expert",
  website: "",
};

export function RegisterForm() {
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
    if (data.password.length < 8) e.password = "Password must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        throw new Error(json.error || "Registration failed.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Registration failed.");
    }
  };

  if (status === "sent") {
    return (
      <div className="done" aria-live="polite">
        <span className="icon-tile">✓</span>
        <h2>Account created</h2>
        <p>Welcome, {data.name.split(" ")[0]}! We'll confirm your account at {data.email} shortly.</p>
      </div>
    );
  }

  return (
    <div className="fields">
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontWeight: 600, fontSize: 14, color: "var(--muted)", marginBottom: 10 }}>I am a</legend>
        <div className="pills">
          <button type="button" aria-pressed={data.role === "client"} onClick={() => set("role", "client")}>
            Client
          </button>
          <button type="button" aria-pressed={data.role === "expert"} onClick={() => set("role", "expert")}>
            Expert / Freelancer
          </button>
        </div>
      </fieldset>

      <label className="field">
        Full name
        <input
          type="text"
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={errors.name ? "true" : undefined}
          autoComplete="name"
          placeholder="Jane Smith"
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
          placeholder="jane@company.com"
        />
        {errors.email && <span className="err">{errors.email}</span>}
      </label>

      <label className="field">
        Password
        <input
          type="password"
          value={data.password}
          onChange={(e) => set("password", e.target.value)}
          aria-invalid={errors.password ? "true" : undefined}
          autoComplete="new-password"
          placeholder="Min. 8 characters"
        />
        {errors.password && <span className="err">{errors.password}</span>}
      </label>

      <label className="field">
        Company <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
        <input
          type="text"
          value={data.company}
          onChange={(e) => set("company", e.target.value)}
          autoComplete="organization"
          placeholder="Acme Inc."
        />
      </label>

      {/* honeypot */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      {status === "error" && <p className="form-error" role="alert">{serverError}</p>}

      <button
        type="button"
        className="btn btn-accent"
        onClick={submit}
        disabled={status === "sending"}
        style={{ width: "100%" }}
      >
        {status === "sending" ? "Creating account…" : "Create my account"}
      </button>

      <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
        Already have an account?{" "}
        <a href="mailto:hello@remotyx.com" style={{ color: "var(--ink)", fontWeight: 500 }}>
          Contact us
        </a>
      </p>
    </div>
  );
}
