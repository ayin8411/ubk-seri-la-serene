-- JALANKAN SEKALI SAHAJA di Supabase > SQL Editor
alter table public.site_settings add column if not exists contact_image_url text;

create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  order_no int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
create table if not exists public.alumni (
  id bigint generated always as identity primary key,
  name text not null,
  batch text,
  course text,
  institution text,
  photo_url text,
  order_no int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.announcements enable row level security;
alter table public.alumni enable row level security;
drop policy if exists "public read announcements" on public.announcements;
create policy "public read announcements" on public.announcements for select to anon,authenticated using(true);
drop policy if exists "public read alumni" on public.alumni;
create policy "public read alumni" on public.alumni for select to anon,authenticated using(true);
drop policy if exists "admin announcements" on public.announcements;
create policy "admin announcements" on public.announcements for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
drop policy if exists "admin alumni" on public.alumni;
create policy "admin alumni" on public.alumni for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
