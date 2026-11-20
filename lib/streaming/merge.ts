import type { CalvitoKey, SceneAccent, SceneDef } from "./scenes";

export type SceneOverride = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  note?: string;
  cta?: string;
  countValue?: string;
  countUnit?: string;
  accent?: SceneAccent;
  illustration?: CalvitoKey | null;
  illustrationCluster?: CalvitoKey[] | null;
};

export type StreamingContent = {
  scenes: Record<string, SceneOverride>;
  updatedAt: string;
  updatedBy: string;
};

export const EMPTY_STREAMING_CONTENT: StreamingContent = {
  scenes: {},
  updatedAt: new Date(0).toISOString(),
  updatedBy: "",
};

export function mergeScene(scene: SceneDef, override?: SceneOverride): SceneDef {
  if (!override) return scene;

  const illustration =
    override.illustration === null
      ? undefined
      : override.illustration ?? scene.illustration;
  const cluster =
    override.illustrationCluster === null
      ? undefined
      : override.illustrationCluster ??
        (override.illustration !== undefined ? undefined : scene.illustrationCluster);

  return {
    ...scene,
    eyebrow: override.eyebrow ?? scene.eyebrow,
    title: override.title ?? scene.title,
    subtitle: override.subtitle ?? scene.subtitle,
    note: override.note ?? scene.note,
    cta: override.cta ?? scene.cta,
    countValue: override.countValue ?? scene.countValue,
    countUnit: override.countUnit ?? scene.countUnit,
    accent: override.accent ?? scene.accent,
    illustration,
    illustrationCluster: cluster,
  };
}

export function mergeScenes(
  scenes: SceneDef[],
  content: StreamingContent,
): SceneDef[] {
  return scenes.map((scene) => mergeScene(scene, content.scenes[scene.id]));
}
