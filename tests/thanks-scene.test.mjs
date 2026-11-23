import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const files = [
  'lib/thanks.ts',
  'components/landing/ThanksScene.tsx',
  'app/thanks.css',
  'components/landing/LiveStream.tsx',
  'components/donations/DonationLive.tsx',
  'components/campaign/HeroLiveOverlay.tsx',
];

test('la pantalla de cierre agradece y deja la campana abierta', () => {
  const copy = readFileSync('lib/thanks.ts', 'utf8');
  assert.ok(copy.includes('titleLead: "Gracias,"'));
  assert.ok(copy.includes('lo hicimos juntos'));
  assert.ok(copy.includes('construyendo La Supercasa para los Súper Calvitos'));
  assert.ok(copy.includes('2026-11-30T23:59:59-05:00'));
  assert.ok(copy.includes('daysLeftLabel'));

  const scene = readFileSync('components/landing/ThanksScene.tsx', 'utf8');
  assert.ok(scene.includes('daysLeftLabel'));
  assert.ok(scene.includes('href="/donar"'));
  assert.ok(scene.includes('KAVANAH.instagram'));
  assert.ok(scene.includes('supercasa-100-1400.webp'));
});

test('los tres visores muestran el cierre y no un reproductor roto', () => {
  const live = readFileSync('components/landing/LiveStream.tsx', 'utf8');
  assert.ok(live.includes('ThanksScene'));
  assert.ok(!live.includes('Última transmisión'));

  const donation = readFileSync('components/donations/DonationLive.tsx', 'utf8');
  assert.ok(donation.includes('ThanksScene'));
  assert.ok(!donation.includes('Última transmisión'));

  const hero = readFileSync('components/campaign/HeroLiveOverlay.tsx', 'utf8');
  assert.ok(hero.includes('ThanksScene'));
  assert.ok(!hero.includes('Última transmisión'));
});

test('la pantalla de cierre no usa emojis ni guiones largos', () => {
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    assert.ok(
      !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(source),
      `${file} no debe tener emojis`,
    );
    assert.ok(!source.includes('—'), `${file} no debe tener guiones largos`);
  }
});
