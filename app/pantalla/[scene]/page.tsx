import { notFound } from "next/navigation";
import SceneStage from "@/components/streaming/SceneStage";
import SceneView from "@/components/streaming/SceneView";
import {
  mergeScene,
  readStreamingContent,
  type SceneOverride,
} from "@/lib/streaming/content";
import { getScene } from "@/lib/streaming/scenes";

export const metadata = {
  title: "Cortina",
  robots: { index: false, follow: false },
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function ScenePage({
  params,
  searchParams,
}: {
  params: Promise<{ scene: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { scene: id } = await params;
  const query = await searchParams;
  const scene = getScene(id);
  if (!scene) notFound();
  const content = await readStreamingContent();
  const eyebrow = first(query.eyebrow);
  const badge = first(query.badge);
  const cta = first(query.cta);
  const countValue = first(query.countValue);
  const countUnit = first(query.countUnit);
  const progressCaption = first(query.progressCaption);
  const qrTargetRaw = first(query.qrTarget);
  const progressLiveRaw = first(query.progressLive);
  const progressPercentRaw = Number(first(query.progressPercent));
  const queryOverride: SceneOverride = {
    ...(eyebrow ? { eyebrow } : {}),
    ...(badge ? { badge } : {}),
    ...(cta ? { cta } : {}),
    ...(countValue ? { countValue } : {}),
    ...(countUnit ? { countUnit } : {}),
    ...(progressCaption ? { progressCaption } : {}),
    ...(qrTargetRaw === "live" || qrTargetRaw === "donate"
      ? { qrTarget: qrTargetRaw }
      : {}),
    ...(progressLiveRaw === "true" || progressLiveRaw === "false"
      ? { progressLive: progressLiveRaw === "true" }
      : {}),
    ...(Number.isFinite(progressPercentRaw) && first(query.progressPercent)
      ? { progressPercent: Math.max(0, Math.min(100, progressPercentRaw)) }
      : {}),
  };
  const merged = mergeScene(scene, { ...content.scenes[id], ...queryOverride });

  const fields = {
    title: first(query.title),
    subtitle: first(query.subtitle),
    note: first(query.note),
    guest: first(query.guest),
    guestRole: first(query.guestRole),
    returnAt: first(query.returnAt),
  };
  const render = first(query.render) === "1";

  return (
    <SceneStage lock={render}>
      <SceneView scene={merged} fields={fields} render={render} copy={content.copy} />
    </SceneStage>
  );
}
