"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { absoluteUrl } from "@/lib/streaming/links";

export default function ObsCopyButton({
  path,
  className = "",
  label = "OBS",
}: {
  path: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = absoluteUrl(path);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      return;
    } catch {
      // Si el navegador bloquea el portapapeles, se intenta el método clásico.
    }
    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
    document.body.removeChild(field);
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      title="Copiar enlace para OBS"
      aria-label="Copiar enlace para OBS"
      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#0F2354] transition hover:border-[#E6009E]/40 hover:bg-[#E6009E]/5 ${
        copied ? "border-emerald-300 bg-emerald-50 text-emerald-700" : ""
      } ${className}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" strokeWidth={2} />
      ) : (
        <Copy className="h-3.5 w-3.5" strokeWidth={2} />
      )}
      {copied ? "Copiado" : label}
    </button>
  );
}
