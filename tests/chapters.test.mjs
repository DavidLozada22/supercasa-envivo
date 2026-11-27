import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

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
  'app/api/chapters/embed/[slug]/route.ts',
  'app/api/chapters/poster/[slug]/route.ts',
  'lib/chapters/public.ts',
  'lib/chapters/format.ts',
  'lib/chapters/seed.json',
];

test('el archivo tiene los catorce capítulos y sus categorías', () => {
  assert.equal(seed.length, 14);
  assert.equal(new Set(seed.map((chapter) => chapter.id)).size, 14);
  assert.equal(new Set(seed.map((chapter) => chapter.slug)).size, 14);

  const count = (category) => seed.filter((chapter) => chapter.category === category).length;
  assert.equal(count('podcast'), 6);
  assert.equal(count('musica'), 1);
  assert.equal(count('momentos'), 6);
  assert.equal(count('capsulas'), 1);

  assert.equal(seed.filter((chapter) => chapter.featured).length, 3);
  assert.ok(seed.every((chapter) => chapter.title && chapter.providerId));
  assert.ok(seed.every((chapter) => chapter.durationSeconds > 0));

  const podcast = seed.filter((chapter) => chapter.category === 'podcast');
  assert.ok(podcast.some((chapter) => chapter.title.includes('Patricia Avendaño')));
  assert.ok(podcast.some((chapter) => chapter.title.includes('Carlos Alberto')));
  assert.ok(podcast.some((chapter) => chapter.title === 'Hilos Invisibles: Lidia Paipa'));
  assert.ok(podcast.some((chapter) => chapter.title === 'Hilos Invisibles: Diego Chaparro'));
  assert.ok(podcast.some((chapter) => chapter.title === 'Hilos Invisibles: Magda Mateus'));
  assert.equal(podcast.filter((chapter) => chapter.series === 'Eres Único, no el único').length, 2);
  assert.equal(podcast.filter((chapter) => chapter.series === 'Hilos Invisibles').length, 4);
  assert.ok(
    podcast
      .filter((chapter) => chapter.series === 'Eres Único, no el único')
      .every((chapter) => chapter.title.startsWith('Eres Único, no el único:')),
  );
  const fundacionIg = 'https://www.instagram.com/segundosdevidafundacion/';
  const fundacionWeb = 'https://segundosdevida.com';
  for (const id of ['ch-paty', 'ch-carlos-alberto']) {
    const chapter = seed.find((item) => item.id === id);
    assert.equal(chapter.instagram, fundacionIg);
    assert.equal(chapter.website, fundacionWeb);
  }
  assert.equal(
    seed.find((chapter) => chapter.id === 'ch-lidia').instagram,
    'https://www.instagram.com/lidiapaipacoach/',
  );
  assert.equal(
    seed.find((chapter) => chapter.id === 'ch-chapa').instagram,
    'https://www.instagram.com/chapa.diego3/',
  );
  assert.equal(
    seed.find((chapter) => chapter.id === 'ch-magda').instagram,
    'https://www.instagram.com/magdamateuscoach/',
  );
  assert.ok(seed.some((chapter) => chapter.slug === 'machare-pasame-la-botella-y-mi-cura'));
});

test('los catorce capítulos salen de Drive y no hay videos locales', () => {
  const drive = seed.filter((chapter) => chapter.provider === 'drive');
  assert.equal(drive.length, 14);
  assert.ok(drive.every((chapter) => /^[\w-]{20,}$/.test(chapter.providerId)));
  assert.ok(drive.some((chapter) => chapter.providerId === '1fr3V9uTyKi_7K1vShAGzzB8TMHxniEA8'));
  assert.ok(drive.some((chapter) => chapter.providerId === '1QJFFk0Z2AkKv9ny3FTGoIqb4lxboCVSm'));
  assert.ok(!seed.some((chapter) => chapter.provider === 'file'));
  assert.ok(!existsSync('public/video/tuna-presentacion-2.mp4'));
  assert.ok(!existsSync('public/video/tuna-presentacion-2.jpg'));
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
  assert.ok(detail.includes('chapter.instagram'));
  assert.ok(detail.includes('chapter.website'));
  assert.ok(detail.includes('Instagram'));
  assert.ok(detail.includes('Sitio web'));

  assert.ok(read('app/sitemap.ts').includes('/capitulos'));
  assert.ok(!read('app/robots.ts').includes('/capitulos'));

  const header = read('components/public/SiteHeader.tsx');
  assert.ok(header.includes('href="/capitulos"'));
  assert.ok(header.includes('Capítulos'));

  assert.ok(read('components/campaign/CampaignShell.tsx').includes('ChaptersStrip'));
  assert.ok(read('components/landing/ThanksScene.tsx').includes('href="/capitulos"'));

  assert.ok(existsSync('app/api/chapters/embed/[slug]/route.ts'));
  assert.ok(existsSync('app/api/chapters/poster/[slug]/route.ts'));
});

test('la página pública no ofrece salida ni enlace al archivo de Drive', () => {
  const format = read('lib/chapters/format.ts');
  assert.ok(format.includes('/api/chapters/poster/'));
  assert.ok(format.includes('preview?autoplay=1'));
  assert.ok(!format.includes('thumbnail?id='));
  assert.ok(!format.includes('watchUrl'));

  const page = read('app/capitulos/page.tsx');
  assert.ok(page.includes('toPublicChapter'));
  assert.ok(!page.includes('providerId'));

  const detail = read('app/capitulos/[slug]/page.tsx');
  assert.ok(!detail.includes('watchUrl'));
  assert.ok(!detail.includes('contentUrl'));
  assert.ok(!detail.includes('Abrir el video en Drive'));
  assert.ok(detail.includes('embedUrl: shareUrl'));

  const player = read('components/chapters/ChapterPlayer.tsx');
  assert.ok(!player.includes('externalUrl'));
  assert.ok(!player.includes('ExternalLink'));
  assert.ok(!player.includes('Abrir el video'));
  assert.ok(player.includes('chapter-player__video'));
  assert.ok(player.includes('chapter-player__seek'));
  assert.ok(player.includes('toggleFullscreen'));
  assert.ok(player.includes('is-faux-fullscreen'));
  assert.ok(player.includes('chapter-player__exit'));
  assert.ok(player.includes('chapter-player__mask'));
  assert.ok(player.includes('logo-fsv-official.png'));
  assert.ok(player.includes('kavanah-horizontal-gold.png'));
  assert.ok(player.includes('videoUrl'));
  assert.ok(player.includes('/api/chapters/embed/'));

  const publicView = read('lib/chapters/public.ts');
  assert.ok(publicView.includes('toPublicChapter'));
  assert.ok(publicView.includes('videoUrl'));
  assert.ok(!publicView.includes('providerId:'));
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
  assert.ok(panel.includes('Instagram'));
  assert.ok(panel.includes('Sitio web'));

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
