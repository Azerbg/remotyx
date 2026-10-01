"use client";

import { useEffect, useRef, useState } from "react";

type Message = { _id: string; from: string; text: string; createdAt: string };

export function AdminDiscussion({ requestId }: { requestId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch(`/api/admin/messages?requestId=${requestId}`);
    if (res.ok) setMessages((await res.json()).messages);
  };

  useEffect(() => { if (open) load(); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, text }),
    });
    if (res.ok) { setText(""); await load(); }
    setSending(false);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ fontSize: 13, color: "#555e70", background: "none", border: "1px solid #e3e6ec", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}
      >
        💬 {open ? "Hide" : "Reply to client"} {messages.length > 0 ? `(${messages.length})` : ""}
      </button>

      {open && (
        <div style={{ marginTop: 12, background: "#f9fafb", borderRadius: 12, padding: 16 }}>
          <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {messages.length === 0 && <p style={{ margin: 0, color: "#9aa3b5", fontSize: 13, textAlign: "center" }}>No messages yet.</p>}
            {messages.map((m) => (
              <div key={m._id} style={{ alignSelf: m.from === "admin" ? "flex-end" : "flex-start", maxWidth: "80%", background: m.from === "admin" ? "#0b0d12" : "#fff", color: m.from === "admin" ? "#fff" : "#0b0d12", borderRadius: 10, padding: "8px 12px", fontSize: 13 }}>
                <div>{m.text}</div>
                <div style={{ fontSize: 11, opacity: 0.5, marginTop: 3 }}>{m.from === "admin" ? "You" : "Client"}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Reply…" style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #e3e6ec", fontSize: 13 }} />
            <button onClick={send} disabled={sending || !text.trim()} style={{ background: "#0b0d12", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
              {sending ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
