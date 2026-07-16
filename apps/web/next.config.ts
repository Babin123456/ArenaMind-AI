import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
const connectSrcList = ["'self'", "http://localhost:8000", "ws://localhost:8000"];

if (apiUrl) {
  try {
    connectSrcList.push(new URL(apiUrl).origin);
  } catch (e) {
    // Ignore invalid URLs
  }
}
if (wsUrl) {
  try {
    const parsed = new URL(wsUrl);
    connectSrcList.push(parsed.origin);
  } catch (e) {
    connectSrcList.push(wsUrl);
  }
}

const connectSrc = Array.from(new Set(connectSrcList)).join(" ");

const config: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src ${connectSrc}; frame-ancestors 'none'`
          }
        ]
      }
    ];
  }
};

export default config;

