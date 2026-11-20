import type { Metadata } from "next";
import PublicProgram from "@/components/program/PublicProgram";
import { readProgramNow } from "@/lib/program/now";
import { readProgram } from "@/lib/program/store";
import type { PublicProgramSegment } from "@/lib/program/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programa 48H · La Supercasa",
  description: "Programa interno del equipo para la maratón 48H de La Supercasa.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "Programa 48H · La Supercasa",
    description: "Programa interno del equipo para la maratón 48H.",
    images: ["/og-image.jpg"],
  },
};

export default async function ProgramPage() {
  const [marker, program] = await Promise.all([readProgramNow(), readProgram()]);
  const segments: PublicProgramSegment[] = program.segments.map((segment) => ({
    id: segment.id,
    code: segment.code,
    block: segment.block,
    name: segment.name,
    startClock: segment.startClock,
    endClock: segment.endClock,
    startsAt: segment.startsAt,
    endsAt: segment.endsAt,
    duration: segment.duration,
    live: segment.live,
    type: segment.type,
    presenter: segment.presenter,
    status: segment.status,
    notes: segment.notes,
  }));
  return (
    <PublicProgram
      blocks={program.blocks}
      segments={segments}
      initialMarker={marker}
      serverNow={new Date().toISOString()}
    />
  );
}
