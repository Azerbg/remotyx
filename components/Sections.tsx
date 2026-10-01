import Link from "next/link";
import { Check, Icon } from "./Icon";
import type { Plan, Step, Faq } from "@/lib/content";

export function Ticker() {
  const items = ["VIDEO CALLS", "SECURE REMOTE ACCESS", "ESCROW PAYMENTS", "EN / FR / AR", "EVERY TIME ZONE", "VETTED EXPERTS"];
  return (
    <div className="ticker">
      <div className="container inner">
        {items.map((t, i) => (
          <span key={t} style={{ display: "inline-flex", gap: 28 }}>
            {i > 0 && <span className="star" aria-hidden="true">✦</span>}
            <span>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Steps({ steps, title = "How it works" }: { steps: Step[]; title?: string }) {
  return (
    <section id="how" className="light">
      <div className="container section">
        <div className="head-row">
          <div className="head-col">
            <span className="eyebrow">/ PROCESS</span>
            <h2 className="h2">{title}</h2>
          </div>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="badge">STEP 0{i + 1}</span>
              <span className="t">{s.title}</span>
              <span className="d">{s.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Plans({
  id,
  title,
  sub,
  plans,
  href,
}: {
  id: string;
  title: string;
  sub: string;
  plans: Plan[];
  href: string;
}) {
  return (
    <section id={id} className="dark dots">
      <div className="container section">
        <div className="head-row">
          <div className="head-col">
            <span className="eyebrow">/ PLANS</span>
            <h2 className="h2">{title}</h2>
          </div>
          <p className="lead">{sub}</p>
        </div>
        <div className="grid-auto">
          {plans.map((p) => (
            <article key={p.name} className={`plan${p.main ? " is-main" : ""}`}>
              <div className="top">
                <h3>{p.name}</h3>
                {p.main && <span className="badge">MOST POPULAR</span>}
              </div>
              {p.price && (
                <div className="price">
                  {p.price}
                  <span className="unit"> {p.unit}</span>
                </div>
              )}
              <p className="desc">{p.desc}</p>
              <ul className="check-list">
                {p.features.map((f) => (
                  <li key={f}>
                    <Check dark={p.main} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href ?? href} className={`btn ${p.main ? "btn-ink" : "btn-accent"}`}>
                {p.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ items, title = "Questions, answered." }: { items: Faq[]; title?: string }) {
  return (
    <section id="faq" className="light">
      <div className="container section faq-grid">
        <div className="head-col">
          <span className="eyebrow">/ FAQ</span>
          <h2 className="h2">{title}</h2>
          <p className="lead">
            Something else on your mind?{" "}
            <a href="mailto:hello@remotyx.com" style={{ color: "#0B0D12", fontWeight: 600 }}>
              Contact us
            </a>
            .
          </p>
        </div>
        <div className="faq-list">
          {items.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <span className="plus" aria-hidden="true">
                  <Icon name="plus" size={16} stroke={2.25} color="#0B0D12" />
                </span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <section className="light">
      <div className="container" style={{ paddingBottom: 112 }}>
        <div className="banner is-accent">
          <div className="copy">
            <h2>{title}</h2>
            <p>Describe your need in 2 minutes and receive your first proposals within 24 hours.</p>
          </div>
          <Link href={href} className="btn btn-ink">
            {label}
            <Icon name="arrow" size={18} stroke={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
