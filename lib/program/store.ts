import { readJson, writeJson } from "@/lib/streaming/store";
import blocksJson from "./blocks.json";
import segmentsJson from "./segments.json";
import { normalizeProgram } from "./normalize";
import type { ProgramBlock, ProgramSegment, ProgramState } from "./types";

const KEY = "supercasa/program.json";

export class ProgramValidationError extends Error {
  errors: string[];

  constructor(errors: string[]) {
    super("El programa tiene datos inválidos.");
    this.name = "ProgramValidationError";
    this.errors = errors;
  }
}

function baseProgram(): ProgramState {
  const { program } = normalizeProgram(blocksJson, segmentsJson);
  return {
    ...program,
    updatedAt: new Date(0).toISOString(),
    updatedBy: "JSON base",
  };
}

export async function readProgram(): Promise<ProgramState> {
  const stored = await readJson<ProgramState>(KEY);
  if (!stored || !Array.isArray(stored.blocks) || !Array.isArray(stored.segments)) {
    return baseProgram();
  }

  const { program } = normalizeProgram(stored.blocks, stored.segments);
  return {
    ...program,
    updatedAt: typeof stored.updatedAt === "string" ? stored.updatedAt : "",
    updatedBy: typeof stored.updatedBy === "string" ? stored.updatedBy : "",
  };
}

export async function writeProgram(
  blocks: ProgramBlock[],
  segments: ProgramSegment[],
  updatedBy: string,
): Promise<ProgramState> {
  const { program, errors } = normalizeProgram(blocks, segments);
  if (errors.length > 0) {
    throw new ProgramValidationError(errors);
  }

  const next: ProgramState = {
    ...program,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await writeJson(KEY, next);
  return next;
}

export async function resetProgram(updatedBy: string): Promise<ProgramState> {
  const base = baseProgram();
  const next: ProgramState = {
    ...base,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  await writeJson(KEY, next);
  return next;
}
