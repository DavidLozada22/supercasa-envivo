import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "sc_admin";
const SESSION_HOURS = 12;

function secret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-secret-supercasa-envivo"
  );
}

function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "supercasa2026";
  return null;
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function verifyPassword(candidate: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionValue(): string {
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}

export function isValidSession(value: string | undefined): boolean {
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  if (!/^\d+$/.test(expires)) return false;
  if (Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_HOURS * 60 * 60,
};
