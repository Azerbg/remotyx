import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <div className="legal">
      <h1>Privacy Policy</h1>
      <p>[Replace this page with your Privacy Policy, compliant with GDPR and the data protection laws of your markets.]</p>
      <h2>Data we collect</h2>
      <p>When you send a request we store your name, company, work email, country, optional phone number and the details of your request.</p>
      <h2>Why we use it</h2>
      <p>To match you with experts, contact you about your request and send you a confirmation email.</p>
      <h2>Your rights</h2>
      <p>You can ask to access, correct or delete your data at any time by writing to hello@remotyx.com.</p>
    </div>
  );
}
