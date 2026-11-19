import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el acceso al panel vive en los headers públicos', () => {
  for (const file of ['components/campaign/CampaignShell.tsx', 'components/landing/LandingMarkup.tsx', 'app/donar/page.tsx']) {
    const source = readFileSync(file, 'utf8');
    assert.ok(source.includes('href="/admin"'), `${file} debe enlazar al panel`);
    assert.ok(source.includes('Panel de administración'), `${file} debe etiquetar el acceso`);
  }
});
