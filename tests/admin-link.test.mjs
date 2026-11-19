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
