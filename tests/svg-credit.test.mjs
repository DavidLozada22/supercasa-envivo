import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el pie unico invita a apoyar a SVG y vive en todo el sitio', () => {
  const footer = readFileSync('components/public/SiteFooter.tsx', 'utf8');
  assert.ok(footer.includes('Apoya a SVG'));
  assert.ok(footer.includes('svgvisual.com'));
  assert.ok(footer.includes('Evento producido por Kavanah'));
  assert.ok(footer.includes('Fundación Segundos de Vida'));
  assert.ok(footer.includes('/politica-de-datos'));
  assert.ok(footer.includes('/terminos'));
  for (const file of [
    'components/landing/LandingMarkup.tsx',
    'components/campaign/CampaignShell.tsx',
    'app/donar/page.tsx',
    'app/donar/gracias/page.tsx',
    'components/legal/LegalPage.tsx',
  ]) {
    assert.ok(readFileSync(file, 'utf8').includes('SiteFooter'), `${file} debe usar el pie unico`);
  }
  assert.ok(!footer.includes('Built by'));
});
