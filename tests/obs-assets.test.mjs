import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('los assets de OBS están completos y listos para otro agente', () => {
  const manifest = JSON.parse(read('assets/obs/manifest.json'));
  assert.equal(manifest.scenes.length, 56);
  assert.equal(manifest.music.length, 4);
  assert.ok(manifest.music.every((track) => track.loop === true));
  assert.ok(manifest.scenes.every((scene) => existsSync(scene.file)));
  assert.ok(manifest.music.every((track) => existsSync(track.path)));
  assert.equal(manifest.scenes.filter((scene) => scene.kind === 'overlay').length, 9);

  for (const file of [
    'cortina.mp3',
    'kornevmusic-upbeat-happy-corporate-487426.mp3',
    'nastelbom-corporate-606705.mp3',
    'atlasaudio-corporate-business-635581.mp3',
  ]) {
    assert.ok(existsSync(`assets/obs/music/${file}`), `falta ${file}`);
    assert.ok(existsSync(`public/audio/${file}`), `falta public/audio/${file}`);
  }

  const guide = read('assets/obs/README.md');
  assert.ok(guide.includes('loop'));
  assert.ok(guide.includes('Loop'));
  assert.ok(guide.includes('1920x1080'));

  const agents = read('AGENTS.md');
  assert.ok(agents.includes('assets/obs/README.md'));
  assert.ok(agents.includes('npm run obs:assets'));

  const ignore = read('.gitignore');
  assert.ok(!ignore.includes('assets/obs'));

  assert.ok(existsSync('scripts/export-obs-assets.mjs'));
});
