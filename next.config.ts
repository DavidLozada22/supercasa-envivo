import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/plan", destination: "/programa", permanent: false },
      { source: "/cronograma", destination: "/programa", permanent: false },
      { source: "/respuestas-rapidas", destination: "/respuestas", permanent: false },
      {
        source: "/capitulos/hilos-invisibles-paty",
        destination: "/capitulos/eres-unico-paty",
        permanent: true,
      },
      {
        source: "/capitulos/hilos-invisibles-carlos-alberto",
        destination: "/capitulos/eres-unico-carlos-alberto",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/programa",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/programa/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/respuestas",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/respuestas/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
