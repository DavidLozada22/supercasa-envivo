"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  ChefHat,
  HeartHandshake,
  Music2,
  QrCode,
  Radio,
  Scale,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { EVENT_END, EVENT_HOURS, EVENT_START } from "@/lib/event";
import {
  displayUrl,
  resolveStreamingCopy,
  type StreamingCopy,
} from "@/lib/streaming/merge";
import {
  calvitoSrc,
  type CalvitoKey,
  type SceneDef,
  type SceneField,
  type SceneQrTarget,
} from "@/lib/streaming/scenes";

type Props = {
  scene: SceneDef;
  fields?: Partial<Record<SceneField, string>>;
  render?: boolean;
  copy?: StreamingCopy;
  frozen?: boolean;
};

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

function qrSrc(target: SceneQrTarget | undefined, copy?: StreamingCopy): string {
  const resolved = resolveStreamingCopy(copy);
  const url = target === "live" ? resolved.liveUrl : resolved.donateUrl;
  return `/api/qr?u=${encodeURIComponent(url)}`;
}

function qrDestination(
  target: SceneQrTarget | undefined,
  copy?: StreamingCopy,
): { url: string; short: string; cta: string } {
  const resolved = resolveStreamingCopy(copy);
  const url = target === "live" ? resolved.liveUrl : resolved.donateUrl;
  return {
    url,
    short: displayUrl(url),
    cta: target === "live" ? "Mira el en vivo" : "Dona aquí",
  };
}

function useProgress(enabled = true) {
  const [data, setData] = useState<{ raised: number; goal: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as { raised?: number; goal?: number };
        if (!alive) return;
        setData({ raised: Number(body.raised) || 0, goal: Number(body.goal) || 0 });
      } catch {
        // Sin datos se conserva el ultimo valor.
      }
    };
    void load();
    const id = setInterval(load, 20_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [enabled]);

  return data;
}

export default function SceneView({
  scene,
  fields = {},
  render = false,
  copy,
  frozen = false,
}: Props) {
  if (scene.kind === "overlay") {
    return (
      <OverlayView scene={scene} fields={fields} render={render} copy={copy} frozen={frozen} />
    );
  }

  if (scene.visual === "liveframe") {
    return (
      <div className={`scene scene--liveframe${render ? " is-render" : ""}`}>
        <LiveFrame scene={scene} copy={copy} transparent={false} frozen={frozen} />
      </div>
    );
  }

  const title = clean(fields.title) || scene.title;
  const subtitle = clean(fields.subtitle) || scene.subtitle;
  const note = clean(fields.note) || scene.note || "";
  const guest = clean(fields.guest) || scene.guest || "Nombre del invitado";
  const guestRole = clean(fields.guestRole) || scene.guestRole || "Cargo o rol";
  const returnAt = clean(fields.returnAt) || scene.returnAt || "";
  const isCount = Boolean(scene.countValue);
  const isGuest = scene.id === "invitado";
  const hasHero =
    scene.visual !== "house" && Boolean(scene.illustration || scene.illustrationCluster);
  const badge =
    scene.badge ||
    (scene.id === "gracias" ? "GRACIAS" : scene.group === "bloque" ? "BLOQUE EN VIVO" : "48 HORAS");
  const qr = qrDestination(scene.qrTarget, copy);

  return (
    <div
      className={`scene scene--${scene.accent} scene--${scene.id}${
        scene.group === "bloque" ? " scene--block" : ""
      }${hasHero ? " has-hero" : ""}${isCount ? " scene--count" : ""}${
        scene.visual === "house" ? " scene--house" : ""
      }${render ? " is-render" : ""}`}
    >
      <div className="scene__bg" aria-hidden="true" />
      <div className="scene__cape" aria-hidden="true" />
      <div className="scene__dots" aria-hidden="true" />

      <header className="scene__top">
        <div className="scene__lockup">
          <img src="/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" />
          <span className="scene__lockup-x" aria-hidden="true">
            ×
          </span>
          <img
            className="scene__lockup-kavanah"
            src="/img/kavanah-horizontal-gold.png"
            alt="Kavanah"
          />
        </div>
        <span className="scene__badge">
          <i aria-hidden="true" />
          {badge}
        </span>
      </header>

      <main className="scene__body">
        <p className="scene__eyebrow">{scene.eyebrow}</p>

        {isCount ? (
          <div className="scene__count">
            <span
              className={`scene__count-number${scene.countValue === "½" ? " is-fraction" : ""}`}
            >
              {scene.countValue}
            </span>
            <span className="scene__count-unit">{scene.countUnit}</span>
          </div>
        ) : isGuest ? (
          <div className="scene__guest">
            <h1 className="scene__title">{guest}</h1>
            <p className="scene__guest-role">{guestRole}</p>
          </div>
        ) : scene.group === "bloque" && scene.number ? (
          <div className="scene__block-head">
            <span className="scene__block-number">{scene.number}</span>
            <h1 className="scene__title">{title}</h1>
          </div>
        ) : (
          <h1 className="scene__title">{title}</h1>
        )}

        <p className="scene__subtitle">{subtitle}</p>

        {scene.id === "ya-volvemos" && returnAt ? (
          <p className="scene__return">Regresamos a las {returnAt}</p>
        ) : null}

        {note ? <p className="scene__note">{note}</p> : null}
      </main>

      {scene.visual === "house" ? <HouseVisual scene={scene} frozen={frozen} /> : null}

      {hasHero ? <SceneHero scene={scene} render={render} /> : null}

      {scene.visual === "qr" ? (
        <div className="scene__qr">
          <img src={qrSrc(scene.qrTarget, copy)} alt="" aria-hidden="true" />
          <span>{scene.cta || qr.cta}</span>
        </div>
      ) : null}

      {scene.visual === "logos" ? <AlliesLogos /> : null}

      {!hasHero ? <SceneIcon visual={scene.visual} /> : null}

      <SceneFoot scene={scene} copy={copy} />
    </div>
  );
}

