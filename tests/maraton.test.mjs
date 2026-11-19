import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const page = readFileSync('app/envivo/page.tsx', 'utf8');
const landing = readFileSync('components/landing/LandingMarkup.tsx', 'utf8');
const shell = readFileSync('components/campaign/CampaignShell.tsx', 'utf8');
const sponsors = readFileSync('components/campaign/SponsorsSection.tsx', 'utf8');
test('la maratón conserva secciones y personajes originales', () => {
  for (const text of ['Ningún niño debería luchar solo', 'HouseProgress', 'bombero.webp', 'doctora.webp', 'Terraf','@lasupercasa', '18600009054', 'kavanah35']) assert.ok((landing + page + sponsors).toLowerCase().includes(text.toLowerCase()), `Falta ${text}`);
  assert.ok(page.includes('LandingMarkup'));
});
test('la cabecera de campaña enlaza a maratón y donación', () => {
  assert.ok(shell.includes('href="/envivo"'));
  assert.ok(shell.includes('Ponte la capa'));
});
test('la demostración administrativa está protegida y no inicia pagos', () => {
  const demo = readFileSync('app/admin/recorrido/page.tsx', 'utf8');
  assert.ok(demo.includes('isAuthenticated'));
  assert.ok(demo.includes('FlowDemo'));
  const component = readFileSync('components/admin/FlowDemo.tsx', 'utf8');
  assert.ok(!component.includes('/api/donations'));
  for (const status of ['Aprobado', 'Pendiente', 'Rechazado']) assert.ok(component.includes(status));
});
