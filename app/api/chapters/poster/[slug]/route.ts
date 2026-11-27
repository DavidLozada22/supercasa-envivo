import { NextResponse } from "next/server";
import { readAllChapters } from "@/lib/chapters/store";

export const dynamic = "force-dynamic";

const FALLBACK = "/og-image.jpg";
const CACHE = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const chapters = await readAllChapters();
  const chapter = chapters.find((item) => item.slug === slug);
  if (!chapter) {
    return NextResponse.redirect(new URL(FALLBACK, request.url));
  }

  if (chapter.posterUrl) {
    return NextResponse.redirect(new URL(chapter.posterUrl, request.url));
  }

  if (chapter.provider !== "drive") {
    return NextResponse.redirect(new URL(FALLBACK, request.url));
  }

  const target = `https://drive.google.com/thumbnail?id=${encodeURIComponent(chapter.providerId)}&sz=w1280`;

  try {
    const response = await fetch(target, { redirect: "follow" });
    if (!response.ok || !response.body) {
      return NextResponse.redirect(new URL(FALLBACK, request.url));
    }
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": CACHE,
      },
    });
  } catch {
    return NextResponse.redirect(new URL(FALLBACK, request.url));
  }
}