function SceneHero({ scene, render }: { scene: SceneDef; render: boolean }) {
  if (scene.illustrationCluster?.length) {
    return (
      <div className="scene__hero-cluster" aria-hidden="true">
        {scene.illustrationCluster.map((key, index) => (
          <img
            key={key}
            className={`scene__hero-cluster-item item-${index}`}
            src={calvitoSrc(key)}
            alt=""
            style={{ animationDelay: render ? "0s" : `${index * 0.4}s` }}
          />
        ))}
      </div>
    );
  }

  if (!scene.illustration) return null;

  return (
    <img
      className="scene__hero"
      src={calvitoSrc(scene.illustration as CalvitoKey)}
      alt=""
      aria-hidden="true"
    />
  );
}

function SceneIcon({ visual }: { visual: SceneDef["visual"] }) {
  const icon = (() => {
    switch (visual) {
      case "wrench":
        return <Wrench strokeWidth={1.5} />;
      case "clock":
        return <CalendarClock strokeWidth={1.5} />;
      case "guest":
        return <Radio strokeWidth={1.5} />;
      case "cocina":
        return <ChefHat strokeWidth={1.5} />;
      case "musica":
        return <Music2 strokeWidth={1.5} />;
      case "historias":
        return <HeartHandshake strokeWidth={1.5} />;
      case "legal":
        return <Scale strokeWidth={1.5} />;
      case "creadores":
        return <Users strokeWidth={1.5} />;
      case "spark":
        return <Sparkles strokeWidth={1.5} />;
      default:
        return null;
    }
  })();

  if (!icon) return null;
  return (
    <div className="scene__icon" aria-hidden="true">
      {icon}
    </div>
  );
}

function AlliesLogos() {
  return (
    <div className="scene__logos" aria-hidden="true">
      <img src="/img/logo-fsv-official.png" alt="" />
      <span>×</span>
      <img src="/img/kavanah-horizontal-gold.png" alt="" />
    </div>
  );
}

function SceneFoot({ scene, copy }: { scene: SceneDef; copy?: StreamingCopy }) {
  const resolved = resolveStreamingCopy(copy);
  const qr = qrDestination(scene.qrTarget, copy);
  return (
    <footer className="scene__foot">
      <div className="scene__foot-donate">
        <img
          className="scene__foot-qr"
          src={qrSrc(scene.qrTarget, copy)}
          alt=""
          aria-hidden="true"
        />
        <div className="scene__foot-copy">
          <span className="scene__foot-cta">{scene.cta || qr.cta}</span>
          <span className="scene__foot-url">{qr.short}</span>
        </div>
      </div>
      <div className="scene__foot-side">
        <span className="scene__foot-hashtag">{resolved.hashtag}</span>
        <span className="scene__foot-method">{resolved.breB}</span>
      </div>
    </footer>
  );
}

