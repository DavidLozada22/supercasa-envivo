import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('la atribución conserva UTM y enlaces de referido', () => {
  const track = readFileSync('app/api/track/route.ts', 'utf8');
  assert.ok(track.includes('insertVisit'));
  const ref = readFileSync('app/ref/[code]/route.ts', 'utf8');
  assert.ok(ref.includes('sc_ref'));
  assert.ok(ref.includes('searchParams.set("ref"'));
  assert.ok(ref.includes('"/envivo"'));
  const tools = readFileSync('components/admin/CampaignTools.tsx', 'utf8');
  assert.ok(tools.includes('utm_source'));
  assert.ok(tools.includes('/ref/'));
  const flow = readFileSync('components/campaign/DonationFlow.tsx', 'utf8');
  assert.ok(flow.includes('sc_attribution'));
});
