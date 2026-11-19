"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  ChefHat,
  HeartHandshake,
  Music2,
  Radio,
  Scale,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { EVENT_END, EVENT_HOURS, EVENT_START } from "@/lib/event";
import type { SceneDef, SceneField } from "@/lib/streaming/scenes";

type Props = {
  scene: SceneDef;
  fields?: Partial<Record<SceneField, string>>;
  render?: boolean;
};

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

export default function SceneView({ scene, fields = {}, render = false }: Props) {
  if (scene.kind === "overlay") {
    return <OverlayView scene={scene} fields={fields} render={render} />;
  }

  const title = clean(fields.title) || scene.title;
  const subtitle = clean(fields.subtitle) || scene.subtitle;
  const note = clean(fields.note) || scene.note || "";
  const guest = clean(fields.guest) || "Nombre del invitado";
  const guestRole = clean(fields.guestRole) || "Cargo o rol";
  const returnAt = clean(fields.returnAt);
  const isStart = scene.id === "empezamos-1" || scene.id === "empezamos-5";
  const count = scene.id === "empezamos-1" ? "1" : scene.id === "empezamos-5" ? "5" : "";
  const isGuest = scene.id === "invitado";

  return (
    <div
      className={`scene scene--${scene.accent} scene--${scene.id}${
        scene.group === "bloque" ? " scene--block" : ""
      }${render ? " is-render" : ""}`}
    >
      <div className="scene__bg" aria-hidden="true" />
      <div className="scene__cape" aria-hidden="true" />
      <div className="scene__dots" aria-hidden="true" />
      {scene.group === "bloque" && scene.number ? (
        <span className="scene__watermark" aria-hidden="true">
          {scene.number}
        </span>
      ) : null}

      <header className="scene__top">
        <div className="scene__lockup">
          <img src="/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" />
          <span aria-hidden="true">×</span>
          <img
            className="scene__lockup-kavanah"
            src="/img/kavanah-horizontal-gold.png"
            alt="Kavanah"
          />
        </div>
        <span className="scene__badge">
          <i aria-hidden="true" />
          {scene.id === "gracias" ? "GRACIAS" : "48 HORAS"}
        </span>
      </header>

      <main className="scene__body">
        <p className="scene__eyebrow">{scene.eyebrow}</p>

        {isStart ? (
          <div className="scene__count">
            <span className="scene__count-number">{count}</span>
            <span className="scene__count-unit">
              {count === "1" ? "minuto para empezar" : "minutos para empezar"}
            </span>
          </div>
        ) : isGuest ? (
          <div className="scene__guest">
            <h1 className="scene__title">{guest}</h1>
            <p className="scene__guest-role">{guestRole}</p>
          </div>
        ) : (
          <h1 className="scene__title">{title}</h1>
        )}

        <p className="scene__subtitle">{subtitle}</p>

        {scene.id === "ya-volvemos" && returnAt ? (
          <p className="scene__return">Volvemos a las {returnAt}</p>
        ) : null}

        {note ? <p className="scene__note">{note}</p> : null}
      </main>

      <footer className="scene__foot">
        <span className="scene__url">supercasa.svgvisual.com</span>
        <span className="scene__hashtag">#PonteLaCapa</span>
      </footer>

      <SceneVisual scene={scene} />
    </div>
  );
}

