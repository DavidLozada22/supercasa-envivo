"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function LiveThumb({
  designWidth,
  designHeight,
  className = "",
  children,
}: {
  designWidth: number;
  designHeight: number;
  className?: string;
  children: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "260px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const node = boxRef.current;
    if (!node) return;

    const update = () => {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (!width || !height) return;
      setScale(Math.min(width / designWidth, height / designHeight));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, designWidth, designHeight]);

  return (
    <div
      ref={boxRef}
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {visible && scale > 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: designWidth * scale,
              height: designHeight * scale,
            }}
          >
            <div
              style={{
                width: designWidth,
                height: designHeight,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-slate-200/70" aria-hidden="true" />
      )}
    </div>
  );
}
