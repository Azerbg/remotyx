import Link from "next/link";
import { Check, Icon } from "@/components/Icon";
import { HeroCard } from "@/components/HeroCard";
import { FaqSection, Plans, Ticker } from "@/components/Sections";
import { HOME_FAQ, SUPPORT_PLANS } from "@/lib/content";

const SERVICES = [
  { n: 1, icon: "headset", title: "IT Support", items: ["Remote troubleshooting, computers and software", "Microsoft 365 and Google Workspace", "Network, VPN and backups"], href: "/it-support", cta: "Explore IT Support", dark: true },
  { n: 2, icon: "code", title: "Custom Development", items: ["Websites and mobile apps", "ERP, CRM and business tools", "Automation and API integrations"], href: "/development", cta: "Explore Development" },
  { n: 3, icon: "shield", title: "Specialized Services", items: ["Cybersecurity and audits", "Cloud and migration", "Digital transformation and training"], href: "/specialized-services", cta: "Explore Specialized" },
];

export default function Home() {
  return (
    <>
      <section className="dark dots">
        <div className="container hero">
          <div className="hero-copy">
            <span className="pill">
              <span className="dot" />
              Experts online now · 100% remote
            </span>
            <h1 className="h1">
              IT support and developers, <span className="hl">on demand.</span>
            </h1>
            <p className="sub">
              Describe your need in 2 minutes. Vetted technicians and developers fix, build and secure your IT remotely,
              in your language and time zone.
            </p>
            <div className="btn-row">
              <a href="/?tab=register#request" className="btn btn-accent">
                Start for free
                <Icon name="arrow" size={18} stroke={2} />
              </a>
              <a href="#request" className="btn btn-ghost-dark">
                Send a request
              </a>
            </div>
            <div className="proof">
              <div><span className="k">VETTED</span><span className="v">Identity and skills checked</span></div>
              <div><span className="k">ESCROW</span><span className="v">Pay only after approval</span></div>
              <div><span className="k">&lt; 24 H</span><span className="v">First proposals</span></div>
            </div>
          </div>
          <HeroCard />
        </div>
      </section>

      <Ticker />

      <section id="services" className="light">
        <div className="container section">
          <div className="head-row">
            <div className="head-col">
              <span className="eyebrow">/ SERVICES</span>
              <h2 className="h2">
                Everything IT.
                <br />
                One place, fully remote.
              </h2>
            </div>
            <p className="lead">
              From an urgent ticket to a custom platform: video calls, secure remote access and live tracking in your
              dashboard.
            </p>
          </div>
          <div className="grid-auto">
            {SERVICES.map((s) => (
              <article key={s.title} className={`card svc-card${s.dark ? " is-dark" : ""}`}>
                <div className="top">
                  <span className="tile"><Icon name={s.icon} size={26} color="#0B0D12" /></span>
                  <span className="num">0{s.n}</span>
                </div>
                <h3>{s.title}</h3>
                <ul className="check-list">
                  {s.items.map((i) => (
                    <li key={i}><Check dark={!s.dark} />{i}</li>
                  ))}
                </ul>
                <Link href={s.href} className={`btn ${s.dark ? "btn-accent" : "btn-soft"}`} style={{ justifyContent: "space-between" }}>
                  {s.cta}
                  <Icon name="arrow" size={18} stroke={2} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

<Plans
        id="pricing"
        title="Support plans that fit."
        sub="Pay by the hour, subscribe monthly, or go Premium for unlimited support. Fully remote."
        plans={SUPPORT_PLANS}
        href="/#request"
      />

      <FaqSection items={HOME_FAQ} />
    </>
  );
}
