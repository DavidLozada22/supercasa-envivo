#!/usr/bin/env node
/*
 * Organiza los assets de OBS y genera el manifiesto para otros agentes.
 *
 *   npm run obs:assets
 *
 * Requiere que los PNG estén en public/cortinas y la música en public/audio.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "assets/obs");
const PNG_DIR = path.join(ROOT, "public/cortinas");
const AUDIO_DIR = path.join(ROOT, "public/audio");

const blocks = JSON.parse(readFileSync(path.join(ROOT, "lib/program/blocks.json"), "utf8"));
const scenesSource = readFileSync(path.join(ROOT, "lib/streaming/scenes.ts"), "utf8");

function shortTitle(title) {
  return title.split(/[:·]/)[0]?.trim() || title;
}

const labels = {};
const labelRe = /id:\s*"([a-z0-9-]+)"[\s\S]{0,220}?label:\s*"([^"]+)"/g;
let match;
while ((match = labelRe.exec(scenesSource))) {
  labels[match[1]] = match[2];
}
for (const block of blocks) {
  labels[`bloque-${block.number}`] = `Bloque ${block.number} · ${shortTitle(block.title)}`;
}

const overlayFolders = {
  "lower-third": "01-lower-third",
  meta: "02-meta",
  reloj: "03-reloj",
  "en-vivo": "04-en-vivo",
  donacion: "05-donacion",
  "en-vivo-qr": "06-en-vivo-qr",
  mosca: "07-mosca",
  "fondo-live": "08-fondo-live",
  "marco-live": "09-marco-live",
};

function fullCategory(id) {
  if (id.startsWith("empezamos-")) return "01-cuentas-regresivas";
  if (id.startsWith("horas-")) return "02-horas";
  if (id === "casa" || id.startsWith("casa-")) return "03-casa";
  if (id.startsWith("bloque-")) return "04-bloques";
  if (["casi-terminamos", "gracias", "gracias-donaciones"].includes(id)) return "05-cierre";
  if (["ya-volvemos", "ajuste-tecnico", "ya-viene", "estamos-en", "personalizada"].includes(id)) {
    return "06-basicas";
  }
  return "07-generales";
}

rmSync(path.join(OUT, "cortinas"), { recursive: true, force: true });
rmSync(path.join(OUT, "overlays"), { recursive: true, force: true });
mkdirSync(path.join(OUT, "music"), { recursive: true });

const pngs = readdirSync(PNG_DIR).filter((file) => file.endsWith(".png")).sort();
const scenes = [];

for (const file of pngs) {
  const id = file.replace(/\.png$/, "");
  const overlay = Boolean(overlayFolders[id]);
  const category = overlay
    ? `overlays/${overlayFolders[id]}`
    : `cortinas/${fullCategory(id)}`;
  const targetDir = path.join(OUT, category);
  mkdirSync(targetDir, { recursive: true });
  cpSync(path.join(PNG_DIR, file), path.join(targetDir, file));

  scenes.push({
    id,
    label: labels[id] ?? id,
    kind: overlay ? "overlay" : "full",
    category,
    file: `assets/obs/${category}/${file}`,
    pngUrl: `https://supercasa.svgvisual.com/cortinas/${file}`,
    obsUrl: `https://supercasa.svgvisual.com/pantalla/${id}`,
    transparent: overlay,
    use: overlay ? "overlay" : "full-screen",
    notes: overlay
      ? "PNG con transparencia. En OBS usa fuente de navegador 1920x1080 o fuente de imagen."
      : "Cortina 1920x1080. El PNG es la versión base; para textos dinámicos usa obsUrl.",
  });
}

const musicFiles = [
  {
    file: "cortina.mp3",
    role: "actual",
    mood: "cortina de espera",
    option: null,
    source: "Música actual del sitio para las cortinas de espera.",
  },
  {
    file: "kornevmusic-upbeat-happy-corporate-487426.mp3",
    role: "opción",
    mood: "corporativa, alegre y optimista",
    option: 1,
    source: "Archivo entregado por el equipo.",
  },
  {
    file: "nastelbom-corporate-606705.mp3",
    role: "opción",
    mood: "corporativa y cálida",
    option: 2,
    source: "Archivo entregado por el equipo.",
  },
  {
    file: "atlasaudio-corporate-business-635581.mp3",
    role: "opción",
    mood: "corporativa y motivadora",
    option: 3,
    source: "Archivo entregado por el equipo.",
  },
];

const music = [];
for (const item of musicFiles) {
  const source = path.join(AUDIO_DIR, item.file);
  if (!existsSync(source)) {
    console.warn(`Falta ${source}. Se omite del manifiesto.`);
    continue;
  }
  cpSync(source, path.join(OUT, "music", item.file));
  music.push({
    ...item,
    path: `assets/obs/music/${item.file}`,
    publicUrl: `https://supercasa.svgvisual.com/audio/${encodeURIComponent(item.file)}`,
    loop: true,
    note: "Usar siempre en loop. No cortar el final. En OBS activa Loop en la fuente de medios.",
  });
}

const manifest = {
  project: "La Supercasa 48H",
  repository: "https://github.com/DavidLozada22/supercasa-envivo",
  productionBase: "https://supercasa.svgvisual.com",
  updatedAt: new Date().toISOString().slice(0, 10),
  rules: [
    "Toda la música va en loop. No usar one-shot ni cortar el final del archivo.",
    "En OBS usa una fuente de medios para la música, con Loop activo y sin reiniciar al cambiar de escena.",
    "Las cortinas de pantalla completa van a 1920x1080.",
    "Los overlays son PNG con transparencia. Para texto dinámico usa la URL obsUrl.",
    "El PNG es la versión base. Si hay textos guardados en el panel, la URL obsUrl los muestra.",
  ],
  music,
  scenes,
};

writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Escenas: ${scenes.length}`);
console.log(`Música: ${music.length}`);
console.log(`Manifiesto: ${path.join(OUT, "manifest.json")}`);
