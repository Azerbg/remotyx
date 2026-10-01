import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";
import { getUserIdFromSession, USER_SESSION_COOKIE } from "@/lib/userAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value ?? "";
    const isAuth = await verifySession(token);
    const res = NextResponse.next();
    res.headers.set("x-is-admin", "1");

    if (pathname === "/admin/login") {
      if (isAuth) return NextResponse.redirect(new URL("/admin", req.url));
      return res;
    }
    if (!isAuth) return NextResponse.redirect(new URL("/admin/login", req.url));
    return res;
  }

  // ── Client dashboard ──────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(USER_SESSION_COOKIE)?.value ?? "";
    const userId = await getUserIdFromSession(token);
    if (!userId) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
