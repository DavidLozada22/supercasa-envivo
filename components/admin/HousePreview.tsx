"use client";

import { useState } from "react";
import styles from "@/components/landing/house-progress.module.css";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const GOAL = 250_000_000;

export default function HousePreview() {
  const [pct, setPct] = useState(60);
  const frame = Math.floor(pct / 5) * 5;
  const raised = Math.round((pct / 100) * GOAL);
  const file = `/img/casa/supercasa-${String(frame).padStart(3, "0")}-1400.webp`;

  return (
    <div className={styles.section}>
      <div className={styles.frame}>
        <img
          key={frame}
          src={file}
          width={1400}
          height={1042}
          alt={`La Supercasa con ${frame}% de avance`}
        />
        <span className={styles.badge}>La Supercasa · {frame}%</span>
      </div>

      <div className={styles.stats}>
        <p className={styles.kicker}>Simulación de avance</p>
        <p className={styles.amount}>{cop.format(raised)}</p>
        <p className={styles.goal}>
          {pct}% de la meta · render en {frame}%
        </p>

        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>

        <label className="mt-4 block text-sm font-semibold text-[#0F2354]">
          Mueve la barra para simular las donaciones
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            onChange={(event) => setPct(Number(event.target.value))}
            className="mt-2 w-full accent-[#E6009E]"
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {[0, 20, 40, 60, 80, 100].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPct(value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                pct === value
                  ? "border-[#0F2354] bg-[#0F2354] text-white"
                  : "border-slate-300 bg-white text-[#0F2354] hover:bg-slate-100"
              }`}
            >
              {value}%
            </button>
          ))}
        </div>

        <p className={styles.note}>
          El render cambia cada 5% y hace el fundido con zoom. La barra se mueve de forma continua
          para que puedas probar cómo se sentirá durante la maratón.
        </p>
      </div>
    </div>
  );
}
