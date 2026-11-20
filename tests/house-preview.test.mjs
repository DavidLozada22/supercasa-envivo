import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el panel tiene simulador de avance con fundido', () => {
  const page = readFileSync('app/admin/casa/page.tsx', 'utf8');
  assert.ok(page.includes('requirePageRole'));
  assert.ok(page.includes('HousePreview'));
  const preview = readFileSync('components/admin/HousePreview.tsx', 'utf8');
  assert.ok(preview.includes('type="range"'));
  assert.ok(preview.includes('key={frame}'));
  assert.ok(preview.includes('useState(60)'));
  const dash = readFileSync('components/admin/AdminDashboard.tsx', 'utf8');
  assert.ok(dash.includes('/admin/casa'));
});
