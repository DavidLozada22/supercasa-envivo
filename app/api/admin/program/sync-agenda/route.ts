import { NextResponse } from "next/server";
import { buildAgendaRows } from "@/lib/program/agenda";
import { readProgram } from "@/lib/program/store";
import { readMarketingState, writeMarketingState } from "@/lib/marketing/store";
import { apiProgramEditor } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const CREATIVE_ID = "carousel-agenda-tentativa";

export async function POST() {
  const access = await apiProgramEditor();
  if (!access.ok) {
    return NextResponse.json(
      {
        error:
          access.status === 401
            ? "No autorizado."
            : "Solo el editor del programa puede sincronizar la agenda.",
      },
      { status: access.status },
    );
  }

  const program = await readProgram();
  const rows = buildAgendaRows(program.blocks);
  const state = await readMarketingState();
  const current = state.edits[CREATIVE_ID] ?? { slides: {} };

  const slides = { ...current.slides };
  for (const [slideId, scheduleRows] of Object.entries(rows)) {
    slides[slideId] = { ...(slides[slideId] ?? {}), scheduleRows };
  }

  const next = await writeMarketingState({
    edits: {
      ...state.edits,
      [CREATIVE_ID]: { ...current, slides },
    },
    updatedAt: "",
    updatedBy: access.username,
  });

  return NextResponse.json(
    {
      ok: true,
      creativeId: CREATIVE_ID,
      slides: Object.keys(rows),
      updatedBy: next.updatedBy,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
