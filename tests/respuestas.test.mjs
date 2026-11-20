import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('el panel de respuestas tiene preguntas y mensajes listos', () => {
  const data = read('lib/answers/presets.ts');
  assert.ok(data.includes('No encuentro el streaming'));
  assert.ok(data.includes('¿De qué se trata?'));
  assert.ok(data.includes('¿Quién organiza?'));
  assert.ok(data.includes('¿Cómo dono?'));
  assert.ok(data.includes('Abrir WhatsApp'));
  assert.ok(data.includes('Todo el evento en un mensaje'));
  assert.ok(data.includes('Programa de los 12 bloques'));
  assert.ok(data.includes('En vivo para compartir'));
  assert.ok(data.includes('Para reenviar a quien no tiene los links'));

  const board = read('components/answers/AnswerBoard.tsx');
  assert.ok(board.includes('Copiar respuesta'));
  assert.ok(board.includes('Copiar mensaje'));
  assert.ok(board.includes('Compartir en WhatsApp'));
  assert.ok(board.includes('/respuestas'));
});

test('la página de respuestas no se indexa', () => {
  const page = read('app/respuestas/page.tsx');
  assert.ok(page.includes('AnswerBoard'));
  assert.ok(page.includes('index: false'));

  const config = read('next.config.ts');
  assert.ok(config.includes('/respuestas'));
  assert.ok(config.includes('X-Robots-Tag'));

  const robots = read('app/robots.ts');
  assert.ok(robots.includes('/respuestas'));

  const pixel = read('components/analytics/MetaPixel.tsx');
  assert.ok(pixel.includes('/respuestas'));

  const attribution = read('components/analytics/Attribution.tsx');
  assert.ok(attribution.includes('/respuestas'));
});
