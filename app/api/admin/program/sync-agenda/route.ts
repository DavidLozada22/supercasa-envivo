import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { buildAgendaRows } from "@/lib/program/agenda";
import { readProgram } from "@/lib/program/store";
import { readMarketingState, writeMarketingState } from "@/lib/marketing/store";
import { apiRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const ALLOWED = ["admin", "editor", "marketing"] as const;
const CREATIVE_ID = "carousel-agenda-tentativa";

export async function POST() {
  const access = await apiRole([...ALLOWED]);
  if (!access.ok) {
    return NextResponse.json(
      { error: access.status === 401 ? "No autorizado." : "Sin permiso." },
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

  const session = await getSession();
  const next = await writeMarketingState({
    edits: {
      ...state.edits,
      [CREATIVE_ID]: { ...current, slides },
    },
    updatedAt: "",
    updatedBy: session?.username ?? "",
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
