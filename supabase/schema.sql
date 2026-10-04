-- UBK SERI LA SERENE schema
create table if not exists public.site_settings (id int primary key default 1,title text,tagline text,school_logo_url text,ubk_logo_url text,hero_title text,hero_text text,vision text,mission text,management_drive_url text,psychometric_drive_url text,appointment_intro text,updated_at timestamptz default now());
create table if not exists public.navigation (id bigint generated always as identity primary key,label text not null,href text not null,order_no int default 0,is_active boolean default true);
create table if not exists public.carousel_items (id bigint generated always as identity primary key,title text not null,subtitle text,image_url text not null,order_no int default 0,is_active boolean default true);
create table if not exists public.organization_members (id bigint generated always as identity primary key,role text not null,name text not null,photo_url text,order_no int default 0);
create table if not exists public.mental_health_tips (id bigint generated always as identity primary key,title text not null,body text not null,order_no int default 0,is_active boolean default true);
create table if not exists public.media_items (id bigint generated always as identity primary key,section text not null,type text not null,title text,url text not null,order_no int default 0,is_active boolean default true);
create table if not exists public.careersnap_resources (id bigint generated always as identity primary key,title text not null,description text,url text not null,resource_type text default 'pdf',order_no int default 0,is_active boolean default true);
create table if not exists public.appointments (id bigint generated always as identity primary key,student_name text not null,student_class text not null,appointment_date date not null,appointment_time time not null,reason text not null,notes text,status text default 'BARU',created_at timestamptz default now());
create table if not exists public.feedback (id bigint generated always as identity primary key,name text,message text not null,rating int check(rating between 1 and 4),created_at timestamptz default now());
create table if not exists public.page_views (id bigint generated always as identity primary key,path text not null,created_at timestamptz default now());

insert into public.site_settings(id,title,tagline,vision,mission,management_drive_url,psychometric_drive_url,appointment_intro)
values(1,'UBK SERI LA SERENE','Aura Positif, Minda Progresif, Murid Proaktif','Perkhidmatan bimbingan dan kaunseling yang berkualiti ke arah kesejahteraan dan kecemerlangan murid.','Membimbing murid mengenali potensi diri, membuat keputusan bijak dan membina masa depan yang positif.','#','#','Pilih masa yang sesuai dan hantar permohonan temujanji.')
on conflict(id) do nothing;
insert into public.navigation(label,href,order_no) select * from (values ('UTAMA','/',1),('PENGURUSAN','/pengurusan',2),('PSIKOMETRIK','/psikometrik',3),('MINDA SIHAT','/minda-sihat',4),('CAREERSNAP','/careersnap',5)) v where not exists(select 1 from public.navigation);

alter table public.site_settings enable row level security;alter table public.navigation enable row level security;alter table public.carousel_items enable row level security;alter table public.organization_members enable row level security;alter table public.mental_health_tips enable row level security;alter table public.media_items enable row level security;alter table public.careersnap_resources enable row level security;alter table public.appointments enable row level security;alter table public.feedback enable row level security;alter table public.page_views enable row level security;

-- Admin authorization uses trusted app_metadata from Supabase Auth.
-- After creating the admin user, set app_metadata.role = 'admin' (see README).

-- Public reads for website content
create policy "public read site" on public.site_settings for select to anon,authenticated using(true);
create policy "public read nav" on public.navigation for select to anon,authenticated using(true);
create policy "public read carousel" on public.carousel_items for select to anon,authenticated using(true);
create policy "public read org" on public.organization_members for select to anon,authenticated using(true);
create policy "public read tips" on public.mental_health_tips for select to anon,authenticated using(true);
create policy "public read media" on public.media_items for select to anon,authenticated using(true);
create policy "public read resources" on public.careersnap_resources for select to anon,authenticated using(true);

-- Anonymous submissions only; no public read of student submissions
create policy "public create appointment" on public.appointments for insert to anon,authenticated with check(true);
create policy "public create feedback" on public.feedback for insert to anon,authenticated with check(true);
create policy "public create pageview" on public.page_views for insert to anon,authenticated with check(true);

-- Admin CRUD
create policy "admin site" on public.site_settings for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin nav" on public.navigation for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin carousel" on public.carousel_items for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin org" on public.organization_members for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin tips" on public.mental_health_tips for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin media" on public.media_items for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin resources" on public.careersnap_resources for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin appointments" on public.appointments for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin feedback" on public.feedback for all to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin') with check(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');
create policy "admin views" on public.page_views for select to authenticated using(coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');

-- After creating the admin user in Supabase Auth, run this with the real email:
-- update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb where email='admin@example.com';


-- Editable Pengurusan page fields
alter table public.site_settings
  add column if not exists management_badge text default 'PENGURUSAN',
  add column if not exists management_title text default 'Pengurusan UBK',
  add column if not exists management_intro text default 'Visi, misi, organisasi dan akses pengurusan fail.',
  add column if not exists management_org_title text default 'Carta Organisasi',
  add column if not exists management_files_title text default 'PENGURUSAN FAIL',
  add column if not exists management_files_text text default 'Akses folder pengurusan yang dipautkan dengan Google Drive.',
  add column if not exists management_files_button text default 'Buka Google Drive';
