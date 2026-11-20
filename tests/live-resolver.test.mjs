import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLiveStatus } from '../lib/youtube/live.ts';

function ok(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const base = {
  videoId: 'AAA',
  live: true,
  source: 'api-live',
  checkedAt: '2026-11-21T05:59:00.000Z',
  changedAt: '2026-11-20T18:00:00.000Z',
  error: null,
  channelId: 'canal',
  history: [],
};

test('sin clave usa el ultimo ID y marca missing_key', async () => {
  const status = await resolveLiveStatus({
    key: '',
    fallbackId: 'FALLBACK',
    now: new Date('2026-11-20T18:00:00Z'),
  });
  assert.equal(status.videoId, 'FALLBACK');
  assert.equal(status.live, false);
  assert.equal(status.error, 'missing_key');
});

test('mantiene el directo si videos.list confirma que sigue en vivo', async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return ok({
      items: [{ snippet: { liveBroadcastContent: 'live' }, liveStreamingDetails: {} }],
    });
  };
  const status = await resolveLiveStatus({
    key: 'k',
    last: base,
    now: new Date('2026-11-21T06:00:00Z'),
    fetchImpl,
  });
  assert.equal(status.videoId, 'AAA');
  assert.equal(status.live, true);
  assert.equal(status.source, 'api-live');
  assert.ok(calls[0].includes('/videos'));
});

test('detecta el directo nuevo desde la lista de subidas', async () => {
  const fetchImpl = async (url) => {
    if (url.includes('/playlistItems')) {
      return ok({ items: [{ contentDetails: { videoId: 'BBB' } }] });
    }
    if (url.includes('id=BBB')) {
      return ok({
        items: [
          {
            id: 'BBB',
            snippet: { liveBroadcastContent: 'live' },
            liveStreamingDetails: {},
          },
        ],
      });
    }
    return ok({
      items: [
        {
          snippet: { liveBroadcastContent: 'none' },
          liveStreamingDetails: { actualEndTime: '2026-11-21T06:00:00Z' },
        },
      ],
    });
  };
  const status = await resolveLiveStatus({
    key: 'k',
    last: base,
    now: new Date('2026-11-21T06:00:00Z'),
    fetchImpl,
  });
  assert.equal(status.videoId, 'BBB');
  assert.equal(status.live, true);
  assert.equal(status.source, 'api-uploads');
  assert.equal(status.history[0].to, 'BBB');
  assert.equal(status.history[0].reason, 'streak_ended');
});

test('si no hay directo conserva el ultimo ID y marca fuera de linea', async () => {
  const fetchImpl = async () =>
    ok({ items: [] });
  const status = await resolveLiveStatus({
    key: 'k',
    last: { ...base, live: false },
    now: new Date('2026-11-21T06:00:00Z'),
    fetchImpl,
  });
  assert.equal(status.videoId, 'AAA');
  assert.equal(status.live, false);
  assert.equal(status.source, 'api-uploads');
});

test('si el buscador responde 429 lo trata como cuota', async () => {
  const fetchImpl = async (url) => {
    if (url.includes('/videos')) {
      return ok({ items: [{ snippet: { liveBroadcastContent: 'none' } }] });
    }
    return ok({ error: { message: 'Quota exceeded' } }, 429);
  };
  const status = await resolveLiveStatus({
    key: 'k',
    last: base,
    now: new Date('2026-11-21T06:00:00Z'),
    fetchImpl,
  });
  assert.equal(status.error, 'quota');
});

test('si la cuota esta agotada conserva el estado', async () => {
  const fetchImpl = async () => ok({ error: { errors: [{ reason: 'quotaExceeded' }] } }, 403);
  const status = await resolveLiveStatus({
    key: 'k',
    last: base,
    now: new Date('2026-11-21T06:00:00Z'),
    fetchImpl,
  });
  assert.equal(status.error, 'quota');
  assert.equal(status.source, 'cached');
  assert.equal(status.videoId, 'AAA');
});

test('si la red falla conserva el estado', async () => {
  const fetchImpl = async () => {
    throw new Error('offline');
  };
  const status = await resolveLiveStatus({
    key: 'k',
    last: base,
    now: new Date('2026-11-21T06:00:00Z'),
    fetchImpl,
  });
  assert.equal(status.error, 'network');
  assert.equal(status.videoId, 'AAA');
  assert.equal(status.live, true);
});

test('respeta la cache de un minuto', async () => {
  let called = 0;
  const fetchImpl = async () => {
    called += 1;
    return ok({ items: [] });
  };
  const status = await resolveLiveStatus({
    key: 'k',
    last: { ...base, checkedAt: new Date().toISOString() },
    fetchImpl,
  });
  assert.equal(status.videoId, 'AAA');
  assert.equal(called, 0);
});
