import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

test('la cancion oficial de Machare existe y suena en el cierre', () => {
  const file = 'public/audio/supercalvitos-machare.mp3';
  assert.ok(existsSync(file), 'Falta el audio de la canción');
  assert.ok(statSync(file).size > 500_000, 'El audio parece vacío');

  const song = readFileSync('lib/song.ts', 'utf8');
  assert.ok(song.includes('Machare'));
  assert.ok(song.includes('/audio/supercalvitos-machare.mp3'));

  const button = readFileSync('components/public/SongButton.tsx', 'utf8');
  assert.ok(button.includes('SONG.src'));
  assert.ok(button.includes('loop'));
  assert.ok(button.includes('Pausar la canción'));

  const thanks = readFileSync('components/landing/ThanksScene.tsx', 'utf8');
  assert.ok(thanks.includes('SongButton'));
  assert.ok(thanks.includes('autoPlay={variant === "full"}'));

  const section = readFileSync('components/campaign/OfficialSong.tsx', 'utf8');
  assert.ok(section.includes('Gracias, Machare'));
  assert.ok(section.includes('canción oficial'));

  const css = readFileSync('app/song.css', 'utf8');
  assert.ok(css.includes('/img/gracias-calvitos.jpg'));
  assert.ok(existsSync('public/img/gracias-calvitos.jpg'));
});

test('la barra de progreso muestra lo recaudado y no lo que falta', () => {
  const shell = readFileSync('components/campaign/CampaignShell.tsx', 'utf8');
  assert.ok(shell.includes('data-progress-raised'));
  assert.ok(!shell.includes('bar__pct'));
  assert.ok(!shell.includes('data-next-missing'));
  assert.ok(!shell.includes('className="goal"'));

  const house = readFileSync('components/landing/HouseProgress.tsx', 'utf8');
  assert.ok(house.includes('Comparar la casa de hoy con la casa terminada'));
  assert.ok(house.includes('supercasa-000-1400.webp'));
  assert.ok(house.includes('supercasa-100-1400.webp'));
  assert.ok(house.includes('Llevamos'));
  assert.ok(!house.includes('La ilustración cambia cada 5%'));
  assert.ok(!house.includes('pct.toLocaleString'));
});

test('la cancion y la barra no usan emojis ni guiones largos', () => {
  const files = [
    'lib/song.ts',
    'components/public/SongButton.tsx',
    'components/campaign/OfficialSong.tsx',
    'components/landing/HouseProgress.tsx',
    'app/song.css',
  ];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    assert.ok(
      !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(source),
      `${file} no debe tener emojis`,
    );
    assert.ok(!source.includes('—'), `${file} no debe tener guiones largos`);
  }
});
