import type { ProgramBlock } from "./types";

export type AgendaRow = { time: string; title: string; host: string };

function shortTitle(value: string): string {
  return value.split(/[:·]/)[0]?.trim() || value;
}

function row(
  blocks: ProgramBlock[],
  numbers: string[],
  title?: string,
): AgendaRow {
  const selected = numbers
    .map((number) => blocks.find((block) => block.number === number))
    .filter((block): block is ProgramBlock => Boolean(block));
  if (selected.length === 0) return { time: "", title: title ?? "", host: "" };
  const first = selected[0];
  const last = selected[selected.length - 1];
  const hosts = [...new Set(selected.map((block) => block.host).filter(Boolean))];
  return {
    time: first.startClock + " - " + last.endClock,
    title: title ?? selected.map((block) => shortTitle(block.title)).join(" + "),
    host: hosts.join(" + "),
  };
}

export function buildAgendaRows(blocks: ProgramBlock[]): {
  "car3-s2": AgendaRow[];
  "car3-s3": AgendaRow[];
  "car3-s4": AgendaRow[];
} {
  return {
    "car3-s2": [row(blocks, ["01"]), row(blocks, ["02"])],
    "car3-s3": [
      row(blocks, ["03", "04"], "Desvelo Paranormal + Mañanero"),
      row(blocks, ["05"]),
      row(blocks, ["06", "07"], "Talentos Kavanah + Gala de los Sueños"),
    ],
    "car3-s4": [
      row(blocks, ["08", "09"], "Retro Arcade + Speedrun"),
      row(blocks, ["10", "11"], "Despertar Solidario + Creadores"),
      row(blocks, ["12"], "El Gran Cierre"),
    ],
  };
}
