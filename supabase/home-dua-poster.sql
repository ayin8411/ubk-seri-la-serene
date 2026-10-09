-- Jalankan sekali sahaja di Supabase SQL Editor sebelum menggunakan fungsi upload dashboard.
-- Tidak memadam atau mengubah data portal sedia ada.
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS serene_image_url text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_image_url text;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ubk-posters', 'ubk-posters', true, 10485760, ARRAY['image/png','image/jpeg','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "UBK poster public read" ON storage.objects;
CREATE POLICY "UBK poster public read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'ubk-posters');
DROP POLICY IF EXISTS "UBK poster admin upload" ON storage.objects;
CREATE POLICY "UBK poster admin upload" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'ubk-posters' AND coalesce(auth.jwt()->'app_metadata'->>'role','') = 'admin');

-- Jadikan kedua-dua poster baharu sebagai paparan asal untuk pemasangan ini.
UPDATE public.site_settings
SET contact_image_url = '/jom-hubungi-gbk-anda.png',
    serene_image_url = '/seri-la-serene-di-hati.png'
WHERE id = 1;
