import { dbClient } from "@/lib/donations/store";
import type { Attribution } from "@/lib/attribution";

export async function insertVisit(input: {
  sessionId: string;
  path: string;
  referrer?: string | null;
  attribution: Attribution;
}): Promise<void> {
  const db = dbClient();
  if (!db) return;
  await db`
    insert into visits (session_id, path, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, ref_code)
    values (
      ${input.sessionId.slice(0, 64)},
      ${input.path.slice(0, 200)},
      ${input.referrer?.slice(0, 300) ?? null},
      ${input.attribution.source ?? null},
      ${input.attribution.medium ?? null},
      ${input.attribution.campaign ?? null},
      ${input.attribution.content ?? null},
      ${input.attribution.term ?? null},
      ${input.attribution.ref ?? null}
    )
  `;
}

export type VisitRow = { source: string; campaign: string; ref: string; visits: number };
export type DonationRow = { source: string; campaign: string; ref: string; donations: number; raised: number };

export async function attributionReport(days: number): Promise<{ visits: VisitRow[]; donations: DonationRow[] }> {
  const db = dbClient();
  if (!db) return { visits: [], donations: [] };
  const range = Math.min(90, Math.max(1, days));
  const visits = await db`
    select coalesce(utm_source, 'directo') as source,
           coalesce(utm_campaign, '') as campaign,
           coalesce(ref_code, '') as ref,
           count(*)::integer as visits
    from visits
    where created_at > now() - (${range} || ' days')::interval
    group by 1, 2, 3
    order by visits desc
    limit 25
  `;
  const donations = await db`
    select coalesce(attribution->>'source', 'directo') as source,
           coalesce(attribution->>'campaign', '') as campaign,
           coalesce(attribution->>'ref', '') as ref,
           count(*)::integer as donations,
           coalesce(sum(amount_cop), 0)::bigint as raised
    from donations
    where status = 'approved'
      and created_at > now() - (${range} || ' days')::interval
    group by 1, 2, 3
    order by donations desc
    limit 25
  `;
  return {
    visits: visits.map((row) => ({
      source: String(row.source),
      campaign: String(row.campaign),
      ref: String(row.ref),
      visits: Number(row.visits),
    })),
    donations: donations.map((row) => ({
      source: String(row.source),
      campaign: String(row.campaign),
      ref: String(row.ref),
      donations: Number(row.donations),
      raised: Number(row.raised),
    })),
  };
}
