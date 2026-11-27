import { NextResponse } from "next/server";
import { readChapter } from "@/lib/chapters/store";
import { embedUrl } from "@/lib/chapters/format";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const chapter = await readChapter(slug);
  if (!chapter) {
    return NextResponse.json({ error: "Capítulo no encontrado." }, { status: 404 });
  }

  return NextResponse.json(
    { provider: chapter.provider, src: embedUrl(chapter) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
