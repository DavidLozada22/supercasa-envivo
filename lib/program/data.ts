import blocksJson from "./blocks.json";
import segmentsJson from "./segments.json";
import type { ProgramBlock, ProgramSegment } from "./types";

export const PROGRAM_BLOCKS = blocksJson as ProgramBlock[];
export const PROGRAM_SEGMENTS = segmentsJson as ProgramSegment[];

export const PROGRAM_DAYS = [
  { number: 1, label: "Vie 20 nov", short: "Vie 20" },
  { number: 2, label: "Sáb 21 nov", short: "Sáb 21" },
  { number: 3, label: "Dom 22 nov", short: "Dom 22" },
];
