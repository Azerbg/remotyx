import type { Metadata } from "next";
import { getDb } from "@/lib/mongodb";
import { ReviewForm } from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What our clients say about Remotyx.",
};

export const dynamic = "force-dynamic";

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 16, letterSpacing: 2 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export default async function ReviewsPage() {
  const db = await getDb();
  const reviews = await db.collection("reviews").find({ status: "approved" }).sort({ createdAt: -1 }).toArray();

  return (
    <>
      <section className="section dark dots">
        <div className="container">
          <div className="head-col" style={{ maxWidth: 600 }}>
            <span className="eyebrow">REVIEWS</span>
            <h1 className="h2">What our clients say</h1>
            <p className="lead">Real feedback from businesses we've helped remotely.</p>
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="container">
          {reviews.length === 0 ? (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "40px 0" }}>No reviews yet — be the first!</p>
          ) : (
            <div className="grid-auto" style={{ marginBottom: 64 }}>
              {reviews.map((r) => (
                <div key={String(r._id)} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                  <Stars rating={r.rating} />
                  <p style={{ margin: 0, color: "var(--ink)", lineHeight: 1.65, fontSize: 15 }}>"{r.message}"</p>
                  <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                    {(r.company || r.service) && (
                      <div style={{ color: "var(--muted)", fontSize: 13 }}>{[r.company, r.service].filter(Boolean).join(" · ")}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit a review */}
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>Leave a review</h2>
            <p style={{ margin: "0 0 28px", color: "var(--muted)" }}>Your review will appear after a quick moderation.</p>
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
