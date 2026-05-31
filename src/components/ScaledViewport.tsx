"use client";

import { useLayoutEffect, useState } from "react";

const DESIGN_PX_W = 2560;
const DESIGN_PX_H = 1440;

export function ScaledViewport({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function update() {
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      setScale(Math.min(vw / DESIGN_PX_W, vh / DESIGN_PX_H));
    }
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className="svp-root">
      <div
        className="svp-stage"
        style={{
          width: "160rem",
          height: "90rem",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
