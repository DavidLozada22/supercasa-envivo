"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PIXEL_ID = "1108633085373695";
const CONSENT_KEY = "supercasa_meta_consent";
type PixelFunction = ((...args: unknown[]) => void) & {
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<"yes" | "no" | null>(null);
  const initialized = useRef(false);
  const lastPath = useRef<string | null>(null);
  const publicPage = !pathname?.startsWith("/admin") && !pathname?.startsWith("/pantalla");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved === "yes" || saved === "no") setConsent(saved);
    } catch {
      // La página sigue funcionando si el navegador bloquea almacenamiento.
    }
  }, []);

  useEffect(() => {
    if (consent !== "yes" || !publicPage || !pathname) return;
    if (!initialized.current) {
      const w = window as Window & { fbq?: PixelFunction };
      if (!w.fbq) {
        const pixel = ((...args: unknown[]) => {
          if (pixel.callMethod) pixel.callMethod(...args);
          else pixel.queue?.push(args);
        }) as PixelFunction;
        pixel.queue = [];
        pixel.loaded = true;
        pixel.version = "2.0";
        w.fbq = pixel;
        w._fbq = pixel;
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(script);
      }
      w.fbq?.("init", PIXEL_ID);
      initialized.current = true;
    }
    if (lastPath.current !== pathname) {
      window.fbq?.("track", "PageView");
      lastPath.current = pathname;
    }
  }, [consent, pathname, publicPage]);

  function choose(value: "yes" | "no") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // La elección aplica durante esta visita.
    }
    setConsent(value);
  }

  if (!publicPage || consent !== null) return null;
  return (
    <aside aria-label="Preferencias de medición" className="fixed bottom-3 left-3 right-3 z-[100] mx-auto max-w-2xl rounded-2xl border-2 border-[#1d2b4f] bg-white p-3 text-[#1d2b4f] shadow-lg sm:bottom-4 sm:left-4 sm:right-4 sm:p-4">
      <p className="text-xs leading-relaxed sm:text-sm">¿Nos permites usar el píxel de Meta para medir las visitas y mejorar la difusión? <a href="/politica-de-datos" className="underline">Política de datos</a>.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => choose("yes")} className="min-h-[44px] rounded-full bg-[#c62828] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#a51f1f]">Aceptar medición</button>
        <button type="button" onClick={() => choose("no")} className="min-h-[44px] rounded-full border border-[#1d2b4f] px-4 py-1.5 text-sm font-bold hover:bg-slate-100">Rechazar</button>
      </div>
    </aside>
  );
}
