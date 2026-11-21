import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el acceso al panel vive en el header publico unico', () => {
  const header = readFileSync('components/public/SiteHeader.tsx', 'utf8');
  assert.ok(header.includes('href="/admin"'));
  assert.ok(header.includes('Panel de administración'));
  for (const file of ['components/campaign/CampaignShell.tsx', 'components/landing/LandingMarkup.tsx', 'app/donar/page.tsx']) {
    assert.ok(readFileSync(file, 'utf8').includes('SiteHeader'), `${file} debe usar el header unico`);
  }
});

test('programa y respuestas quedan para todos los roles', () => {
  const nav = readFileSync('components/admin/nav.ts', 'utf8');
  const programa = readFileSync('app/admin/programa/page.tsx', 'utf8');
  assert.ok(nav.includes('href: "/respuestas"'), 'Falta el acceso a respuestas en el panel');
  assert.ok(nav.includes('const EVERYONE: PanelRole[] = ["admin", "editor", "marketing", "finance"]'));
  assert.ok(!programa.includes('["admin", "editor", "marketing"].includes(role)'), 'Finanzas debe poder ver el programa');
});
