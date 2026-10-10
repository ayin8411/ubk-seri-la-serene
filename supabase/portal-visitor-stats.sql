-- Jalankan SEKALI dalam Supabase > SQL Editor > New query > Run.
-- Statistik jumlah PAPARAN halaman sahaja. Akses rekod mentah kekal terhad.
create or replace function public.portal_visitor_stats()
returns jsonb
language sql
security definer
set search_path = ''
as $$
 select jsonb_build_object(
  'total',count(*),
  'today',count(*) filter (where created_at >= (date_trunc('day',now() at time zone 'Asia/Kuala_Lumpur') at time zone 'Asia/Kuala_Lumpur') and created_at < ((date_trunc('day',now() at time zone 'Asia/Kuala_Lumpur') + interval '1 day') at time zone 'Asia/Kuala_Lumpur')),
  'week',count(*) filter (where created_at >= now() - interval '7 days')
 )
 from public.page_views;
$$;
revoke all on function public.portal_visitor_stats() from public;
grant execute on function public.portal_visitor_stats() to anon, authenticated;
