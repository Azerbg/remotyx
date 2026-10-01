"use client";

import { useEffect, useState } from "react";
import { RequestForm } from "./RequestForm";
import { RegisterForm } from "./RegisterForm";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export function HeroCard() {
  const [tab, setTab] = useState<"request" | "register">("request");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const userName = getCookie("user_name");
    setLoggedIn(!!userName);
    const p = new URLSearchParams(window.location.search);
    if (p.get("tab") === "register" && !userName) setTab("register");
  }, []);

  return (
    <div id="request" className="form-card">
      {/* Only show tabs when not logged in */}
      {!loggedIn && (
        <div className="hero-tabs">
          <button type="button" className={`hero-tab${tab === "request" ? " active" : ""}`} onClick={() => setTab("request")}>
            Send a request
          </button>
          <button type="button" className={`hero-tab${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>
            Create account
          </button>
        </div>
      )}

      {tab === "request" || loggedIn ? <RequestForm inner /> : <RegisterForm />}

      <style>{`
        .hero-tabs { display: flex; gap: 4px; background: var(--light); border-radius: 999px; padding: 4px; margin-bottom: 16px; }
        .hero-tab { flex: 1; padding: 10px 16px; border-radius: 999px; border: none; background: transparent; font-weight: 500; font-size: 15px; cursor: pointer; color: var(--muted); transition: background .15s, color .15s; }
        .hero-tab.active { background: var(--ink); color: #fff; }
      `}</style>
    </div>
  );
}
