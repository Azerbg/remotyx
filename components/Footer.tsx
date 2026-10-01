import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container inner">
        <div className="footer-cols">
          <div className="col">
            <Logo />
            <p>Remote IT support, developers and IT experts for companies everywhere.</p>
          </div>
          <div className="col">
            <span className="eyebrow">SERVICES</span>
            <Link href="/it-support">IT Support</Link>
            <Link href="/development">Development</Link>
            <Link href="/specialized-services">Specialized Services</Link>
          </div>
          <div className="col">
            <span className="eyebrow">COMPANY</span>
            <Link href="/#join">Become an expert</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="col">
            <span className="eyebrow">LEGAL</span>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Remotyx</span>
          <span>100% remote · EN / FR / AR</span>
        </div>
      </div>
    </footer>
  );
}
