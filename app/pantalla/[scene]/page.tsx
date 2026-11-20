import { notFound } from "next/navigation";
import SceneStage from "@/components/streaming/SceneStage";
import SceneView from "@/components/streaming/SceneView";
import { mergeScene, readStreamingContent } from "@/lib/streaming/content";
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
  const merged = mergeScene(scene, content.scenes[id]);

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
      <SceneView scene={merged} fields={fields} render={render} />
    </SceneStage>
  );
}
