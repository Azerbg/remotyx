import Link from "next/link";
import { Check, Icon } from "./Icon";
import { CtaBand, FaqSection, Plans, Steps, Ticker } from "./Sections";
import type { ServicePageData } from "@/lib/content";

export function ServicePage({ p }: { p: ServicePageData }) {
  const requestHref = `/?service=${p.id}#request`;
  return (
    <>
      <section className="dark dots">
        <div className="container hero" style={{ paddingTop: 72, paddingBottom: 104 }}>
          <div className="hero-copy">
            <nav aria-label="Breadcrumb" className="crumb">
              <Link href="/">HOME</Link> <span aria-hidden="true">/</span> <span className="cur">{p.crumb}</span>
            </nav>
            <h1 className="h1" style={{ fontSize: "clamp(42px, 5.8vw, 68px)" }}>
              {p.h1a} <span className="hl">{p.h1b}</span>
            </h1>
            <p className="sub">{p.sub}</p>
            <div className="btn-row">
              <Link href={requestHref} className="btn btn-accent">
                {p.cta}
                <Icon name="arrow" size={18} stroke={2} />
              </Link>
              <a href="#plans" className="btn btn-ghost-dark">See plans</a>
            </div>
          </div>
          <div className="get-card">
            <div className="row">
              <span className="icon-tile"><Icon name={p.icon} size={28} color="#0B0D12" /></span>
              <span className="eyebrow">WHAT YOU GET</span>
            </div>
            <ul className="check-list">
              {p.highlights.map((h) => (
                <li key={h}><Check />{h}</li>
              ))}
            </ul>
            <div className="tags">
              <span>VETTED EXPERTS</span>
              <span>ESCROW PAYMENT</span>
              <span>EN / FR / AR</span>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="light">
        <div className="container" style={{ paddingTop: 112, paddingBottom: 0 }}>
          <div className="head-row">
            <div className="head-col">
              <span className="eyebrow">/ {p.offersEyebrow}</span>
              <h2 className="h2">{p.offersTitle}</h2>
            </div>
          </div>
          <div className="grid-auto">
            {p.offers.map((o, i) => (
              <article key={o.title} className="card offer">
                <div className="top">
                  <span className="tile"><Icon name={o.icon} color="#0B0D12" /></span>
                  <span className="num">0{i + 1}</span>
                </div>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Steps steps={p.steps} />
      <Plans id="plans" title={p.plansTitle} sub={p.plansSub} plans={p.plans} href={requestHref} />
      <FaqSection items={p.faq} />
      <CtaBand title={p.band} href={requestHref} label="Describe your need" />
    </>
  );
}
