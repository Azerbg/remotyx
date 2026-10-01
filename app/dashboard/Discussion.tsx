"use client";

import { useEffect, useRef, useState } from "react";

type Message = { _id: string; from: string; text: string; createdAt: string };

export function Discussion({ requestId }: { requestId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch(`/api/messages?requestId=${requestId}`);
    if (res.ok) {
      const json = await res.json();
      setMessages(json.messages);
      // Mark messages as read
      fetch("/api/messages/unread", { method: "POST" }).catch(() => {});
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, text }),
    });
    if (res.ok) {
      setText("");
      await load();
    }
    setSending(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", padding: "14px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, color: "var(--muted)", fontWeight: 500 }}
      >
        <span>💬 Discussion {messages.length > 0 ? `(${messages.length})` : ""}</span>
        <span style={{ fontSize: 12 }}>{open ? "▲ Hide" : "▼ Open"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 24px 20px" }}>
          {/* Messages */}
          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, paddingRight: 4 }}>
            {messages.length === 0 && (
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
                No messages yet. Send a message to start the discussion.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m._id}
                style={{
                  alignSelf: m.from === "client" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background: m.from === "client" ? "var(--ink)" : "#f0f1f3",
                  color: m.from === "client" ? "#fff" : "var(--ink)",
                  borderRadius: m.from === "client" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "10px 14px",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                <div>{m.text}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4, textAlign: "right" }}>
                  {m.from === "admin" ? "Remotyx" : "You"} · {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Type a message…"
              style={{ flex: 1, padding: "10px 14px", borderRadius: 999, border: "1px solid var(--line)", fontSize: 14, outline: "none" }}
            />
            <button
              type="button"
              onClick={send}
              disabled={sending || !text.trim()}
              className="btn btn-ink"
              style={{ padding: "10px 20px", minHeight: "unset", fontSize: 14 }}
            >
              {sending ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
