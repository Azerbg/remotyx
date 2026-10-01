import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { headers } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://remotyx.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Remotyx — Remote IT support and developers, on demand", template: "%s | Remotyx" },
  description:
    "Describe your need in 2 minutes. Vetted technicians and developers fix, build and secure your IT remotely, in your language and time zone.",
  openGraph: { type: "website", siteName: "Remotyx", url: siteUrl },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const isAdmin = h.get("x-is-admin") === "1";

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {!isAdmin && <Header />}
        {isAdmin ? children : <main>{children}</main>}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
