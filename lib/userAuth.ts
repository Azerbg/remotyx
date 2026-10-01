export const USER_SESSION_COOKIE = "user_tok";

function secret() {
  return process.env.USER_SECRET ?? process.env.ADMIN_SECRET ?? "remotyx-user-secret";
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

export async function createUserSession(userId: string): Promise<string> {
  const payload = `${userId}:${Date.now().toString(36)}`;
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toB64url(sig)}`;
}

export async function getUserIdFromSession(token: string): Promise<string | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify("HMAC", key, fromB64url(sig), new TextEncoder().encode(payload));
    if (!valid) return null;
    return payload.split(":")[0];
  } catch {
    return null;
  }
}
