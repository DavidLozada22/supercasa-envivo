"use client";

import { useEffect, useRef, useState } from "react";
import TrackerMarkup from "./TrackerMarkup";

const formatCOP = (value: number) =>
  "$ " + Math.max(0, Math.round(value)).toLocaleString("es-CO");

type Props = {
  initialRaised: number;
  initialGoal: number;
};

export default function Tracker({ initialRaised, initialGoal }: Props) {
  const [raised, setRaised] = useState(initialRaised);
  const [goal, setGoal] = useState(initialGoal);
  const [shown, setShown] = useState(initialRaised);
  const fromRef = useRef(initialRaised);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === raised) {
      setShown(raised);
      return;
    }

    const start = performance.now();
    const duration = 850;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(Math.round(from + (raised - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = raised;
        setShown(raised);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [raised]);

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
        // La siguiente consulta reintenta.
      }
    };

    void load();
    const timer = window.setInterval(load, 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const pct = goal > 0 ? (raised / goal) * 100 : 0;
  const stage = pct >= 80 ? 5 : pct >= 60 ? 4 : pct >= 40 ? 3 : pct >= 20 ? 2 : 1;

  const stageText =
    pct >= 100
      ? "¡META CUMPLIDA! La Supercasa es Realidad"
      : stage === 5
        ? "Etapa 5 de 5: ¡Toques Finales y Bandera!"
        : stage === 4
          ? "Etapa 4 de 5: Gran Techo y Jardines"
          : stage === 3
            ? "Etapa 3 de 5: Segundo Piso Levantado"
            : stage === 2
              ? "Etapa 2 de 5: Muros y Primer Piso"
              : "Etapa 1 de 5: Cimientos de Esperanza";

  return (
    <TrackerMarkup
      raised={shown}
      goal={goal}
      pct={pct}
      stage={stage}
      stageText={stageText}
      formatCOP={formatCOP}
    />
  );
}
