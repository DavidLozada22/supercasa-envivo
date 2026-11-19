import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('las donaciones se listan y se registran manualmente', () => {
  const api = readFileSync('app/api/admin/donations/route.ts', 'utf8');
  assert.ok(api.includes('isAuthenticated'));
  assert.ok(api.includes('insert into donations'));
  assert.ok(api.includes("'approved'"));
  const panel = readFileSync('components/admin/DonationsPanel.tsx', 'utf8');
  assert.ok(panel.includes('Registrar aporte manual'));
  assert.ok(panel.includes('CSV'));
  const page = readFileSync('app/admin/donaciones/page.tsx', 'utf8');
  assert.ok(page.includes('AdminShell'));
});

test('el home muestra las piezas como el sitio original', () => {
  const preview = readFileSync('components/campaign/DonatePreview.tsx', 'utf8');
  assert.ok(preview.includes('pieces'));
  assert.ok(preview.includes('piece__badge'));
  assert.ok(preview.includes('Plan Padrino'));
});

test('el panel usa sidebar y breadcrumbs', () => {
  const shell = readFileSync('components/admin/AdminShell.tsx', 'utf8');
  assert.ok(shell.includes('AdminSidebar'));
  assert.ok(shell.includes('Panel'));
  assert.ok(shell.includes('current'));
  const nav = readFileSync('components/admin/nav.ts', 'utf8');
  assert.ok(nav.includes('/admin/donaciones'));
  assert.ok(nav.includes('/admin/streaming'));
});
