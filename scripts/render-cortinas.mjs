#!/usr/bin/env node
/*
 * Genera los PNG 1920x1080 de todas las cortinas y un ZIP con todo.
 * Requiere el servidor de Next corriendo y Google Chrome instalado.
 *
 *   npm run cortinas
 */

import { spawnSync } from "node:child_process";
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.RENDER_BASE || "http://localhost:3100";
const OUT_DIR = path.resolve("public/cortinas");
const ZIP = path.join(OUT_DIR, "cortinas-supercasa.zip");

await mkdir(OUT_DIR, { recursive: true });

// Limpia PNG viejos para que el ZIP solo tenga las escenas actuales.
for (const file of await readdir(OUT_DIR)) {
  if (file.endsWith(".png")) await unlink(path.join(OUT_DIR, file));
}

const response = await fetch(`${BASE}/api/streaming/scenes`);
if (!response.ok) {
  console.error("No pude leer la lista de escenas. Corre el servidor en", BASE);
  process.exit(1);
}
const scenes = await response.json();

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--font-render-hinting=none",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

let failed = 0;
for (const scene of scenes) {
  const url = `${BASE}/pantalla/${scene.id}?render=1`;
  const out = path.join(OUT_DIR, `${scene.id}.png`);
  try {
    try {
      await fetch(url);
    } catch {
      // La compilacion de la ruta puede tardar; Puppeteer igual la espera.
    }
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await page.screenshot({
      path: out,
      type: "png",
      omitBackground: scene.kind === "overlay",
    });
    const info = await stat(out);
    if (info.size < 8_000) throw new Error(`PNG sospechoso (${info.size} bytes)`);
    console.log(`${scene.id} ${Math.round(info.size / 1024)} KB`);
  } catch (error) {
    failed += 1;
    console.error(scene.id, error.message);
  }
}

await browser.close();

// ZIP con todas las cortinas listas.
const pngs = (await readdir(OUT_DIR)).filter((file) => file.endsWith(".png")).sort();
if (pngs.length > 0) {
  const zipped = spawnSync(
    "zip",
    ["-j", "-q", ZIP, ...pngs.map((file) => path.join(OUT_DIR, file))],
    { stdio: "ignore" },
  );
  if (zipped.status === 0) {
    const info = await stat(ZIP);
    console.log(`ZIP ${pngs.length} cortinas · ${Math.round(info.size / 1024 / 1024)} MB`);
  } else {
    console.warn("No se pudo crear el ZIP. Verifica que el comando zip exista.");
  }
}

console.log(`Listas ${scenes.length - failed} de ${scenes.length} cortinas en public/cortinas`);
process.exit(failed > 0 ? 1 : 0);
