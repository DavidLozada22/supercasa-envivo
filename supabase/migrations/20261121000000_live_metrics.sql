-- Métricas en vivo: vistas por página y presencia para el panel interno.
create table if not exists live_pageviews (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  visitor_id text not null,
  path text not null
);

create index if not exists live_pageviews_created_idx on live_pageviews (created_at desc);
create index if not exists live_pageviews_path_idx on live_pageviews (path, created_at desc);

create table if not exists live_presence (
  visitor_id text not null,
  path text not null,
  last_seen timestamptz not null default now(),
  primary key (visitor_id, path)
);

create index if not exists live_presence_seen_idx on live_presence (last_seen desc);
