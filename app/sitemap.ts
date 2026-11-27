import type { MetadataRoute } from "next";
import { readChapters } from "@/lib/chapters/store";

export const dynamic = "force-dynamic";

const BASE = "https://supercasa.svgvisual.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date("2026-11-18T00:00:00-05:00");

  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/envivo`, lastModified, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/capitulos`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/donar`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/politica-de-datos`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terminos`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const chapters = await readChapters();
    for (const chapter of chapters) {
      routes.push({
        url: `${BASE}/capitulos/${chapter.slug}`,
        lastModified: chapter.updatedAt ? new Date(chapter.updatedAt) : lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Si la base no responde, el sitemap conserva las rutas fijas.
  }

  return routes;
}
