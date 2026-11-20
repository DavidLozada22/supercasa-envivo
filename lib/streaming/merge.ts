import type { CalvitoKey, SceneAccent, SceneDef, SceneQrTarget } from "./scenes";

export type SceneOverride = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  note?: string;
  cta?: string;
  badge?: string;
  countValue?: string;
  countUnit?: string;
  guest?: string;
  guestRole?: string;
  returnAt?: string;
  accent?: SceneAccent;
  illustration?: CalvitoKey | null;
  illustrationCluster?: CalvitoKey[] | null;
  qrTarget?: SceneQrTarget;
  progressLive?: boolean;
  progressPercent?: number;
  progressCaption?: string;
};

export type StreamingCopy = {
  donateUrl?: string;
  liveUrl?: string;
  breB?: string;
  bank?: string;
  hashtag?: string;
  igFsv?: string;
  igKav?: string;
};

export type ResolvedStreamingCopy = Required<StreamingCopy>;

export const DEFAULT_STREAMING_COPY: ResolvedStreamingCopy = {
  donateUrl: "https://supercasa.svgvisual.com/donar",
  liveUrl: "https://supercasa.svgvisual.com/envivo",
  breB: "Bre-B @lasupercasa",
  bank: "Bancolombia 186-000090-54",
  hashtag: "#PonteLaCapa",
  igFsv: "@segundosdevidafundacion",
  igKav: "@kavanahpl35",
};

export type StreamingContent = {
  scenes: Record<string, SceneOverride>;
  copy?: StreamingCopy;
  updatedAt: string;
  updatedBy: string;
};

export const EMPTY_STREAMING_CONTENT: StreamingContent = {
  scenes: {},
  updatedAt: new Date(0).toISOString(),
  updatedBy: "",
};

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

export function resolveStreamingCopy(copy?: StreamingCopy): ResolvedStreamingCopy {
  return {
    donateUrl: clean(copy?.donateUrl) || DEFAULT_STREAMING_COPY.donateUrl,
    liveUrl: clean(copy?.liveUrl) || DEFAULT_STREAMING_COPY.liveUrl,
    breB: clean(copy?.breB) || DEFAULT_STREAMING_COPY.breB,
    bank: clean(copy?.bank) || DEFAULT_STREAMING_COPY.bank,
    hashtag: clean(copy?.hashtag) || DEFAULT_STREAMING_COPY.hashtag,
    igFsv: clean(copy?.igFsv) || DEFAULT_STREAMING_COPY.igFsv,
    igKav: clean(copy?.igKav) || DEFAULT_STREAMING_COPY.igKav,
  };
}

export function displayUrl(url: string): string {
  return clean(url)
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

export function mergeScene(scene: SceneDef, override?: SceneOverride): SceneDef {
  if (!override) {
    return {
      ...scene,
      qrTarget: scene.qrTarget ?? "donate",
      progressLive: scene.progressLive ?? Boolean(scene.houseLive),
      progressPercent:
        scene.progressPercent ?? scene.houseFrame ?? 60,
    };
  }

  const illustration =
    override.illustration === null
      ? undefined
      : override.illustration ?? scene.illustration;
  const cluster =
    override.illustrationCluster === null
      ? undefined
      : override.illustrationCluster ??
        (override.illustration !== undefined ? undefined : scene.illustrationCluster);
  const percent =
    override.progressPercent ?? scene.progressPercent ?? scene.houseFrame ?? 60;

  return {
    ...scene,
    eyebrow: override.eyebrow ?? scene.eyebrow,
    title: override.title ?? scene.title,
    subtitle: override.subtitle ?? scene.subtitle,
    note: override.note ?? scene.note,
    cta: override.cta ?? scene.cta,
    badge: override.badge ?? scene.badge,
    countValue: override.countValue ?? scene.countValue,
    countUnit: override.countUnit ?? scene.countUnit,
    guest: override.guest ?? scene.guest,
    guestRole: override.guestRole ?? scene.guestRole,
    returnAt: override.returnAt ?? scene.returnAt,
    accent: override.accent ?? scene.accent,
    illustration,
    illustrationCluster: cluster,
    qrTarget: override.qrTarget ?? scene.qrTarget ?? "donate",
    progressLive:
      override.progressLive ?? scene.progressLive ?? Boolean(scene.houseLive),
    progressPercent: Math.max(0, Math.min(100, Math.round(percent))),
    progressCaption: override.progressCaption ?? scene.progressCaption,
  };
}

export function mergeScenes(
  scenes: SceneDef[],
  content: StreamingContent,
): SceneDef[] {
  return scenes.map((scene) => mergeScene(scene, content.scenes[scene.id]));
}
