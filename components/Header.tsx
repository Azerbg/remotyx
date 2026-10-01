"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/it-support", label: "IT Support" },
  { href: "/development", label: "Development" },
  { href: "/specialized-services", label: "Specialized" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export function Header() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const name = getCookie("user_name");
    setUserName(name);
    if (name) {
      fetch("/api/messages/unread")
        .then((r) => r.json())
        .then((j) => setUnread(j.count ?? 0))
        .catch(() => {});
    }
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="container inner">
        <Logo />
        <nav className="nav" aria-label="Main navigation">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {userName ? (
            <>
              {/* Inbox icon with unread badge */}
              <Link href="/dashboard" aria-label="Messages" style={{ position: "relative", display: "inline-flex", alignItems: "center", padding: "8px 10px", color: "#c9cfdb", textDecoration: "none" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {unread > 0 && (
                  <span style={{ position: "absolute", top: 4, right: 4, background: "#c8f031", color: "#0b0d12", borderRadius: 999, fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                    {unread}
                  </span>
                )}
              </Link>
              <Link href="/dashboard" className="btn btn-accent">
                {userName.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="login">
                Sign in
              </Link>
              <Link href="/?tab=register#request" className="btn btn-accent">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
