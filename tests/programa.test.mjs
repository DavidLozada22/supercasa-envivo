import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('el programa V6 tiene bloques, segmentos y horarios válidos', () => {
  const blocks = JSON.parse(read('lib/program/blocks.json'));
  const segments = JSON.parse(read('lib/program/segments.json'));

  assert.equal(blocks.length, 12);
  assert.ok(blocks.every((block) => block.number && block.title && block.startsAt));
  assert.ok(segments.length >= 500, `segmentos: ${segments.length}`);
  assert.ok(segments.some((segment) => segment.live), 'faltan segmentos en vivo');
  assert.ok(segments.every((segment) => segment.startClock && segment.endClock));
  assert.equal(new Set(segments.map((segment) => segment.id)).size, segments.length);
  assert.ok(segments.every((segment) => /^-05:00$/.test(segment.startsAt.slice(-6))));
});

test('la página pública no se indexa y tiene la barra de ahora', () => {
  const page = read('app/programa/page.tsx');
  assert.ok(page.includes('PublicProgram'));
  assert.ok(page.includes('index: false'));
  assert.ok(page.includes('readProgramNow'));

  const config = read('next.config.ts');
  assert.ok(config.includes('X-Robots-Tag'));
  assert.ok(config.includes('/programa'));

  const robots = read('app/robots.ts');
  assert.ok(robots.includes('/programa'));

  const view = read('components/program/PublicProgram.tsx');
  assert.ok(view.includes('Según cronograma'));
  assert.ok(view.includes('En vivo según el equipo'));
  assert.ok(view.includes('Ir a ahora'));
  assert.ok(view.includes('/api/program/excel'));
  assert.ok(view.includes('Built by'));
});

test('el programa tiene marcador manual y Excel descargable', () => {
  assert.ok(existsSync('lib/program/now.ts'));
  assert.ok(existsSync('app/api/program/now/route.ts'));
  assert.ok(existsSync('app/api/admin/program/now/route.ts'));

  const control = read('components/admin/program/ProgramNowControl.tsx');
  assert.ok(control.includes('Marcar aquí'));
  assert.ok(control.includes('Automático'));

  const excel = 'public/programa/programa-48h.xlsx';
  assert.ok(existsSync(excel));
  assert.ok(statSync(excel).size > 10_000);

  const presets = read('lib/program/presets.ts');
  assert.ok(presets.includes('lowerThirdPath'));
  assert.ok(presets.includes('pending'));
  assert.ok(presets.includes('PROGRAM_SEGMENTS'));
});
