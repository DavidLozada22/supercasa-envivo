"use client";

import { useEffect, useState } from "react";
import AdCanvasPreview from "@/components/admin/marketing/AdCanvasPreview";
import type { AdCreative, AdTheme, CreativeSlide, QrTarget } from "@/lib/marketing/campaign-kit";

const DESIGN_WIDTH = 360;

function designHeight(aspect: AdCreative["defaultAspect"]): number {
  if (aspect === "9:16") return 640;
  if (aspect === "1:1") return 360;
  return 450;
}

export default function CreativeStage({
  creative,
  slide,
  theme,
  aspect,
  showQr,
  qrTarget,
}: {
  creative: AdCreative;
  slide: CreativeSlide;
  theme: AdTheme;
  aspect: AdCreative["defaultAspect"];
  showQr?: boolean;
  qrTarget?: QrTarget;
}) {
  const height = designHeight(aspect);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const fit = () => {
      const next = Math.min(
        window.innerWidth / DESIGN_WIDTH,
        window.innerHeight / height,
      );
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [height]);

  return (
    <div className="creative-host fixed inset-0 overflow-hidden bg-transparent">
      {scale > 0 ? (
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: DESIGN_WIDTH * scale,
            height: height * scale,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              width: DESIGN_WIDTH,
              height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <AdCanvasPreview
              creative={creative}
              slide={slide}
              theme={theme}
              aspect={aspect}
              showQrOverride={showQr}
              qrTargetOverride={qrTarget}
              presentation
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
