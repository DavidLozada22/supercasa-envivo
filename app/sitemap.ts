import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://supercasa.svgvisual.com";
  const lastModified = new Date("2026-11-18T00:00:00-05:00");
  return [
    { url: `${base}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${base}/envivo`, lastModified, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/donar`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/politica-de-datos`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terminos`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
