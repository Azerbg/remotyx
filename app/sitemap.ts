import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://remotyx.com";
  return ["", "/it-support", "/development", "/specialized-services", "/terms", "/privacy"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));
}
