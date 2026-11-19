"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const KEY = "sc_attribution";
const SESSION_KEY = "sc_session";

export default function Attribution() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const params = new URLSearchParams(window.location.search);
    const incoming: Record<string, string | undefined> = {
      source: params.get("utm_source") ?? undefined,
      medium: params.get("utm_medium") ?? undefined,
      campaign: params.get("utm_campaign") ?? undefined,
      content: params.get("utm_content") ?? undefined,
      term: params.get("utm_term") ?? undefined,
      ref: params.get("ref") ?? undefined,
    };

    let saved: Record<string, string> = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
      saved = {};
    }

    const merged: Record<string, string> = { ...saved };
    for (const [key, value] of Object.entries(incoming)) {
      if (value) merged[key] = value;
    }

    if (!merged.ref) {
      const match = document.cookie.match(/(?:^|; )sc_ref=([^;]+)/);
      if (match) merged.ref = decodeURIComponent(match[1]);
    }

    try {
      localStorage.setItem(KEY, JSON.stringify(merged));
    } catch {
      // Sin almacenamiento local, la atribución no persiste.
    }

    if (sessionStorage.getItem("sc_visit_sent")) return;
    sessionStorage.setItem("sc_visit_sent", "1");

    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        path: pathname || "/",
        referrer: document.referrer || undefined,
        attribution: merged,
      }),
    }).catch(() => {
      // La medición no debe bloquear la página.
    });
  }, [pathname]);

  return null;
}
