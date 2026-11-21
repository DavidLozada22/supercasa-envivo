import { dbClient } from "@/lib/donations/store";

export const TRACKED_PATHS = ["/", "/envivo", "/donar", "/recorrido", "/programa"] as const;
type TrackedPath = (typeof TRACKED_PATHS)[number];

const LIVE_WINDOW = "70 seconds";

export function cleanPath(value: string): TrackedPath | "" {
  const path = (value || "").split("?")[0].split("#")[0].slice(0, 120);
  if (path === "/donar/gracias") return "/donar";
  for (const item of TRACKED_PATHS) {
    if (path === item) return item;
    if (item !== "/" && path.startsWith(`${item}/`)) return item;
  }
  return "";
}

export function isBotUserAgent(value: string | null): boolean {
  if (!value) return false;
  return /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|curl|wget|python-requests/i.test(
    value,
  );
}

type Sql = NonNullable<ReturnType<typeof dbClient>>;

let schemaReady: Promise<void> | null = null;

function ensureSchema(db: Sql): Promise<void> {
  schemaReady ??= (async () => {
    await db`
      create table if not exists live_pageviews (
        id bigserial primary key,
        created_at timestamptz not null default now(),
        visitor_id text not null,
        path text not null
      )
    `;
    await db`create index if not exists live_pageviews_created_idx on live_pageviews (created_at desc)`;
    await db`create index if not exists live_pageviews_path_idx on live_pageviews (path, created_at desc)`;
    await db`
      create table if not exists live_presence (
        visitor_id text not null,
        path text not null,
        last_seen timestamptz not null default now(),
        primary key (visitor_id, path)
      )
    `;
    await db`create index if not exists live_presence_seen_idx on live_presence (last_seen desc)`;
  })().catch(() => {
    schemaReady = null;
  });
  return schemaReady;
}

function cleanVisitor(value: string): string {
  return (value || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
}

export async function recordLiveEvent(input: {
  visitorId: string;
  path: string;
  kind: "view" | "ping";
}): Promise<void> {
  const db = dbClient();
  if (!db) return;

  const path = cleanPath(input.path);
  const visitor = cleanVisitor(input.visitorId);
  if (!path || !visitor) return;

  await ensureSchema(db);

  if (input.kind === "view") {
    await db`insert into live_pageviews (visitor_id, path) values (${visitor}, ${path})`;
    await db`delete from live_presence where visitor_id = ${visitor} and path <> ${path}`;
  }

  await db`
    insert into live_presence (visitor_id, path, last_seen)
    values (${visitor}, ${path}, now())
    on conflict (visitor_id, path) do update set last_seen = now()
  `;

  if (Math.random() < 0.02) {
    await db`delete from live_presence where last_seen < now() - interval '1 day'`.catch(
      () => undefined,
    );
    await db`delete from live_pageviews where created_at < now() - interval '14 days'`.catch(
      () => undefined,
    );
  }
}

export type LiveSeriesPoint = {
  hour: string;
  label: string;
  envivo: number;
  donar: number;
  recorrido: number;
  home: number;
  total: number;
};

export type LiveReport = {
  enabled: boolean;
  now: { envivo: number; donar: number; recorrido: number; home: number; total: number };
  today: {
    visitors: number;
    views: number;
    envivo: number;
    donar: number;
    recorrido: number;
    home: number;
    uniqueEnvivo: number;
    uniqueDonar: number;
    uniqueRecorrido: number;
  };
  series: LiveSeriesPoint[];
  donations: {
    todayCount: number;
    todayRaised: number;
    last: { amount: number; name: string; at: string } | null;
  };
  updatedAt: string;
};

const EMPTY: LiveReport = {
  enabled: false,
  now: { envivo: 0, donar: 0, recorrido: 0, home: 0, total: 0 },
  today: {
    visitors: 0,
    views: 0,
    envivo: 0,
    donar: 0,
    recorrido: 0,
    home: 0,
    uniqueEnvivo: 0,
    uniqueDonar: 0,
    uniqueRecorrido: 0,
  },
  series: [],
  donations: { todayCount: 0, todayRaised: 0, last: null },
  updatedAt: new Date().toISOString(),
};

function hourLabel(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Bogota",
  }).format(new Date(iso));
}

function emptySeries(): LiveSeriesPoint[] {
  const points: LiveSeriesPoint[] = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);
  for (let index = 11; index >= 0; index -= 1) {
    const date = new Date(now.getTime() - index * 3_600_000);
    const iso = date.toISOString();
    points.push({
      hour: iso,
      label: hourLabel(iso),
      envivo: 0,
      donar: 0,
      recorrido: 0,
      home: 0,
      total: 0,
    });
  }
  return points;
}

