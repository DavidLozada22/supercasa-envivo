#!/usr/bin/env node
/*
 * Genera el Excel limpio del programa para el equipo.
 *
 *   npm run programa:excel
 */

import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

const ROOT = process.cwd();
const blocks = JSON.parse(readFileSync(path.join(ROOT, "lib/program/blocks.json"), "utf8"));
const segments = JSON.parse(readFileSync(path.join(ROOT, "lib/program/segments.json"), "utf8"));

const GENERIC = /^(invitados?\s+especiales?|por confirmar|n\/a|ninguno|todo el equipo)$/i;

function splitPeople(value) {
  return String(value || "")
    .split(/\s*(?:\+|,|\/|\by\b)\s*/i)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !GENERIC.test(item));
}

function canonical(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\bdeivid\b/g, "vikingo")
    .replace(/\bdavid\b/g, "vikingo")
    .trim();
}

function lowerThird(guest, role) {
  const params = new URLSearchParams({ guest, guestRole: role });
  return `https://supercasa.svgvisual.com/pantalla/lower-third?${params.toString()}`;
}

const program = segments.map((segment) => {
  const block = blocks.find((item) => item.number === segment.block);
  return {
    Día: block?.day ?? segment.day,
    Bloque: block ? `${block.label} · ${block.title}` : segment.block,
    "Hora inicio": segment.startClock,
    "Hora fin": segment.endClock,
    "Duración (min)": segment.duration,
    Segmento: segment.name,
    Ejecución: segment.execution,
    Tipo: segment.type,
    Responsable: segment.presenter,
    Estado: segment.status,
    Notas: segment.notes,
  };
});

const blockRows = blocks.map((block) => ({
  Bloque: block.label,
  Día: block.day,
  Horario: block.schedule,
  Título: block.title,
  Conducción: block.host,
  Invitados: block.guests,
  Enfoque: block.focus,
  Reto: block.challenge,
  Segmentos: block.segmentCount,
  Minutos: block.minutes,
}));

const moscaMap = new Map();
function addMosca(block, person, role, source, clock) {
  const key = `${block.number}:${canonical(person)}`;
  if (moscaMap.has(key)) return;
  moscaMap.set(key, {
    Bloque: block.label,
    Nombre: person,
    Cargo: role,
    Hora: clock,
    Referencia: source,
    Link: lowerThird(person, role),
  });
}

for (const block of blocks) {
  for (const person of splitPeople(block.host)) {
    addMosca(block, person, "Conducción", `${block.label} · ${block.schedule}`, block.startClock);
  }
}
for (const segment of segments) {
  if (!segment.live) continue;
  const block = blocks.find((item) => item.number === segment.block);
  if (!block) continue;
  const hosts = splitPeople(block.host).map(canonical);
  for (const person of splitPeople(segment.presenter)) {
    const who = canonical(person);
    const role = hosts.some((host) => who.includes(host) || host.includes(who))
      ? "Conducción"
      : "Invitado";
    addMosca(block, person, role, `${segment.name} · ${segment.clock}`, segment.clock);
  }
}
const moscas = [...moscaMap.values()];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(program), "Programa");
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(blockRows), "Bloques");
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(moscas), "Moscas");

const output = path.join(ROOT, "public/programa/programa-48h.xlsx");
mkdirSync(path.dirname(output), { recursive: true });
XLSX.writeFile(workbook, output);

console.log(`Programa: ${program.length} filas`);
console.log(`Bloques: ${blockRows.length}`);
console.log(`Moscas: ${moscas.length}`);
console.log(`Archivo: ${output}`);
