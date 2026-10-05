-- UBK SERI LA SERENE - pembaikan struktur pangkalan data sedia ada
-- Jalankan di Supabase > SQL Editor > New query > Run

create table if not exists public.appointments (
  id bigint generated always as identity primary key,
  student_name text,
  student_class text,
  appointment_date date,
  appointment_time time,
  reason text,
  notes text,
  status text default 'BARU',
  created_at timestamptz default now()
);
alter table public.appointments add column if not exists student_name text;
alter table public.appointments add column if not exists student_class text;
alter table public.appointments add column if not exists appointment_date date;
alter table public.appointments add column if not exists appointment_time time;
alter table public.appointments add column if not exists reason text;
alter table public.appointments add column if not exists notes text;
alter table public.appointments add column if not exists status text default 'BARU';
alter table public.appointments add column if not exists created_at timestamptz default now();

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  name text,
  message text,
  rating int,
  created_at timestamptz default now()
);
alter table public.feedback add column if not exists name text;
alter table public.feedback add column if not exists message text;
alter table public.feedback add column if not exists rating int;
alter table public.feedback add column if not exists created_at timestamptz default now();

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  created_at timestamptz default now()
);
alter table public.page_views add column if not exists path text;
alter table public.page_views add column if not exists created_at timestamptz default now();

alter table public.appointments enable row level security;
alter table public.feedback enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "public create appointment" on public.appointments;
create policy "public create appointment" on public.appointments for insert to anon,authenticated with check(true);

drop policy if exists "public create feedback" on public.feedback;
create policy "public create feedback" on public.feedback for insert to anon,authenticated with check(true);

drop policy if exists "public create pageview" on public.page_views;
create policy "public create pageview" on public.page_views for insert to anon,authenticated with check(true);

drop policy if exists "admin appointments" on public.appointments;
create policy "admin appointments" on public.appointments for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','')='admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','')='admin');

drop policy if exists "admin feedback" on public.feedback;
create policy "admin feedback" on public.feedback for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','')='admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','')='admin');

drop policy if exists "admin views" on public.page_views;
create policy "admin views" on public.page_views for select to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','')='admin');

-- Minta PostgREST muat semula schema cache selepas perubahan kolum.
notify pgrst, 'reload schema';
