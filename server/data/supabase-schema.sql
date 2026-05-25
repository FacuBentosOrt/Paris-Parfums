-- Ejecutar este script en SQL Editor de Supabase antes de usar la API.
create table if not exists public.perfumes (
  slug text primary key,
  name text not null,
  "imageUrl" text not null default '',
  price integer not null check (price >= 0 and price <= 10000),
  family text not null default '',
  "shortDescription" text not null,
  "heroDescription" text not null,
  "detailedDescription" text not null,
  narrative text not null,
  volume text not null default '',
  concentration text not null default '',
  badge text not null default '',
  notes text[] not null default '{}',
  occasions text[] not null default '{}',
  intensity text not null default '',
  duration text not null default '',
  "createdAt" timestamptz not null default now()
);

create index if not exists perfumes_created_at_idx on public.perfumes ("createdAt");

alter table public.perfumes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'perfumes' and policyname = 'perfumes_select_public'
  ) then
    create policy perfumes_select_public
      on public.perfumes
      for select
      using (true);
  end if;
end $$;

-- Las operaciones de escritura se recomiendan con service role key desde backend.
