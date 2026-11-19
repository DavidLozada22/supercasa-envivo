"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function SceneStage({
  children,
  lock = false,
}: {
  children: ReactNode;
  lock?: boolean;
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (lock) return;
    const fit = () => {
      const next = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [lock]);

  useEffect(() => {
    if (!lock) return;
    const style = document.createElement("style");
    style.textContent = "nextjs-portal{display:none!important}";
    document.head.appendChild(style);
    return () => style.remove();
  }, [lock]);

  return (
    <div className="scene-host">
      <div className="scene-stage" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