export async function liveReport(): Promise<LiveReport> {
  const db = dbClient();
  if (!db) return { ...EMPTY, updatedAt: new Date().toISOString() };

  await ensureSchema(db);

  const [presence, today, seriesRows, donationToday, lastDonation] = await Promise.all([
    db`
      select path, count(distinct visitor_id)::integer as viewers
      from live_presence
      where last_seen > now() - ${LIVE_WINDOW}::interval
      group by path
    `,
    db`
      select
        count(distinct visitor_id)::integer as visitors,
        count(*)::integer as views,
        count(*) filter (where path = '/envivo')::integer as envivo,
        count(*) filter (where path = '/donar')::integer as donar,
        count(*) filter (where path = '/recorrido')::integer as recorrido,
        count(*) filter (where path = '/')::integer as home,
        count(distinct visitor_id) filter (where path = '/envivo')::integer as unique_envivo,
        count(distinct visitor_id) filter (where path = '/donar')::integer as unique_donar,
        count(distinct visitor_id) filter (where path = '/recorrido')::integer as unique_recorrido
      from live_pageviews
      where (created_at at time zone 'America/Bogota')::date =
            (now() at time zone 'America/Bogota')::date
    `,
    db`
      select
        to_char(date_trunc('hour', created_at), 'YYYY-MM-DD"T"HH24:00:00"Z"') as hour,
        count(*) filter (where path = '/envivo')::integer as envivo,
        count(*) filter (where path = '/donar')::integer as donar,
        count(*) filter (where path = '/recorrido')::integer as recorrido,
        count(*) filter (where path = '/')::integer as home,
        count(*)::integer as total,
        count(distinct visitor_id)::integer as visitors
      from live_pageviews
      where created_at > now() - interval '12 hours'
      group by 1
      order by 1
    `,
    db`
      select count(*)::integer as count, coalesce(sum(amount_cop), 0)::bigint as raised
      from donations
      where status = 'approved'
        and (created_at at time zone 'America/Bogota')::date =
            (now() at time zone 'America/Bogota')::date
    `.catch(() => []),
    db`
      select amount_cop, coalesce(donor_name, '') as donor_name, created_at
      from donations
      where status = 'approved'
      order by created_at desc
      limit 1
    `.catch(() => []),
  ]);

  const now = { envivo: 0, donar: 0, recorrido: 0, home: 0, total: 0 };
  for (const row of presence as unknown as Array<{ path: string; viewers: number }>) {
    const viewers = Number(row.viewers);
    if (row.path === "/envivo") now.envivo = viewers;
    else if (row.path === "/donar") now.donar = viewers;
    else if (row.path === "/recorrido") now.recorrido = viewers;
    else if (row.path === "/") now.home = viewers;
  }
  now.total = now.envivo + now.donar + now.recorrido + now.home;

  const todayRow = (today as unknown as Array<Record<string, unknown>>)[0] ?? {};
  const series = emptySeries();
  const byHour = new Map(series.map((point) => [point.hour.slice(0, 13), point]));

  for (const row of seriesRows as unknown as Array<Record<string, unknown>>) {
    const key = String(row.hour).slice(0, 13);
    const point = byHour.get(key);
    if (!point) continue;
    point.envivo = Number(row.envivo);
    point.donar = Number(row.donar);
    point.recorrido = Number(row.recorrido);
    point.home = Number(row.home);
    point.total = Number(row.total);
  }

  const donationRow = (donationToday as unknown as Array<Record<string, unknown>>)[0] ?? {};
  const lastRow = (lastDonation as unknown as Array<Record<string, unknown>>)[0] ?? null;

  return {
    enabled: true,
    now,
    today: {
      visitors: Number(todayRow.visitors ?? 0),
      views: Number(todayRow.views ?? 0),
      envivo: Number(todayRow.envivo ?? 0),
      donar: Number(todayRow.donar ?? 0),
      recorrido: Number(todayRow.recorrido ?? 0),
      home: Number(todayRow.home ?? 0),
      uniqueEnvivo: Number(todayRow.unique_envivo ?? 0),
      uniqueDonar: Number(todayRow.unique_donar ?? 0),
      uniqueRecorrido: Number(todayRow.unique_recorrido ?? 0),
    },
    series,
    donations: {
      todayCount: Number(donationRow.count ?? 0),
      todayRaised: Number(donationRow.raised ?? 0),
      last: lastRow
        ? {
            amount: Number(lastRow.amount_cop),
            name: String(lastRow.donor_name || "Donante"),
            at: new Date(String(lastRow.created_at)).toISOString(),
          }
        : null,
    },
    updatedAt: new Date().toISOString(),
  };
}
