"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon";
import { LANGUAGES, PLAN_OPTIONS, SERVICE_OPTIONS, TIMEZONES, URGENCY, type ServiceId } from "@/lib/content";

type Errors = Partial<Record<string, string>>;

const initial = {
  service: "support" as ServiceId,
  category: SERVICE_OPTIONS[0].categories[0],
  description: "",
  urgency: "This week" as (typeof URGENCY)[number],
  plan: "Hourly",
  language: "English",
  timezone: TIMEZONES[2] as string,
  name: "",
  company: "",
  email: "",
  country: "",
  phone: "",
  consent: false,
  website: "",
};

export function RequestForm({ inner = false }: { inner?: boolean }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  // Preselect service / plan from the URL (?service=dev&plan=Monthly)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get("service") as ServiceId | null;
    const plan = p.get("plan");
    setData((d) => {
      const next = { ...d };
      const opt = SERVICE_OPTIONS.find((o) => o.id === s);
      if (opt) {
        next.service = opt.id;
        next.category = opt.categories[0];
      }
      if (plan && (PLAN_OPTIONS as readonly string[]).includes(plan)) next.plan = plan;
      return next;
    });
  }, []);

  const service = useMemo(() => SERVICE_OPTIONS.find((o) => o.id === data.service)!, [data.service]);

  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const pickService = (id: ServiceId) => {
    const opt = SERVICE_OPTIONS.find((o) => o.id === id)!;
    setData((d) => ({ ...d, service: id, category: opt.categories[0] }));
  };

  const validate = (s: number): boolean => {
    const e: Errors = {};
    if (s === 1 && data.description.trim().length < 20) e.description = "Please describe your need in at least 20 characters.";
    if (s === 3) {
      if (data.name.trim().length < 2) e.name = "Enter your full name.";
      if (!data.company.trim()) e.company = "Enter your company name.";
      if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) e.email = "Enter a valid email address.";
      if (data.country.trim().length < 2) e.country = "Enter your country.";
      if (!data.consent) e.consent = "Please accept the terms to continue.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!validate(3)) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        throw new Error(json.error || "Your request could not be sent.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Your request could not be sent.");
    }
  };

  const reset = () => {
    setData(initial);
    setStep(1);
    setStatus("idle");
  };

  if (status === "sent") {
    if (inner) return (
      <div className="done" aria-live="polite">
        <span className="icon-tile">
          <Icon name="check" size={28} stroke={2.5} color="#0B0D12" />
        </span>
        <h2>Request sent</h2>
        <p>
          Thanks, {data.name.split(" ")[0]}. A summary is on its way to {data.email}. The first experts will reply
          within 24 hours.
        </p>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          New request
        </button>
      </div>
    );

    return (
      <div id="request" className="form-card" aria-live="polite">
        <div className="done">
          <span className="icon-tile">
            <Icon name="check" size={28} stroke={2.5} color="#0B0D12" />
          </span>
          <h2>Request sent</h2>
          <p>
            Thanks, {data.name.split(" ")[0]}. A summary is on its way to {data.email}. The first experts will reply
            within 24 hours.
          </p>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            New request
          </button>
        </div>
      </div>
    );
  }

  const field = (key: keyof typeof initial, label: string, type = "text", extra: Record<string, string> = {}) => (
    <label className="field">
      {label}
      <input
        type={type}
        value={data[key] as string}
        onChange={(e) => set(key, e.target.value as never)}
        aria-invalid={errors[key] ? "true" : undefined}
        {...extra}
      />
      {errors[key] && <span className="err">{errors[key]}</span>}
    </label>
  );

  const select = (key: keyof typeof initial, label: string, options: readonly string[]) => (
    <label className="field">
      {label}
      <select value={data[key] as string} onChange={(e) => set(key, e.target.value as never)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );

  if (inner) return (
    <div>
      <div className="form-head">
        <h2>Describe your need</h2>
        <span className="form-step">STEP {step} / 3</span>
      </div>
      <div className="progress" aria-hidden="true">
        <span className="on" />
        <span className={step >= 2 ? "on" : ""} />
        <span className={step >= 3 ? "on" : ""} />
      </div>
      {step === 1 && (
        <div className="fields">
          <fieldset>
            <legend>What do you need?</legend>
            <div className="choices">
              {SERVICE_OPTIONS.map((o) => (
                <button key={o.id} type="button" className="choice" aria-pressed={data.service === o.id} onClick={() => pickService(o.id)}>
                  <span className="l"><b>{o.label}</b><small>{o.hint}</small></span>
                  <span className="radio" aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
          {select("category", "Category", service.categories)}
          <label className="field">
            Tell us more
            <textarea rows={3} value={data.description} onChange={(e) => set("description", e.target.value)} placeholder="e.g. Since this morning our computers can't reach the file server." aria-invalid={errors.description ? "true" : undefined} />
            {errors.description && <span className="err">{errors.description}</span>}
          </label>
          <button type="button" className="btn btn-ink" onClick={next}>Continue</button>
        </div>
      )}
      {step === 2 && (
        <div className="fields">
          <fieldset>
            <legend>How urgent is it?</legend>
            <div className="pills">
              {URGENCY.map((u) => (
                <button key={u} type="button" aria-pressed={data.urgency === u} onClick={() => set("urgency", u)}>{u}</button>
              ))}
            </div>
          </fieldset>
          <div className="two">
            {select("language", "Language", LANGUAGES)}
            {select("timezone", "Time zone", TIMEZONES)}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={back}>Back</button>
            <button type="button" className="btn btn-ink grow" onClick={next}>Continue</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="fields">
          <div className="two">
            {field("name", "Full name", "text", { autoComplete: "name" })}
            {field("company", "Company", "text", { autoComplete: "organization" })}
            {field("email", "Work email", "email", { autoComplete: "email" })}
            {field("country", "Country", "text", { autoComplete: "country-name" })}
          </div>
          {field("phone", "Phone / WhatsApp (optional)", "tel", { autoComplete: "tel", placeholder: "+1 …" })}
          <fieldset>
            <legend>Which plan do you need?</legend>
            <div className="choices">
              {([
                { id: "Hourly", label: "Hourly", hint: "From $32 / hour" },
                { id: "Monthly", label: "Monthly", hint: "From $90 / month" },
                { id: "Premium", label: "Premium", hint: "" },
                { id: "Fixed-price project", label: "Fixed-price project", hint: "" },
              ] as const).map((p) => (
                <button key={p.id} type="button" className="choice" aria-pressed={data.plan === p.id} onClick={() => set("plan", p.id)}>
                  <span className="l"><b>{p.label}</b>{p.hint && <small>{p.hint}</small>}</span>
                  <span className="radio" aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
          <div className="hp" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} /></label>
          </div>
          <label className="consent">
            <input type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>I agree to the <a href="/terms">Terms of Service</a> and the <a href="/privacy">Privacy Policy</a>.</span>
          </label>
          {errors.consent && <span className="err" style={{ color: "#b42318", fontSize: 13 }}>{errors.consent}</span>}
          {status === "error" && <p className="form-error" role="alert">{serverError}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={back}>Back</button>
            <button type="button" className="btn btn-ink grow" onClick={submit} disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send my request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div id="request" className="form-card">
      <div>
        <div className="form-head">
          <h2>Describe your need</h2>
          <span className="form-step">STEP {step} / 3</span>
        </div>
        <div className="progress" aria-hidden="true">
          <span className="on" />
          <span className={step >= 2 ? "on" : ""} />
          <span className={step >= 3 ? "on" : ""} />
        </div>
      </div>

      {step === 1 && (
        <div className="fields">
          <fieldset>
            <legend>What do you need?</legend>
            <div className="choices">
              {SERVICE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="choice"
                  aria-pressed={data.service === o.id}
                  onClick={() => pickService(o.id)}
                >
                  <span className="l">
                    <b>{o.label}</b>
                    <small>{o.hint}</small>
                  </span>
                  <span className="radio" aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
          {select("category", "Category", service.categories)}
          <label className="field">
            Tell us more
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Since this morning our computers can't reach the file server."
              aria-invalid={errors.description ? "true" : undefined}
            />
            {errors.description && <span className="err">{errors.description}</span>}
          </label>
          <button type="button" className="btn btn-ink" onClick={next}>
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="fields">
          <fieldset>
            <legend>How urgent is it?</legend>
            <div className="pills">
              {URGENCY.map((u) => (
                <button key={u} type="button" aria-pressed={data.urgency === u} onClick={() => set("urgency", u)}>
                  {u}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="two">
            {select("language", "Language", LANGUAGES)}
            {select("timezone", "Time zone", TIMEZONES)}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={back}>
              Back
            </button>
            <button type="button" className="btn btn-ink grow" onClick={next}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fields">
          <div className="two">
            {field("name", "Full name", "text", { autoComplete: "name" })}
            {field("company", "Company", "text", { autoComplete: "organization" })}
            {field("email", "Work email", "email", { autoComplete: "email" })}
            {field("country", "Country", "text", { autoComplete: "country-name" })}
          </div>
          {field("phone", "Phone / WhatsApp (optional)", "tel", { autoComplete: "tel", placeholder: "+1 …" })}
          <fieldset>
            <legend>Which plan do you need?</legend>
            <div className="choices">
              {(
                [
                  { id: "Hourly", label: "Hourly", hint: "From $32 / hour" },
                  { id: "Monthly", label: "Monthly", hint: "From $90 / month" },
                  { id: "Premium", label: "Premium", hint: "" },
                  { id: "Fixed-price project", label: "Fixed-price project", hint: "" },
                ] as const
              ).map((p) => (
                <button key={p.id} type="button" className="choice" aria-pressed={data.plan === p.id} onClick={() => set("plan", p.id)}>
                  <span className="l">
                    <b>{p.label}</b>
                    {p.hint && <small>{p.hint}</small>}
                  </span>
                  <span className="radio" aria-hidden="true" />
                </button>
              ))}
            </div>
          </fieldset>
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
            </label>
          </div>
          <label className="consent">
            <input type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>
              I agree to the <a href="/terms">Terms of Service</a> and the <a href="/privacy">Privacy Policy</a>.
            </span>
          </label>
          {errors.consent && <span className="err" style={{ color: "#b42318", fontSize: 13 }}>{errors.consent}</span>}
          {status === "error" && <p className="form-error" role="alert">{serverError}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={back}>
              Back
            </button>
            <button type="button" className="btn btn-ink grow" onClick={submit} disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send my request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
