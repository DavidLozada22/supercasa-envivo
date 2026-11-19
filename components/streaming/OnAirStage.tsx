"use client";

import { useEffect, useState } from "react";
import SceneStage from "./SceneStage";
import SceneView from "./SceneView";
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

  const scene = getScene(state.sceneId) ?? getScene("ya-volvemos");
  if (!scene) return null;

  return (
    <SceneStage>
      <SceneView scene={scene} fields={state.fields} />
    </SceneStage>
  );
}
