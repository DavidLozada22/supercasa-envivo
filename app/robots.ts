import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/donar/gracias"],
      },
    ],
    sitemap: "https://supercasa.svgvisual.com/sitemap.xml",
    host: "https://supercasa.svgvisual.com",
  };
}
