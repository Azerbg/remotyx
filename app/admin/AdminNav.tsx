"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/users", label: "Accounts" },
  { href: "/admin/contacts", label: "Messages" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          style={{
            color: pathname === l.href ? "#c8f031" : "#c9cfdb",
            textDecoration: "none",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: pathname === l.href ? 600 : 400,
            background: pathname === l.href ? "rgba(200,240,49,0.08)" : "transparent",
          }}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
