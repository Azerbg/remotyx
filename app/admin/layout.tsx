import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  const isAuth = await verifySession(token);

  // Login page — render without sidebar
  if (!isAuth) return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <aside style={{ width: 220, background: "#0b0d12", color: "#f4f5f7", display: "flex", flexDirection: "column", padding: "28px 16px 24px", gap: 8, flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20, paddingLeft: 14 }}>
          <span style={{ color: "#c8f031" }}>✦</span> Remotyx
        </div>
        <AdminNav />
        <form action="/api/admin/logout" method="POST" style={{ marginTop: "auto" }}>
          <button
            type="submit"
            style={{ background: "transparent", border: "1px solid #252a35", color: "#9aa3b5", borderRadius: 8, padding: "9px 14px", cursor: "pointer", width: "100%", fontSize: 14 }}
          >
            Logout
          </button>
        </form>
      </aside>
      <main style={{ flex: 1, padding: "40px 48px", background: "#f4f5f7", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