function HouseVisual({ scene, frozen }: { scene: SceneDef; frozen: boolean }) {
  const live = Boolean(scene.progressLive);
  const frame = scene.progressPercent ?? scene.houseFrame ?? 50;
  const progress = useProgress(live && !frozen);
  const pct = live && !frozen && progress?.goal ? (progress.raised / progress.goal) * 100 : frame;
  const snapped = Math.min(100, Math.max(0, Math.floor(pct / 5) * 5));
  const shown = live && !frozen && progress?.goal ? Math.round(pct) : frame;
  const src = `/img/casa/supercasa-${String(snapped).padStart(3, "0")}-1400.webp`;

  return (
    <div className="scene__house">
      <div className="scene__house-frame">
        <img src={src} alt="" aria-hidden="true" />
        <span className="scene__house-pct">{shown}%</span>
        {live && !frozen && progress?.goal ? (
          <span className="scene__house-live">AVANCE REAL</span>
        ) : null}
      </div>
      <p className="scene__house-caption">
        {scene.progressCaption ||
          (live ? "La casa avanza con cada donación" : "Paso a paso, entre todos")}
      </p>
    </div>
  );
}

function OverlayView({ scene, fields, render, copy, frozen = false }: Props) {
  if (scene.id === "meta") {
    return (
      <div className={`scene scene--overlay scene--meta${render ? " is-render" : ""}`}>
        <GoalBar scene={scene} copy={copy} frozen={frozen} />
        <OverlayBrand />
        <OverlayChip copy={copy} />
      </div>
    );
  }

  if (scene.id === "reloj") {
    return (
      <div className={`scene scene--overlay scene--reloj${render ? " is-render" : ""}`}>
        <ClockBar scene={scene} copy={copy} />
        <OverlayBrand />
        <OverlayChip copy={copy} />
      </div>
    );
  }

  if (scene.id === "en-vivo") {
    return (
      <div className={`scene scene--overlay scene--en-vivo${render ? " is-render" : ""}`}>
        <span className="live-badge">
          <i aria-hidden="true" />
          {scene.title || "EN VIVO"}
        </span>
        <OverlayBrand side="left" />
        <OverlayChip copy={copy} />
      </div>
    );
  }

  if (scene.id === "donacion") {
    return (
      <div className={`scene scene--overlay scene--donacion${render ? " is-render" : ""}`}>
        <DonationOverlay scene={scene} copy={copy} />
      </div>
    );
  }

  if (scene.id === "en-vivo-qr") {
    return (
      <div className={`scene scene--overlay scene--liveqr${render ? " is-render" : ""}`}>
        <LiveQrOverlay scene={scene} copy={copy} />
      </div>
    );
  }

  if (scene.id === "mosca") {
    return (
      <div className={`scene scene--overlay scene--mosca${render ? " is-render" : ""}`}>
        <HoursBug scene={scene} copy={copy} render={Boolean(render)} />
      </div>
    );
  }

  if (scene.visual === "liveframe") {
    return (
      <div className={`scene scene--overlay scene--liveframe${render ? " is-render" : ""}`}>
        <LiveFrame scene={scene} copy={copy} transparent frozen={frozen} />
      </div>
    );
  }

  const guest = clean(fields?.guest) || scene.guest || "Nombre del invitado";
  const guestRole = clean(fields?.guestRole) || scene.guestRole || "Cargo o rol";

  return (
    <div className={`scene scene--overlay scene--lower-third${render ? " is-render" : ""}`}>
      <div className="lt">
        <span className="lt__tag">{scene.eyebrow || "EN VIVO"}</span>
        <div className="lt__body">
          <strong>{guest}</strong>
          <span>{guestRole}</span>
        </div>
      </div>
      <OverlayBrand />
      <OverlayChip copy={copy} />
    </div>
  );
}

function OverlayBrand({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <div className={`ovbrand ovbrand--${side}`} aria-hidden="true">
      <img src="/img/logo-fsv-official.png" alt="" />
      <span>×</span>
      <img src="/img/kavanah-horizontal-gold.png" alt="" />
    </div>
  );
}

function OverlayChip({ copy }: { copy?: StreamingCopy }) {
  const resolved = resolveStreamingCopy(copy);
  return (
    <div className="ovchip" aria-hidden="true">
      <QrCode className="h-[22px] w-[22px]" strokeWidth={2} />
      <span>
        DONA · {displayUrl(resolved.donateUrl)} · {resolved.breB}
      </span>
    </div>
  );
}