function SceneVisual({ scene }: { scene: SceneDef }) {
  switch (scene.visual) {
    case "calvito":
      return (
        <img
          className="scene__hero"
          src="/img/calvitos/bombero.webp"
          alt=""
          aria-hidden="true"
        />
      );
    case "render":
      return (
        <img
          className="scene__render"
          src="/img/supercasa-render.webp"
          alt=""
          aria-hidden="true"
        />
      );
    case "qr":
      return (
        <div className="scene__qr">
          <img src="/img/qr-donar.png" alt="" aria-hidden="true" />
          <span>Escanea y dona</span>
        </div>
      );
    case "wrench":
      return (
        <div className="scene__icon" aria-hidden="true">
          <Wrench strokeWidth={1.5} />
        </div>
      );
    case "clock":
      return (
        <div className="scene__icon" aria-hidden="true">
          <CalendarClock strokeWidth={1.5} />
        </div>
      );
    case "guest":
      return (
        <div className="scene__icon" aria-hidden="true">
          <Radio strokeWidth={1.5} />
        </div>
      );
    case "logos":
      return (
        <div className="scene__logos" aria-hidden="true">
          <div>
            <img src="/img/logo-fsv-official.png" alt="" />
          </div>
          <div>
            <img src="/img/kavanah-horizontal-gold.png" alt="" />
          </div>
        </div>
      );
    case "cocina":
      return (
        <div className="scene__icon" aria-hidden="true">
          <ChefHat strokeWidth={1.5} />
        </div>
      );
    case "musica":
      return (
        <div className="scene__icon" aria-hidden="true">
          <Music2 strokeWidth={1.5} />
        </div>
      );
    case "historias":
      return (
        <div className="scene__icon" aria-hidden="true">
          <HeartHandshake strokeWidth={1.5} />
        </div>
      );
    case "legal":
      return (
        <div className="scene__icon" aria-hidden="true">
          <Scale strokeWidth={1.5} />
        </div>
      );
    case "creadores":
      return (
        <div className="scene__icon" aria-hidden="true">
          <Users strokeWidth={1.5} />
        </div>
      );
    case "none":
      return null;
    default:
      return (
        <div className="scene__icon" aria-hidden="true">
          <Sparkles strokeWidth={1.5} />
        </div>
      );
  }
}

function OverlayView({ scene, fields, render }: Props) {
  if (scene.id === "meta") {
    return (
      <div className={`scene scene--overlay scene--meta${render ? " is-render" : ""}`}>
        <GoalBar />
      </div>
    );
  }

  if (scene.id === "reloj") {
    return (
      <div className={`scene scene--overlay scene--reloj${render ? " is-render" : ""}`}>
        <ClockBar />
      </div>
    );
  }

  if (scene.id === "en-vivo") {
    return (
      <div className={`scene scene--overlay scene--en-vivo${render ? " is-render" : ""}`}>
        <span className="live-badge">
          <i aria-hidden="true" />
          EN VIVO
        </span>
      </div>
    );
  }

  const guest = clean(fields?.guest) || "Nombre del invitado";
  const guestRole = clean(fields?.guestRole) || "Cargo o rol";

  return (
    <div className={`scene scene--overlay scene--lower-third${render ? " is-render" : ""}`}>
      <div className="lt">
        <span className="lt__tag">EN VIVO</span>
        <div className="lt__body">
          <strong>{guest}</strong>
          <span>{guestRole}</span>
        </div>
      </div>
    </div>
  );
}

function GoalBar() {
  const [data, setData] = useState<{ raised: number; goal: number } | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as { raised?: number; goal?: number };
        if (!alive) return;
        setData({ raised: Number(body.raised) || 0, goal: Number(body.goal) || 0 });
      } catch {
        // Sin datos se mantiene la barra en cero.
      }
    };

    void load();
    const id = setInterval(load, 20_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const raised = data?.raised ?? 0;
  const goal = data?.goal ?? 0;
  const pct = goal > 0 ? Math.max(0, Math.min(100, (raised / goal) * 100)) : 0;

  return (
    <div className="goal">
      <div className="goal__fill" style={{ width: `${pct.toFixed(2)}%` }} />
      <div className="goal__row">
        <span className="goal__label">RECAUDADO</span>
        <strong className="goal__amount">{cop.format(raised)}</strong>
        <span className="goal__goal">de {goal > 0 ? cop.format(goal) : "la meta"}</span>
        <span className="goal__pct">{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function ClockBar() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = EVENT_START.getTime();
  const end = EVENT_END.getTime();
  const total = end - start;
  const elapsed = now ? Math.max(0, Math.min(total, now - start)) : 0;
  const hour = now ? Math.min(EVENT_HOURS, Math.floor(elapsed / 3_600_000)) : 0;
  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  return (
    <div className="clockbar">
      <div className="clockbar__row">
        <span className="clockbar__label">MARATÓN</span>
        <strong className="clockbar__hour">
          HORA {hour} <span>de {EVENT_HOURS}</span>
        </strong>
        <span className="clockbar__pct">{pct.toFixed(0)}%</span>
      </div>
      <div className="clockbar__track">
        <span style={{ width: `${pct.toFixed(2)}%` }} />
      </div>
    </div>
  );
}
