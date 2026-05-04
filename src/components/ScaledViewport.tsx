"use client";

import { useLayoutEffect, useState } from "react";

const DESIGN_PX_W = 2560;
const DESIGN_PX_H = 1440;

export function ScaledViewport({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function update() {
      setScale(
        Math.min(window.innerWidth / DESIGN_PX_W, window.innerHeight / DESIGN_PX_H),
      );
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="svp-root">
      <div
        className="svp-stage"
        style={{
          width: "160rem",
          height: "90rem",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
