import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Remotyx team for any question or request.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section dark dots">
        <div className="container">
          <div className="head-col" style={{ maxWidth: 640 }}>
            <span className="eyebrow">CONTACT</span>
            <h1 className="h2">Get in touch</h1>
            <p className="lead">
              A question, a partnership idea, or a special demand? We reply within one business day.
            </p>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="container">
          <div className="contact-layout">
            {/* Left: quick links */}
            <div className="contact-sidebar">
              <div className="contact-card">
                <span className="eyebrow">GENERAL INQUIRIES</span>
                <p>Questions about our services, pricing or how Remotyx works.</p>
                <a href="mailto:hello@remotyx.com" className="btn btn-ink">hello@remotyx.com</a>
              </div>
              <div className="contact-card">
                <span className="eyebrow">BECOME AN EXPERT</span>
                <p>Are you an IT professional or developer? Join our network of remote experts.</p>
                <a href="mailto:experts@remotyx.com" className="btn btn-ink">experts@remotyx.com</a>
              </div>
              <div className="contact-card">
                <span className="eyebrow">SUBMIT A REQUEST</span>
                <p>Ready to get started? Describe your need and we'll match you with the right expert.</p>
                <Link href="/#request" className="btn btn-accent">Start a request</Link>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="contact-form-col">
              <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 700 }}>Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: 32px;
          align-items: start;
        }
        .contact-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .contact-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
          font-size: 15px;
        }
        .contact-card .btn {
          align-self: flex-start;
        }
        .contact-form-col {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 36px;
        }
        .contact-form-wrap .fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </>
  );
}
