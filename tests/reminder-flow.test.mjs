import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el aviso de la transmisión está en el header y en el menú móvil', () => {
  const header = readFileSync('components/public/SiteHeader.tsx', 'utf8');
  assert.ok(header.includes('/envivo#avisame'));
  assert.ok(header.includes('Avísame'));
  const landing = readFileSync('components/landing/LandingMarkup.tsx', 'utf8');
  assert.ok(landing.includes('id="avisame"'));
});

test('quien dona puede quedar en la lista de recordatorios', () => {
  const flow = readFileSync('components/campaign/DonationFlow.tsx', 'utf8');
  assert.ok(flow.includes('wantsReminders'));
  assert.ok(flow.includes('Avísame por correo cuando empiece la transmisión'));
  const api = readFileSync('app/api/donations/route.ts', 'utf8');
  assert.ok(api.includes('addReminder'));
  assert.ok(api.includes('wantsReminders'));
  const store = readFileSync('lib/reminders/store.ts', 'utf8');
  assert.ok(store.includes('insert into reminders'));
});

test('el panel tiene el código SDV listo para copiar', () => {
  const tools = readFileSync('components/admin/CampaignTools.tsx', 'utf8');
  assert.ok(tools.includes('"SDV"'));
  const docs = readFileSync('HANDOFF/PENDIENTES.md', 'utf8');
  assert.ok(docs.includes('ref/SDV'));
  assert.ok(docs.includes('CRM'));
});
