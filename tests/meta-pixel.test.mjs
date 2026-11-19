import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
test('pixel público requiere consentimiento y excluye administración', () => {
  assert.ok(existsSync('components/analytics/MetaPixel.tsx'));
  const source = readFileSync('components/analytics/MetaPixel.tsx','utf8');
  for (const value of ['1108633085373695', 'localStorage', '/admin', 'PageView']) assert.ok(source.includes(value));
  assert.ok(readFileSync('app/layout.tsx','utf8').includes('MetaPixel'));
  assert.ok(!readFileSync('app/page.tsx','utf8').includes("fbq('init'"));
});
