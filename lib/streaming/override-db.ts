import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

const store = globalThis as unknown as {
  __supercasaLiveSql?: Sql;
  __supercasaLiveReady?: boolean;
};

export type OverrideRow = {
  videoId: string;
  updatedAt: string;
  updatedBy: string;
};

function db(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const clean = url.replace("channel_binding=require&", "").replace("channel_binding=require", "");
  store.__supercasaLiveSql ??= postgres(clean, {
    ssl: url.includes("localhost") ? false : "require",
    max: 1,
    idle_timeout: 20,
  });
  return store.__supercasaLiveSql;
}

async function ensure(sql: Sql): Promise<void> {
  if (store.__supercasaLiveReady) return;
  await sql`
    create table if not exists live_override (
      id smallint primary key,
      video_id text not null default '',
      updated_at timestamptz not null default now(),
      updated_by text not null default ''
    )`;
  store.__supercasaLiveReady = true;
}

export async function readOverrideRow(): Promise<OverrideRow | null> {
  const sql = db();
  if (!sql) return null;
  try {
    await ensure(sql);
    const rows = await sql`
      select video_id, updated_at, updated_by from live_override where id = 1`;
    const row = rows[0] as
      | { video_id?: string; updated_at?: Date; updated_by?: string }
      | undefined;
    if (!row?.video_id) return null;
    return {
      videoId: String(row.video_id),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : "",
      updatedBy: String(row.updated_by ?? ""),
    };
  } catch {
    return null;
  }
}

export async function writeOverrideRow(
  videoId: string,
  updatedBy: string,
): Promise<OverrideRow | null> {
  const sql = db();
  if (!sql) return null;
  await ensure(sql);
  const now = new Date();
  await sql`
    insert into live_override (id, video_id, updated_at, updated_by)
    values (1, ${videoId}, ${now}, ${updatedBy})
    on conflict (id) do update set
      video_id = excluded.video_id,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by`;
  return { videoId, updatedAt: now.toISOString(), updatedBy };
}

export async function clearOverrideRow(updatedBy: string): Promise<boolean> {
  const sql = db();
  if (!sql) return false;
  await ensure(sql);
  await sql`
    insert into live_override (id, video_id, updated_at, updated_by)
    values (1, '', now(), ${updatedBy})
    on conflict (id) do update set
      video_id = '',
      updated_at = now(),
      updated_by = excluded.updated_by`;
  return true;
}
