import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el panel permite descargar el QR y muestra el calendario fijo', () => {
  const route = readFileSync('app/api/admin/qr/route.ts', 'utf8');
  assert.ok(route.includes('isAuthenticated'));
  assert.ok(route.includes('/donar'));
  assert.ok(route.includes('image/png'));
  const dashboard = readFileSync('components/admin/AdminDashboard.tsx', 'utf8');
  assert.ok(dashboard.includes('/api/admin/qr?download=1'));
  assert.ok(dashboard.includes('Calendario de la campaña'));
  assert.ok(dashboard.includes('hora de Bogotá'));
});
