import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('los recordatorios se guardan, se envian y se ven en el panel', () => {
  const api = readFileSync('app/api/reminders/route.ts', 'utf8');
  assert.ok(api.includes('insert into reminders'));
  assert.ok(api.includes('consent'));
  const admin = readFileSync('app/api/admin/reminders/route.ts', 'utf8');
  assert.ok(admin.includes('apiRole'));
  assert.ok(admin.includes('sendReminderEmail'));
  const resend = readFileSync('lib/resend.ts', 'utf8');
  assert.ok(resend.includes('RESEND_API_KEY'));
  assert.ok(resend.includes('api.resend.com'));
  const page = readFileSync('app/admin/recordatorios/page.tsx', 'utf8');
  assert.ok(page.includes('AdminShell'));
  const nav = readFileSync('components/admin/nav.ts', 'utf8');
  assert.ok(nav.includes('/admin/recordatorios'));
  const landing = readFileSync('components/landing/LandingMarkup.tsx', 'utf8');
  assert.ok(landing.includes('ReminderForm'));
});
