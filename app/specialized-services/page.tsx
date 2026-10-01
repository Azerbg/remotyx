import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SERVICE_PAGES } from "@/lib/content";

const p = SERVICE_PAGES["specialized-services"];

export const metadata: Metadata = {
  title: p.metaTitle,
  description: p.metaDescription,
};

export default function Page() {
  return <ServicePage p={p} />;
}
