"use client";

import { useEffect, useState } from "react";
import SceneStage from "./SceneStage";
import SceneView from "./SceneView";
import { mergeScene, type StreamingContent } from "@/lib/streaming/merge";
import { getScene } from "@/lib/streaming/scenes";
import type { OnAirState } from "@/lib/streaming/types";

export default function OnAirStage({
  initial,
  token,
}: {
  initial: OnAirState;
  token: string;
}) {
  const [state, setState] = useState<OnAirState>(initial);
  const [content, setContent] = useState<StreamingContent | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const response = await fetch(
          `/api/streaming/state?k=${encodeURIComponent(token)}`,
          { cache: "no-store" },
        );
        if (!response.ok) return;
        const body = (await response.json()) as OnAirState;
        if (alive) setState(body);
      } catch {
        // Se conserva la ultima escena valida.
      }
    };

    const id = setInterval(load, 2000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [token]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const response = await fetch("/api/streaming/content", { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as StreamingContent;
        if (alive) setContent(body);
      } catch {
        // Se conserva el ultimo contenido valido.
      }
    };

    void load();
    const id = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const base = getScene(state.sceneId) ?? getScene("ya-volvemos");
  const scene = base ? mergeScene(base, content?.scenes[state.sceneId]) : null;
  if (!scene) return null;

  return (
    <SceneStage>
      <SceneView scene={scene} fields={state.fields} copy={content?.copy} />
    </SceneStage>
  );
}
