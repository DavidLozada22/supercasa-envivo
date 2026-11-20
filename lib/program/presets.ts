import blocksJson from "./blocks.json";
import segmentsJson from "./segments.json";
import type { ProgramBlock, ProgramSegment } from "./types";
import { scenePath } from "@/lib/streaming/links";
import { getScene } from "@/lib/streaming/scenes";
import type { SceneOverride } from "@/lib/streaming/merge";

export type PresetKind = "block" | "mosca" | "next" | "current";

export type ProgramPreset = {
  id: string;
  kind: PresetKind;
  label: string;
  title: string;
  detail: string;
  block: string;
  day: string;
  clock: string;
  startsAt: string;
  endsAt: string;
  path: string;
  guest?: string;
  guestRole?: string;
};

export const PROGRAM_BLOCKS = blocksJson as ProgramBlock[];
const SEGMENTS = segmentsJson as ProgramSegment[];

const GENERIC_PRESENTER =
  /^(invitados?\s+especiales?|por confirmar|n\/a|ninguno|todo el equipo)$/i;

function splitPeople(value: string): string[] {
  return value
    .split(/\s*(?:\+|,|\/|\by\b)\s*/i)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !GENERIC_PRESENTER.test(item));
}

function canonical(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bdeivid\b/g, "vikingo")
    .replace(/\bdavid\b/g, "vikingo")
    .trim();
}

function shortTitle(title: string): string {
  const first = title.split(/[:·]/)[0]?.trim();
  return first || title;
}

function roleFor(
  segment: ProgramSegment,
  block: ProgramBlock,
  person: string,
): string {
  const type = segment.type.toLowerCase();
  const hosts = splitPeople(block.host).map(canonical);
  const who = canonical(person);
  if (type.includes("conducción") || type.includes("conduccion")) return "Conducción";
  if (hosts.some((host) => who === host || who.includes(host) || host.includes(who))) {
    return "Conducción";
  }
  if (type.includes("entrevista") || type.includes("invitado")) return "Invitado";
  return "Participante";
}

function blockScene(block: ProgramBlock) {
  return getScene(`bloque-${block.number}`);
}

function pathFor(sceneId: string, override?: SceneOverride): string {
  const scene = getScene(sceneId);
  if (!scene) return `/pantalla/${sceneId}`;
  return scenePath(scene, override);
}

function buildPresets(): ProgramPreset[] {
  const presets: ProgramPreset[] = [];

  for (const block of PROGRAM_BLOCKS) {
    const scene = blockScene(block);
    if (!scene) continue;
    presets.push({
      id: `block-${block.number}`,
      kind: "block",
      label: `Bloque ${block.number}`,
      title: `${block.label} · ${shortTitle(block.title)}`,
      detail: `${block.day} · ${block.schedule} · ${block.host || "Conducción por confirmar"}`,
      block: block.number,
      day: block.day,
      clock: block.startClock,
      startsAt: block.startsAt,
      endsAt: block.endsAt,
      path: scenePath(scene),
    });
  }

  for (const block of PROGRAM_BLOCKS) {
    const scene = getScene("estamos-en");
    if (!scene) continue;
    const override: SceneOverride = {
      eyebrow: "En este momento",
      title: `Estamos en el ${block.label}`,
      subtitle: block.title,
      note: `${block.day} · ${block.schedule}`,
    };
    presets.push({
      id: `current-${block.number}`,
      kind: "current",
      label: `Estamos en · Bloque ${block.number}`,
      title: `Estamos en el ${block.label}`,
      detail: block.title,
      block: block.number,
      day: block.day,
      clock: block.startClock,
      startsAt: block.startsAt,
      endsAt: block.endsAt,
      path: scenePath(scene, override),
    });
  }

  const seenMoscas = new Set<string>();
  for (const segment of SEGMENTS) {
    const block = PROGRAM_BLOCKS.find((item) => item.number === segment.block);
    if (!block) continue;

    for (const person of splitPeople(segment.presenter)) {
      const key = `${block.number}:${canonical(person)}`;
      if (seenMoscas.has(key)) continue;
      seenMoscas.add(key);
      const role = roleFor(segment, block, person);
      const override: SceneOverride = { guest: person, guestRole: role };
      presets.push({
        id: `mosca-${block.number}-${canonical(person).replace(/\s+/g, "-")}`,
        kind: "mosca",
        label: `Mosca · ${person}`,
        title: person,
        detail: `${role} · ${segment.name} · ${segment.clock}`,
        block: block.number,
        day: block.day,
        clock: segment.clock,
        startsAt: segment.startsAt,
        endsAt: segment.endsAt,
        guest: person,
        guestRole: role,
        path: pathFor("lower-third", override),
      });
    }
  }

  for (const segment of SEGMENTS) {
    if (!segment.name) continue;
    const block = PROGRAM_BLOCKS.find((item) => item.number === segment.block);
    if (!block) continue;
    const scene = getScene("ya-viene");
    if (!scene) continue;
    const presenter = splitPeople(segment.presenter).join(" y ");
    const override: SceneOverride = {
      eyebrow: "Ya viene",
      title: segment.name,
      subtitle: block.title,
      note: presenter ? `Con ${presenter}.` : `${block.day} · ${segment.clock}`,
    };
    presets.push({
      id: `next-${segment.id}`,
      kind: "next",
      label: `Ya viene · ${segment.name}`,
      title: segment.name,
      detail: `${segment.clock} · Bloque ${block.number} · ${segment.duration} min`,
      block: block.number,
      day: block.day,
      clock: segment.clock,
      startsAt: segment.startsAt,
      endsAt: segment.endsAt,
      path: scenePath(scene, override),
    });
  }

  return presets.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

export const PROGRAM_PRESETS: ProgramPreset[] = buildPresets();

export const PRESET_KINDS: Array<{ id: "all" | PresetKind; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "mosca", label: "Moscas" },
  { id: "next", label: "Ya viene" },
  { id: "current", label: "Estamos en" },
  { id: "block", label: "Cortinas de bloque" },
];
