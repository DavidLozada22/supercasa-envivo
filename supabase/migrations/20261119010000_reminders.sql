create extension if not exists pgcrypto;

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  consent boolean not null default true,
  source text,
  ref_code text,
  sent_at timestamptz
);

create unique index if not exists reminders_email_idx on reminders (lower(email));
create index if not exists reminders_created_idx on reminders (created_at desc);
