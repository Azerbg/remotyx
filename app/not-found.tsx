import Link from "next/link";

export default function NotFound() {
  return (
    <div className="legal">
      <h1>Page not found</h1>
      <p>This page doesn&apos;t exist or was moved.</p>
      <Link href="/" className="btn btn-ink">Back to home</Link>
    </div>
  );
}
