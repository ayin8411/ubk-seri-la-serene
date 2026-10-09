-- Jalankan sekali di Supabase SQL Editor jika menu baharu belum muncul.
-- Menggunakan jadual media_items dan bucket ubk-posters sedia ada.
INSERT INTO public.navigation(label,href,order_no,is_active)
SELECT 'SERENE TERAJU','/serene-teraju',COALESCE((SELECT MAX(order_no) FROM public.navigation),6)+1,true
WHERE NOT EXISTS(SELECT 1 FROM public.navigation WHERE href='/serene-teraju');
-- Semak bahawa polisi RLS admin untuk media_items serta Storage ubk-posters sudah aktif.
NOTIFY pgrst, 'reload schema';
