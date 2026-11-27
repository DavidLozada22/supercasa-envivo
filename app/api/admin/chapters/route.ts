import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { apiRole } from "@/lib/permissions";
import {
  ChapterValidationError,
  deleteChapter,
  readAllChapters,
  saveChapter,
} from "@/lib/chapters/store";
import type { ChapterInput } from "@/lib/chapters/types";

export const dynamic = "force-dynamic";

const ROLES = ["admin", "editor", "marketing"] as const;

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/capitulos");
  if (slug) revalidatePath(`/capitulos/${slug}`);
}

export async function GET() {
  const access = await apiRole([...ROLES]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "No tienes permiso." },
      { status: access.status },
    );
  }

  const chapters = await readAllChapters();
  return NextResponse.json(
    { chapters },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const access = await apiRole([...ROLES]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "No tienes permiso." },
      { status: access.status },
    );
  }

  let body: ChapterInput;
  try {
    body = (await request.json()) as ChapterInput;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const session = await getSession();
  try {
    const chapter = await saveChapter(body, session?.username ?? "panel");
    refresh(chapter.slug);
    return NextResponse.json(
      { chapter },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ChapterValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "No se pudo guardar el capítulo. Revisa la conexión con la base." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const access = await apiRole([...ROLES]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "No tienes permiso." },
      { status: access.status },
    );
  }

  let body: { id?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Falta el capítulo." }, { status: 400 });

  const removed = await deleteChapter(id);
  if (!removed) return NextResponse.json({ error: "Ese capítulo no existe." }, { status: 404 });

  refresh();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
