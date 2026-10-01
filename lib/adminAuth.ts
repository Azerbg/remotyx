export const SESSION_COOKIE = "admin_tok";

function secret() {
  return process.env.ADMIN_SECRET ?? "remotyx-change-me-in-production";
}

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toB64url(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromB64url(s: string) {
  return Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
}

export async function createSession(): Promise<string> {
  const payload = Date.now().toString(36);
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toB64url(sig)}`;
}

export async function verifySession(token: string): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const key = await getKey();
    return await crypto.subtle.verify("HMAC", key, fromB64url(sig), new TextEncoder().encode(payload));
  } catch {
    return false;
  }
}
