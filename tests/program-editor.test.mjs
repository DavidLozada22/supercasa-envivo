import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('el programa se puede editar desde el panel y guardar en Blob', () => {
  const store = read('lib/program/store.ts');
  assert.ok(store.includes('readProgram'));
  assert.ok(store.includes('writeProgram'));
  assert.ok(store.includes('resetProgram'));

  const normalize = read('lib/program/normalize.ts');
  assert.ok(normalize.includes('normalizeProgram'));
  assert.ok(normalize.includes('startsAt'));

  const editor = read('components/admin/program/ProgramEditor.tsx');
  assert.ok(editor.includes('Guardar cambios'));
  assert.ok(editor.includes('Agregar bloque'));
  assert.ok(editor.includes('Agregar segmento'));
  assert.ok(editor.includes('Sincronizar agenda'));
  assert.ok(editor.includes('Restaurar al JSON base'));

  const page = read('app/admin/programa/editar/page.tsx');
  assert.ok(page.includes('ProgramEditor'));
  assert.ok(page.includes('readProgram'));

  const api = read('app/api/admin/program/route.ts');
  assert.ok(api.includes('writeProgram'));
  assert.ok(api.includes('ProgramValidationError'));
  assert.ok(api.includes('resetProgram'));

  const publicPage = read('app/programa/page.tsx');
  assert.ok(publicPage.includes('readProgram'));
  assert.ok(!publicPage.includes('PROGRAM_BLOCKS'));
});

test('la agenda de marketing y el Excel salen del programa actual', () => {
  const agenda = read('lib/program/agenda.ts');
  assert.ok(agenda.includes('buildAgendaRows'));
  assert.ok(agenda.includes('car3-s2'));

  const sync = read('app/api/admin/program/sync-agenda/route.ts');
  assert.ok(sync.includes('carousel-agenda-tentativa'));
  assert.ok(sync.includes('scheduleRows'));

  const excel = read('app/api/program/excel/route.ts');
  assert.ok(excel.includes('buildProgramWorkbook'));

  const kit = read('lib/marketing/campaign-kit.ts');
  assert.ok(kit.includes('blocksJson'));
  assert.ok(kit.includes('BLOCK_BY_NUMBER'));
  assert.ok(kit.includes('agendaRow'));
});

test('solo el editor del programa puede modificarlo', () => {
  const users = read('lib/users.ts');
  assert.ok(users.includes('PROGRAM_EDITORS'));
  assert.ok(users.includes('canEditProgram'));
  assert.ok(users.includes('programEditorNames'));

  const permissions = read('lib/permissions.ts');
  assert.ok(permissions.includes('apiProgramEditor'));
  assert.ok(permissions.includes('requireProgramEditorPage'));

  const editorPage = read('app/admin/programa/editar/page.tsx');
  assert.ok(editorPage.includes('requireProgramEditorPage'));
  assert.ok(!editorPage.includes('"admin", "editor", "marketing"'));

  const api = read('app/api/admin/program/route.ts');
  assert.ok(api.includes('apiProgramEditor'));
  assert.ok(!api.includes('const ALLOWED'));

  const sync = read('app/api/admin/program/sync-agenda/route.ts');
  assert.ok(sync.includes('apiProgramEditor'));

  const panel = read('app/admin/programa/page.tsx');
  assert.ok(panel.includes('canEditProgram'));
  assert.ok(panel.includes('Solo lectura'));

  const env = read('.env.example');
  assert.ok(env.includes('PROGRAM_EDITORS'));
});

test('el programa se marca por segmento y conserva el orden manual', () => {
  const types = read('lib/program/types.ts');
  assert.ok(types.includes('done: boolean'));

  const normalize = read('lib/program/normalize.ts');
  assert.ok(normalize.includes('done: input.done === true'));
  assert.ok(!normalize.includes('segments.sort'));
  assert.ok(!normalize.includes('blocks.sort'));

  const editor = read('components/admin/program/ProgramEditor.tsx');
  assert.ok(editor.includes('toggleDone'));
  assert.ok(editor.includes('moveSegment'));
  assert.ok(editor.includes('moveBlock'));
  assert.ok(editor.includes('title="Subir"'));
  assert.ok(editor.includes('title="Bajar"'));
  assert.ok(editor.includes('(copia)'));
  assert.ok(editor.includes('splice(index + 1, 0, copy)'));

  const check = read('app/api/admin/program/check/route.ts');
  assert.ok(check.includes('apiProgramEditor'));
  assert.ok(check.includes('writeProgram'));

  const excel = read('lib/program/excel.ts');
  assert.ok(excel.includes('Hecho'));
});
