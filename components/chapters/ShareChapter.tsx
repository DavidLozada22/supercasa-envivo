"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";

export default function ShareChapter({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div className="chapter-share">
      <a
        className="chapter-btn chapter-btn--soft"
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        Compartir
      </a>
      <button type="button" className="chapter-btn chapter-btn--soft" onClick={copy}>
        {copied ? (
          <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        )}
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </button>
    </div>
  );
}
