import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const seed = JSON.parse(read('lib/chapters/seed.json'));

const uiFiles = [
  'app/capitulos/page.tsx',
  'app/capitulos/[slug]/page.tsx',
  'app/chapters.css',
  'components/chapters/ChapterCard.tsx',
  'components/chapters/ChapterPlayer.tsx',
  'components/chapters/ChaptersBrowser.tsx',
  'components/chapters/ChaptersStrip.tsx',
  'components/chapters/ShareChapter.tsx',
];

test('el archivo tiene los quince capítulos y sus categorías', () => {
  assert.equal(seed.length, 15);
  assert.equal(new Set(seed.map((chapter) => chapter.id)).size, 15);
  assert.equal(new Set(seed.map((chapter) => chapter.slug)).size, 15);

  const count = (category) => seed.filter((chapter) => chapter.category === category).length;
  assert.equal(count('podcast'), 6);
  assert.equal(count('musica'), 1);
  assert.equal(count('momentos'), 6);
  assert.equal(count('capsulas'), 2);

  assert.equal(seed.filter((chapter) => chapter.featured).length, 3);
  assert.ok(seed.every((chapter) => chapter.title && chapter.providerId));
  assert.ok(seed.every((chapter) => chapter.durationSeconds > 0));

  const podcast = seed.filter((chapter) => chapter.category === 'podcast');
  assert.ok(podcast.some((chapter) => chapter.title.includes('Patricia Avendaño')));
  assert.ok(podcast.some((chapter) => chapter.title.includes('Carlos Alberto')));
  assert.ok(seed.some((chapter) => chapter.slug === 'machare-pasame-la-botella-y-mi-cura'));
});

test('los videos se quedan en Drive y el clip de la tuna vive en el sitio', () => {
  const drive = seed.filter((chapter) => chapter.provider === 'drive');
  assert.equal(drive.length, 14);
  assert.ok(drive.every((chapter) => /^[\w-]{20,}$/.test(chapter.providerId)));
  assert.ok(drive.some((chapter) => chapter.providerId === '1fr3V9uTyKi_7K1vShAGzzB8TMHxniEA8'));

  const local = seed.find((chapter) => chapter.provider === 'file');
  assert.equal(local.providerId, '/video/tuna-presentacion-2.mp4');
  assert.ok(existsSync('public/video/tuna-presentacion-2.mp4'));
  assert.ok(existsSync('public/video/tuna-presentacion-2.jpg'));
  assert.ok(statSync('public/video/tuna-presentacion-2.mp4').size < 3_000_000);
});

test('el catálogo se guarda en Postgres y no depende de Blob', () => {
  const store = read('lib/chapters/store.ts');
  assert.ok(store.includes('create table if not exists chapters'));
  assert.ok(store.includes('SEED_CHAPTERS'));
  assert.ok(store.includes('readChapters'));
  assert.ok(!store.includes('@vercel/blob'));

  assert.ok(existsSync('supabase/migrations/20261127000000_chapters.sql'));
  assert.ok(read('supabase/migrations/20261127000000_chapters.sql').includes('create table if not exists chapters'));
});

test('la página pública y el detalle existen con metadatos y player', () => {
  const page = read('app/capitulos/page.tsx');
  assert.ok(page.includes('ChaptersBrowser'));
  assert.ok(page.includes('readChapters'));
  assert.ok(page.includes('canonical: "/capitulos"'));
  assert.ok(page.includes('Donar ahora'));

  const detail = read('app/capitulos/[slug]/page.tsx');
  assert.ok(detail.includes('generateMetadata'));
  assert.ok(detail.includes('VideoObject'));
  assert.ok(detail.includes('ChapterPlayer'));
  assert.ok(detail.includes('notFound'));

  assert.ok(read('app/sitemap.ts').includes('/capitulos'));
  assert.ok(!read('app/robots.ts').includes('/capitulos'));

  const header = read('components/public/SiteHeader.tsx');
  assert.ok(header.includes('href="/capitulos"'));
  assert.ok(header.includes('Capítulos'));

  assert.ok(read('components/campaign/CampaignShell.tsx').includes('ChaptersStrip'));
  assert.ok(read('components/landing/ThanksScene.tsx').includes('href="/capitulos"'));
});

test('el panel permite crear, editar, ocultar y borrar capítulos', () => {
  assert.ok(existsSync('app/admin/capitulos/page.tsx'));
  assert.ok(existsSync('app/api/admin/chapters/route.ts'));
  const panel = read('components/admin/ChaptersPanel.tsx');
  assert.ok(panel.includes('Nuevo capítulo'));
  assert.ok(panel.includes('Destacar'));
  assert.ok(panel.includes('Ocultar'));
  assert.ok(panel.includes('Borrar'));
  assert.ok(panel.includes('Drive'));

  const nav = read('components/admin/nav.ts');
  assert.ok(nav.includes('/admin/capitulos'));
  assert.ok(nav.includes('Clapperboard'));
});

test('el archivo nuevo no usa emojis ni guiones largos', () => {
  for (const file of uiFiles) {
    const source = read(file);
    assert.ok(
      !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(source),
      `${file} no debe tener emojis`,
    );
    assert.ok(!source.includes('—'), `${file} no debe tener guiones largos`);
  }
});
