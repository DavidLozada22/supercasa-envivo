"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function StickyDonate() {
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(250_000_000);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { raised?: number; goal?: number };
        if (!active) return;
        if (typeof data.raised === "number") setRaised(data.raised);
        if (typeof data.goal === "number" && data.goal > 0) setGoal(data.goal);
      } catch {
        // El botón de donar funciona igual sin cifras.
      }
    };

    void load();
    const timer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#B5F43D] bg-[#0F2354]/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-white">
            {raised > 0 ? `Llevamos ${cop.format(raised)}` : "Cada aporte levanta una pared"}
          </p>
          <p className="text-[10px] text-white/50">Meta {cop.format(goal)}</p>
        </div>
        <Link
          href="/donar"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#E6009E] px-4 py-2.5 text-sm font-extrabold text-white"
        >
          <HeartHandshake className="h-4 w-4" strokeWidth={2} />
          Donar
        </Link>
      </div>
    </div>
  );
}
