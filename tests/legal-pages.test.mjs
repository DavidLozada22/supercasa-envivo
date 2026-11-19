import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("las páginas legales recuperan el contenido original y advierten que es un borrador", async () => {
  for (const [route, excerpt] of [
    ["politica-de-datos", "Ley 1581 de 2012"],
    ["terminos", "El Plan Padrino mensual se puede cancelar"],
  ]) {
    const source = await readFile(`app/${route}/page.tsx`, "utf8").catch(() => "");
    assert.ok(source.includes(excerpt), `${route} debe incluir el texto original`);
    assert.ok(source.includes("LegalPage"), `${route} debe usar la plantilla legal`);
  }
  const layout = await readFile("components/legal/LegalPage.tsx", "utf8").catch(() => "");
  assert.match(layout, /[Bb]orrador.*revisión legal/);
  assert.match(layout, /SiteFooter/);
  const footer = await readFile('components/public/SiteFooter.tsx', 'utf8');
  assert.match(footer, /Apoya a SVG/);
});
