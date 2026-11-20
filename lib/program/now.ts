import { readJson, writeJson } from "@/lib/streaming/store";

const KEY = "supercasa/program-now.json";

export type ProgramNow = {
  segmentId: string | null;
  updatedAt: string;
  updatedBy: string;
};

export const EMPTY_PROGRAM_NOW: ProgramNow = {
  segmentId: null,
  updatedAt: new Date(0).toISOString(),
  updatedBy: "",
};

export async function readProgramNow(): Promise<ProgramNow> {
  const value = await readJson<ProgramNow>(KEY);
  if (!value || typeof value !== "object") return EMPTY_PROGRAM_NOW;
  return {
    segmentId: typeof value.segmentId === "string" ? value.segmentId : null,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : EMPTY_PROGRAM_NOW.updatedAt,
    updatedBy: typeof value.updatedBy === "string" ? value.updatedBy : "",
  };
}

export async function writeProgramNow(
  value: Pick<ProgramNow, "segmentId" | "updatedBy">,
): Promise<ProgramNow> {
  const next: ProgramNow = {
    segmentId: value.segmentId,
    updatedAt: new Date().toISOString(),
    updatedBy: value.updatedBy,
  };
  await writeJson(KEY, next);
  return next;
}
