import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

test('el video promo vive en el hero y respeta las politicas de autoplay', () => {
  const hero = readFileSync('components/public/HeroPromo.tsx', 'utf8');
  assert.ok(hero.includes('/video/promo-supercasa.mp4'));
  assert.ok(hero.includes('/video/promo-supercasa-mobile.mp4'));
  assert.ok(hero.includes('promo-supercasa.es.vtt'));
  assert.ok(hero.includes('muted'));
  assert.ok(hero.includes('playsInline'));
  assert.ok(hero.includes('prefers-reduced-motion'));
  assert.ok(hero.includes('saveData'));
  assert.ok(hero.includes('Activar sonido'));
  assert.ok(hero.includes('/video/promo-poster.jpg'));

  const shell = readFileSync('components/campaign/CampaignShell.tsx', 'utf8');
  assert.ok(shell.includes('HeroPromo'));
  assert.ok(!shell.includes('hero__organizer'));

  const live = readFileSync('components/landing/StreamPlayer.tsx', 'utf8');
  assert.ok(live.includes('PromoInline'));

  for (const file of [
    'public/video/promo-supercasa.mp4',
    'public/video/promo-supercasa-mobile.mp4',
    'public/video/promo-poster.jpg',
    'public/video/promo-supercasa.es.vtt',
  ]) {
    assert.ok(statSync(file).size > 0, `${file} debe existir`);
  }
});

test('el header usa el logo oficial de la Fundacion', () => {
  const header = readFileSync('components/public/SiteHeader.tsx', 'utf8');
  assert.ok(header.includes('/img/logo-fsv-official.png'));
  assert.ok(!header.includes('/img/logo-fsv.png'));
  const css = readFileSync('app/campaign.css', 'utf8');
  assert.ok(css.includes('height: 38px'));
  assert.ok(css.includes('height: 30px'));
});