function DonationOverlay({ scene, copy }: { scene: SceneDef; copy?: StreamingCopy }) {
  const resolved = resolveStreamingCopy(copy);
  const qr = qrDestination(scene.qrTarget, copy);
  return (
    <div className="donov">
      <div className="donov__brand" aria-hidden="true">
        <img src="/img/logo-fsv-official.png" alt="" />
        <span>×</span>
        <img src="/img/kavanah-horizontal-gold.png" alt="" />
      </div>
      <p className="donov__eyebrow">{scene.eyebrow || "Dona ahora"}</p>
      <h2 className="donov__title">{scene.title}</h2>
      <div className="donov__qr">
        <img src={qrSrc(scene.qrTarget, copy)} alt="" aria-hidden="true" />
      </div>
      <p className="donov__url">{qr.short}</p>
      <p className="donov__cause">
        {scene.note || scene.subtitle}
      </p>
      <div className="donov__methods">
        <span>{resolved.breB}</span>
        <span>{resolved.bank}</span>
      </div>
      <div className="donov__social">
        <span>{resolved.igFsv}</span>
        <span>{resolved.igKav}</span>
      </div>
    </div>
  );
}

function LiveQrOverlay({ scene, copy }: { scene: SceneDef; copy?: StreamingCopy }) {
  const resolved = resolveStreamingCopy(copy);
  const qr = qrDestination(scene.qrTarget, copy);
  return (
    <>
      <span className="live-badge live-badge--left">
        <i aria-hidden="true" />
        {scene.eyebrow || "EN VIVO"}
      </span>
      <div className="liveqr__card">
        <p className="liveqr__cta">{scene.cta || "DONA AQUÍ"}</p>
        <img className="liveqr__qr" src={qrSrc(scene.qrTarget, copy)} alt="" aria-hidden="true" />
        <p className="liveqr__url">{qr.short}</p>
        <p className="liveqr__methods">{resolved.breB}</p>
      </div>
      <div className="liveqr__brand" aria-hidden="true">
        <img src="/img/logo-fsv-official.png" alt="" />
        <span>×</span>
        <img src="/img/kavanah-horizontal-gold.png" alt="" />
      </div>
    </>
  );
}

function HoursBug({
  scene,
  copy,
  render,
}: {
  scene: SceneDef;
  copy?: StreamingCopy;
  render: boolean;
}) {
  const [now, setNow] = useState(0);
  const resolved = resolveStreamingCopy(copy);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = EVENT_START.getTime();
  const end = EVENT_END.getTime();
  const total = end - start;
  const baseNow = render ? start + 12 * 3_600_000 : now;
  const elapsed = baseNow ? Math.max(0, Math.min(total, baseNow - start)) : 0;
  const remaining = Math.max(0, total - elapsed);
  const hours = Math.floor(elapsed / 3_600_000);
  const remainingHours = Math.ceil(remaining / 3_600_000);
  const pct = total > 0 ? (elapsed / total) * 100 : 0;
  const live = baseNow >= start && baseNow < end;

  return (
    <div className="hoursbug">
      <div className="hoursbug__top">
        <span className={`hoursbug__live${live ? " is-live" : ""}`}>
          <i aria-hidden="true" />
          {live ? "EN VIVO" : "MARATÓN 48 H"}
        </span>
        <div className="hoursbug__brand" aria-hidden="true">
          <img src="/img/logo-fsv-official.png" alt="" />
          <span>×</span>
          <img src="/img/kavanah-horizontal-gold.png" alt="" />
        </div>
      </div>
      <div className="hoursbug__main">
        <span className="hoursbug__now">
          HORA {hours} <small>de {EVENT_HOURS}</small>
        </span>
        <span className="hoursbug__left">
          {remainingHours > 0 ? `FALTAN ${remainingHours} H` : "ÚLTIMA HORA"}
        </span>
      </div>
      <div className="hoursbug__track">
        <span style={{ width: `${pct.toFixed(2)}%` }} />
      </div>
      <p className="hoursbug__cta">
        {scene.cta || `DONA · ${displayUrl(resolved.donateUrl)}`}
      </p>
    </div>
  );
}

