import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <div className="legal">
      <h1>Terms of Service</h1>
      <p>[Replace this page with your Terms of Service, reviewed by a lawyer before launch.]</p>
      <h2>Services</h2>
      <p>[Describe the platform, the role of Remotyx as an intermediary, and the obligations of clients and experts.]</p>
      <h2>Payments and escrow</h2>
      <p>[Describe how payments are held, released, refunded, and the applicable fees.]</p>
      <h2>Disputes</h2>
      <p>[Describe the mediation process and applicable law.]</p>
    </div>
  );
}
