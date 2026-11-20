import * as XLSX from "xlsx";
import { buildPresets } from "./presets";
import type { ProgramState } from "./types";

export function buildProgramWorkbook(program: ProgramState): XLSX.WorkBook {
  const programRows = program.segments.map((segment) => {
    const block = program.blocks.find((item) => item.number === segment.block);
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
      Hecho: segment.done ? "Sí" : "",
      Notas: segment.notes,
    };
  });

  const blockRows = program.blocks.map((block) => ({
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

  const presets = buildPresets(program.blocks, program.segments);
  const moscaRows = presets
    .filter((preset) => preset.kind === "mosca")
    .map((preset) => ({
      Bloque: preset.block,
      Nombre: preset.guest ?? preset.title,
      Cargo: preset.guestRole ?? "",
      Hora: preset.clock,
      Segmento: preset.detail,
      "Por confirmar": preset.pending ? "Sí" : "",
      Link: `https://supercasa.svgvisual.com${preset.path}`,
    }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(programRows), "Programa");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(blockRows), "Bloques");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(moscaRows), "Moscas");
  return workbook;
}
