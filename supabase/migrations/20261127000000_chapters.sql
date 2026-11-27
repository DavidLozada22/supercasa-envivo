-- Catálogo de capítulos del archivo de la maratón.
-- Los videos viven en Google Drive y el catálogo guarda su ID.
-- La tabla también se crea en tiempo de ejecución desde lib/chapters/store.ts.

create table if not exists chapters (
  id text primary key,
  slug text unique not null,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  category text not null default 'momentos',
  series text not null default '',
  episode integer,
  instagram text not null default '',
  website text not null default '',
  provider text not null default 'drive',
  provider_id text not null,
  duration_seconds integer not null default 0,
  poster_url text not null default '',
  published_at date not null default current_date,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);

create index if not exists chapters_status_order_idx on chapters (status, sort_order);

alter table chapters add column if not exists instagram text not null default '';
alter table chapters add column if not exists website text not null default '';
