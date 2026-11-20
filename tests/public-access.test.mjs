import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('los links públicos no dependen de la sesión ni del rol', () => {
  const program = read('app/programa/page.tsx');
  assert.ok(!program.includes('requirePageRole'));
  assert.ok(!program.includes('getSession'));

  const answers = read('app/respuestas/page.tsx');
  assert.ok(!answers.includes('requirePageRole'));
  assert.ok(!answers.includes('getSession'));

  const adminProgram = read('app/admin/programa/page.tsx');
  assert.ok(adminProgram.includes('redirect("/programa")'));
  assert.ok(!adminProgram.includes('requirePageRole'));

  const config = read('next.config.ts');
  assert.ok(config.includes('source: "/plan"'));
  assert.ok(config.includes('source: "/cronograma"'));
  assert.ok(config.includes('source: "/respuestas-rapidas"'));
  assert.ok(config.includes('no-store'));
});
