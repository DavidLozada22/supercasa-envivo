import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "sc_admin";
const SESSION_HOURS = 12;

export type Session = {
  username: string;
};

function secret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-secret-supercasa-envivo"
  );
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionValue(username: string): string {
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  const clean = username.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  const payload = `${expires}.${clean}`;
  return `${payload}.${sign(payload)}`;
}

export function readSession(value: string | undefined): Session | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [expires, username, signature] = parts;
  if (!/^\d+$/.test(expires)) return null;
  if (Number(expires) < Date.now()) return null;
  if (!username) return null;

  const payload = `${expires}.${username}`;
  if (!safeEqual(signature, sign(payload))) return null;
  return { username };
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getSession());
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_HOURS * 60 * 60,
};
