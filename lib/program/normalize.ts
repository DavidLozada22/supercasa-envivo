import type { ProgramBlock, ProgramSegment, ProgramState } from "./types";

const EVENT_DATES: Record<number, string> = {
  1: "2026-11-20",
  2: "2026-11-21",
  3: "2026-11-22",
};

const EXECUTIONS = ["EN VIVO", "PREGRABADO", "POR DEFINIR"];

function text(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function toClock(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour > 23 || minute > 59) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function dateFrom(dayNumber: number, clock: string): Date {
  return new Date(`${EVENT_DATES[dayNumber] ?? EVENT_DATES[1]}T${clock}:00-05:00`);
}

function nodeDate(dayNumber: number): Date {
  return new Date(`${EVENT_DATES[dayNumber] ?? EVENT_DATES[1]}T00:00:00-05:00`);
}

function iso(date: Date): string {
  const local = new Date(date.getTime() - 5 * 3_600_000);
  return `${local.toISOString().slice(0, 19)}-05:00`;
}

function minutesBetween(start: Date, end: Date): number {
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 60_000));
}

function normalizeExecution(value: unknown): string {
  const upper = text(value, 30).toUpperCase();
  const match = EXECUTIONS.find((item) => item === upper);
  return match ?? "POR DEFINIR";
}

export function normalizeProgram(
  blocksRaw: unknown,
  segmentsRaw: unknown,
): { program: ProgramState; errors: string[] } {
  const errors: string[] = [];
  const blockList = Array.isArray(blocksRaw) ? blocksRaw : [];
  const segmentList = Array.isArray(segmentsRaw) ? segmentsRaw : [];

  const seenBlocks = new Set<string>();
  const blocks: ProgramBlock[] = [];

  blockList.forEach((raw, index) => {
    const input = (raw ?? {}) as Record<string, unknown>;
    const numberMatch = String(input.number ?? "").match(/\d+/);
    const number = numberMatch ? numberMatch[0].padStart(2, "0").slice(-2) : "";
    const label = `Bloque ${number || index + 1}`;
    if (!number) {
      errors.push(`${label}: falta el número.`);
      return;
    }
    if (seenBlocks.has(number)) {
      errors.push(`${label}: el número está repetido.`);
      return;
    }
    seenBlocks.add(number);

    const dayNumber = Number(input.dayNumber);
    const safeDay = dayNumber >= 1 && dayNumber <= 3 ? Math.round(dayNumber) : 1;
    const startClock = toClock(input.startClock);
    const endClock = toClock(input.endClock);
    if (!startClock || !endClock) {
      errors.push(`${label}: la hora de inicio o fin no es válida.`);
      return;
    }
    const title = text(input.title);
    if (!title) errors.push(`${label}: falta el nombre del bloque.`);

    const startsAt = dateFrom(safeDay, startClock);
    const endsAt = dateFrom(safeDay, endClock);
    if (endsAt <= startsAt) endsAt.setDate(endsAt.getDate() + 1);

    blocks.push({
      number,
      label: text(input.label, 80) || `Bloque ${number}`,
      day: text(input.day, 40) || `Día ${safeDay}`,
      dayNumber: safeDay,
      schedule: `${startClock} - ${endClock}`,
      startClock,
      endClock,
      startsAt: iso(startsAt),
      endsAt: iso(endsAt),
      title: title || `Bloque ${number}`,
      pillar: text(input.pillar, 120),
      host: text(input.host, 160),
      guests: text(input.guests, 200),
      focus: text(input.focus, 240),
      challenge: text(input.challenge, 400),
      channels: text(input.channels, 240),
      minutes: 0,
      segmentCount: 0,
    });
  });

  const byNumber = new Map(blocks.map((block) => [block.number, block]));

  const seenSegments = new Set<string>();
  const segments: ProgramSegment[] = [];

  segmentList.forEach((raw, index) => {
    const input = (raw ?? {}) as Record<string, unknown>;
    const blockMatch = String(input.block ?? "").match(/\d+/);
    const blockNumber = blockMatch ? blockMatch[0].padStart(2, "0").slice(-2) : "";
    const block = byNumber.get(blockNumber);
    if (!block) {
      errors.push(`Segmento ${index + 1}: el bloque no existe.`);
      return;
    }

    const startClock = toClock(input.startClock);
    const endClock = toClock(input.endClock);
    if (!startClock || !endClock) {
      errors.push(`Segmento ${index + 1} del ${block.label}: la hora no es válida.`);
      return;
    }

    let id = text(input.id, 60);
    if (!id) id = `S${blockNumber}-N${index + 1}`;
    if (seenSegments.has(id)) {
      const base = id;
      let suffix = 2;
      while (seenSegments.has(`${base}-${suffix}`)) suffix += 1;
      id = `${base}-${suffix}`;
    }
    seenSegments.add(id);

    const name = text(input.name);
    if (!name) errors.push(`Segmento ${index + 1} del ${block.label}: falta el nombre.`);

    const afterMidnight = block.endClock <= block.startClock && startClock < block.endClock;
    const startDate = nodeDate(block.dayNumber);
    if (afterMidnight) startDate.setDate(startDate.getDate() + 1);
    const startsAt = new Date(`${startDate.toISOString().slice(0, 10)}T${startClock}:00-05:00`);
    const endsAt = new Date(`${startDate.toISOString().slice(0, 10)}T${endClock}:00-05:00`);
    if (endsAt <= startsAt) endsAt.setDate(endsAt.getDate() + 1);

    const execution = normalizeExecution(input.execution);
    segments.push({
      id,
      code: text(input.code, 60) || id,
      day: text(input.day, 40) || block.day,
      block: blockNumber,
      duration: minutesBetween(startsAt, endsAt),
      name: name || "Segmento sin nombre",
      execution,
      live: execution === "EN VIVO",
      type: text(input.type, 160),
      presenter: text(input.presenter, 160),
      file: text(input.file, 240),
      format: text(input.format, 120),
      platforms: text(input.platforms, 240),
      status: text(input.status, 80),
      notes: text(input.notes, 1500),
      done: input.done === true,
      startsAt: iso(startsAt),
      endsAt: iso(endsAt),
      clock: startClock,
      startClock,
      endClock,
    });
  });

  for (const segment of segments) {
    const block = byNumber.get(segment.block);
    if (!block) continue;
    block.minutes += segment.duration;
    block.segmentCount += 1;
  }

  return {
    program: {
      blocks,
      segments,
      updatedAt: "",
      updatedBy: "",
    },
    errors,
  };
}
