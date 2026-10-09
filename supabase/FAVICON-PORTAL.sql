-- Jalankan sekali sahaja di Supabase SQL Editor.
-- Menggunakan polisi admin dan bucket ubk-posters yang sedia ada.
alter table public.site_settings add column if not exists favicon_url text;
