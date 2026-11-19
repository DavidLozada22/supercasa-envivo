-- Atribución de campañas: visitas y aportes por UTM o enlace de referido.
create table if not exists visits (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  session_id text not null,
  path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  ref_code text
);

create index if not exists visits_created_idx on visits (created_at desc);

alter table donations add column if not exists attribution jsonb;
