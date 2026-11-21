import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('el formulario conserva el diseño original de Sebastián', () => {
  const flow = readFileSync('components/campaign/DonationFlow.tsx', 'utf8');
  const pieces = readFileSync('lib/donations/pieces.ts', 'utf8');
  for (const marker of ['stepper', 'piece__badge', 'check--fee', 'data-astro-cid-erlevsxa', 'certificate']) {
    assert.ok(flow.includes(marker), `Falta ${marker}`);
  }
  assert.ok(flow.includes('Plan Padrino mensual'));
  assert.ok(pieces.includes('Calvito la recomienda'));
});

test('hay una sola ruta pública de donación', () => {  for (const file of ['app/donar/page.tsx', 'components/landing/LandingMarkup.tsx']) {
    const source = readFileSync(file, 'utf8');
    assert.ok(!source.includes('supercasa.segundosdevida.com'), `${file} no debe enviar a otro portal de donaciones`);
  }
});

test('el aporte pendiente se reconcilia con Wompi aunque el webhook no llegue', () => {
  const wompi = readFileSync('lib/donations/wompi.ts', 'utf8');
  const service = readFileSync('lib/donations/service.ts', 'utf8');
  const store = readFileSync('lib/donations/store.ts', 'utf8');

  assert.ok(wompi.includes('findTransactionByReference'), 'Falta la búsqueda por referencia');
  assert.ok(wompi.includes('reference,') && wompi.includes('from_date'), 'La consulta a Wompi debe usar referencia y ventana de fechas');
  assert.ok(service.includes('findTransactionByReference(reference'), 'donationStatus debe consultar por referencia');
  assert.ok(service.includes('export async function reconcilePending'), 'Falta reconcilePending');
  assert.ok(store.includes('export async function pendingWompi'), 'Falta el listado de pendientes');
});

test('la consulta de estado no martilla la API de Wompi en cada ciclo', () => {
  const service = readFileSync('lib/donations/service.ts', 'utf8');
  assert.ok(service.includes('PROVIDER_CHECK_MS'), 'Falta el intervalo entre consultas');
  assert.ok(service.includes('shouldQueryProvider(reference)'), 'La consulta debe pasar por el control de frecuencia');
});

test('hay respaldo diario por si el webhook no entrega el evento', () => {
  const route = readFileSync('app/api/cron/reconcile/route.ts', 'utf8');
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.ok(route.includes('reconcilePending'), 'La ruta debe conciliar pendientes');
  assert.ok(
    (config.crons ?? []).some((cron) => cron.path === '/api/cron/reconcile'),
    'vercel.json debe programar la conciliación diaria',
  );
});

test('los intentos abandonados no quedan pendientes para siempre', () => {
  const service = readFileSync('lib/donations/service.ts', 'utf8');
  assert.ok(service.includes('ABANDONED_AFTER_MS'), 'Falta el margen para cerrar intentos');
  assert.ok(service.includes('intento abandonado'), 'El cierre debe quedar explicado');
  assert.ok(service.includes('expired += 1'), 'La conciliación debe contar los vencidos');
});

test('el catálogo del formulario y el del servidor coinciden', () => {
  const ui = readFileSync('lib/donations/pieces.ts', 'utf8');
  const server = readFileSync('lib/donations/catalog.ts', 'utf8');

  const parse = (source, priceKey) =>
    [...source.matchAll(/id:\s*"([^"]+)"[\s\S]*?price:\s*([\d_]+)/g)].map((m) => m[1]);
  const parseAmount = (source) =>
    Object.fromEntries(
      [...source.matchAll(/id:\s*"([^"]+)"[\s\S]*?amount:\s*([\d_]+)/g)].map((m) => [
        m[1],
        Number(m[2].replaceAll('_', '')),
      ]),
    );
  const parsePrice = (source) =>
    Object.fromEntries(
      [...source.matchAll(/id:\s*"([^"]+)"[\s\S]*?price:\s*([\d_]+)/g)].map((m) => [
        m[1],
        Number(m[2].replaceAll('_', '')),
      ]),
    );

  const uiIds = parse(ui, 'price');
  const serverAmounts = parseAmount(server);
  const uiPrices = parsePrice(ui);

  for (const id of uiIds) {
    assert.ok(serverAmounts[id] !== undefined, `La pieza ${id} existe en el formulario pero no en el servidor`);
    assert.equal(serverAmounts[id], uiPrices[id], `El monto de ${id} no coincide`);
  }
});
