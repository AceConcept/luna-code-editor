import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

function buildFrameAncestors(): string {
  const raw = process.env.WAYPOINT_FRAME_ANCESTORS ?? "";
  const defaults = [
    "'self'",
    "https://*.workers.dev",
    "https://*.pages.dev",
    "https://*.vercel.app",
  ];
  const ancestors = [
    ...defaults,
    ...raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  ];

  // Deduplicate while preserving order.
  return [...new Set(ancestors)].join(" ");
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
