"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "sc_visitor";
const PING_MS = 20_000;

const TRACKED = ["/", "/envivo", "/donar", "/recorrido", "/programa"];

function trackPath(pathname: string | null): string {
  const path = (pathname || "/").split("?")[0].split("#")[0];
  if (path === "/donar/gracias") return "/donar";
  for (const item of TRACKED) {
    if (path === item) return item;
    if (item !== "/" && path.startsWith(`${item}/`)) return item;
  }
  return "";
}

function visitorId(): string {
  try {
    const saved = localStorage.getItem(VISITOR_KEY);
    if (saved) return saved;
    const created =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(VISITOR_KEY, created);
    return created;
  } catch {
    return "";
  }
}

function send(payload: { visitorId: string; path: string; kind: "view" | "ping" }) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/analytics/live", blob)) return;
    }
  } catch {
    // Sigue con fetch.
  }
  fetch("/api/analytics/live", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    cache: "no-store",
  }).catch(() => undefined);
}

export default function LiveAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.webdriver) return;
    const path = trackPath(pathname);
    if (!path) return;

    const visitor = visitorId();
    if (!visitor) return;

    send({ visitorId: visitor, path, kind: "view" });

    const timer = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      send({ visitorId: visitor, path, kind: "ping" });
    }, PING_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        send({ visitorId: visitor, path, kind: "ping" });
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pathname]);

  return null;
}
