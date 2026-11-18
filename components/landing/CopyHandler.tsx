"use client";

import { useEffect } from "react";

export default function CopyHandler() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>("[data-copy]");
      if (!button) return;

      const value = button.dataset.copy;
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        return;
      }

      const original = button.textContent ?? "";
      button.textContent = "¡Copiado al portapapeles!";
      window.setTimeout(() => {
        button.textContent = original;
      }, 2400);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
