// Optimiza los PNG de cortinas y overlays para que pesen menos al descargarlos.
// Usa sharp, que viene con Next. Corre: node scripts/optimize-cortinas.mjs
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import JSZip from "jszip";

const ROOTS = ["public/cortinas", "assets/obs/cortinas", "assets/obs/overlays"];
const ZIP_SOURCE = "public/cortinas";
const ZIP_FILE = "public/cortinas/cortinas-supercasa.zip";

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) files.push(full);
  }
  return files;
}

async function optimize(file) {
  const before = (await fs.stat(file)).size;
  if (before < 120 * 1024) return { file, before, after: before, saved: 0 };

  const temp = `${file}.tmp`;
  await sharp(file)
    .png({ palette: true, quality: 85, effort: 7, compressionLevel: 9 })
    .toFile(temp);

  const after = (await fs.stat(temp)).size;
  if (after < before) {
    await fs.rename(temp, file);
  } else {
    await fs.unlink(temp);
  }
  return { file, before, after: Math.min(before, after), saved: Math.max(0, before - after) };
}

async function buildZip() {
  const zip = new JSZip();
  const entries = await fs.readdir(ZIP_SOURCE, { withFileTypes: true });
  const pngs = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => entry.name)
    .sort();

  for (const name of pngs) {
    const buffer = await fs.readFile(path.join(ZIP_SOURCE, name));
    zip.file(name, buffer);
  }

  const blob = await zip.generateAsync({ type: "nodebuffer", compression: "STORE" });
  await fs.writeFile(ZIP_FILE, blob);
  return { files: pngs.length, bytes: blob.length };
}

const files = [];
for (const root of ROOTS) {
  try {
    files.push(...(await walk(root)));
  } catch {
    // Carpeta opcional.
  }
}

let beforeTotal = 0;
let afterTotal = 0;
for (const file of files) {
  const result = await optimize(file);
  beforeTotal += result.before;
  afterTotal += result.after;
  if (result.saved > 0) {
    const pct = Math.round((result.saved / result.before) * 100);
    console.log(
      `${path.relative(process.cwd(), file)}: ${Math.round(result.before / 1024)} KB -> ${Math.round(
        result.after / 1024,
      )} KB (${pct}% menos)`,
    );
  }
}

const zip = await buildZip();
console.log(
  `\nTotal: ${(beforeTotal / 1024 / 1024).toFixed(1)} MB -> ${(afterTotal / 1024 / 1024).toFixed(
    1,
  )} MB`,
);
console.log(
  `ZIP: ${zip.files} PNG en ${(zip.bytes / 1024 / 1024).toFixed(1)} MB (${ZIP_FILE})`,
);