function LiveFrame({
  scene,
  copy,
  transparent,
  frozen = false,
}: {
  scene: SceneDef;
  copy?: StreamingCopy;
  transparent: boolean;
  frozen?: boolean;
}) {
  const live = scene.progressLive !== false;
  const progress = useProgress(live && !frozen);
  const raised = progress?.raised ?? 0;
  const goal = progress?.goal ?? 0;
  const pct =
    live && !frozen && goal > 0
      ? Math.max(0, Math.min(100, (raised / goal) * 100))
      : Math.max(0, Math.min(100, scene.progressPercent ?? 0));
  const resolved = resolveStreamingCopy(copy);
  const qr = qrDestination(scene.qrTarget, copy);

  return (
    <div className={`liveframe${transparent ? " is-overlay" : " is-background"}`}>
      <div className="liveframe__base" aria-hidden="true" />
      <div className="liveframe__hole" aria-hidden="true">
        {!transparent ? (
          <span className="liveframe__hole-label">
            LIVE 1280 x 720
            <small>Pon el video aquí</small>
          </span>
        ) : null}
      </div>
      <div className="liveframe__left" aria-hidden="true" />

      <div className="liveframe__top">
        <div className="liveframe__brand">
          <img src="/img/logo-fsv-official.png" alt="Fundación Segundos de Vida" />
          <span aria-hidden="true">×</span>
          <img src="/img/kavanah-horizontal-gold.png" alt="Kavanah" />
        </div>
        <div className="liveframe__topline">
          <span className="liveframe__kicker">
            {scene.eyebrow || "48 horas por La Supercasa"}
          </span>
          <span className="live-badge live-badge--inline">
            <i aria-hidden="true" />
            EN VIVO
          </span>
        </div>
      </div>

      <div className="liveframe__panel">
        <p className="liveframe__eyebrow">{scene.cta || "Dona ahora"}</p>
        <h2 className="liveframe__title">{scene.title}</h2>
        <div className="liveframe__qr">
          <img src={qrSrc(scene.qrTarget, copy)} alt="" aria-hidden="true" />
        </div>
        <p className="liveframe__url">{qr.short}</p>
        <p className="liveframe__cause">
          {scene.note ||
            "Escanea el QR o entra al enlace. Cada aporte pone una pieza real en la casa de los Súper Calvitos."}
        </p>
        <div className="liveframe__methods">
          <span>{resolved.breB}</span>
          <span>{resolved.bank}</span>
        </div>

        <div className="liveframe__progress">
          <div className="liveframe__progress-head">
            <span>Recaudado</span>
            <strong>{pct.toFixed(0)}%</strong>
          </div>
          <div className="liveframe__track">
            <span style={{ width: `${pct.toFixed(2)}%` }} />
          </div>
          <p>
            {live && !frozen && goal > 0
              ? `${cop.format(raised)} de ${cop.format(goal)}`
              : `${pct.toFixed(0)}% de la meta`}
          </p>
        </div>

        <div className="liveframe__social">
          <span>{resolved.igFsv}</span>
          <span>{resolved.igKav}</span>
        </div>
      </div>

      <div className="liveframe__bottom">
        <span className="liveframe__ticker">
          {scene.subtitle ||
            `Cada pieza cuenta · Dona en ${displayUrl(resolved.donateUrl)} · ${resolved.breB} · ${resolved.igFsv} · ${resolved.igKav}`}
        </span>
      </div>
    </div>
  );
}

function GoalBar({
  scene,
  copy,
  frozen = false,
}: {
  scene: SceneDef;
  copy?: StreamingCopy;
  frozen?: boolean;
}) {
  const live = Boolean(scene.progressLive);
  const data = useProgress(live && !frozen);
  const raised = data?.raised ?? 0;
  const goal = data?.goal ?? 0;
  const pct =
    live && !frozen && goal > 0
      ? Math.max(0, Math.min(100, (raised / goal) * 100))
      : Math.max(0, Math.min(100, scene.progressPercent ?? 60));
  const qr = qrDestination(scene.qrTarget, copy);

  return (
    <div className="goal">
      <div className="goal__fill" style={{ width: `${pct.toFixed(2)}%` }} />
      <div className="goal__row">
        <span className="goal__label">{scene.eyebrow || "RECAUDADO"}</span>
        <strong className="goal__amount">
          {live && !frozen && goal > 0 ? cop.format(raised) : `${pct.toFixed(0)}%`}
        </strong>
        <span className="goal__goal">
          {live && !frozen && goal > 0 ? `de ${cop.format(goal)}` : "de la meta"}
        </span>
        <span className="goal__cta">{scene.cta || `DONA EN ${qr.short}`}</span>
        <span className="goal__pct">{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function ClockBar({ scene, copy }: { scene: SceneDef; copy?: StreamingCopy }) {
  const [now, setNow] = useState(0);
  const resolved = resolveStreamingCopy(copy);

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
        <span className="clockbar__label">{scene.eyebrow || "MARATÓN"}</span>
        <strong className="clockbar__hour">
          HORA {hour} <span>de {EVENT_HOURS}</span>
        </strong>
        <span className="clockbar__cta">
          {scene.cta || `DONA EN ${displayUrl(resolved.donateUrl)}`}
        </span>
        <span className="clockbar__pct">{pct.toFixed(0)}%</span>
      </div>
      <div className="clockbar__track">
        <span style={{ width: `${pct.toFixed(2)}%` }} />
      </div>
    </div>
  );
}
