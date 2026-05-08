import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

function buildFrameAncestors(): string {
  const raw = process.env.WAYPOINT_FRAME_ANCESTORS ?? "";
  const ancestors = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  // Keep self by default so same-origin embeds continue to work.
  if (!ancestors.includes("'self'")) {
    ancestors.unshift("'self'");
  }

  return ancestors.join(" ");
}

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    const frameAncestors = buildFrameAncestors();
    return [
      {
        source: "/:path*",
        headers: [
          // Do not send X-Frame-Options: DENY, use CSP frame-ancestors instead.
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${frameAncestors};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
