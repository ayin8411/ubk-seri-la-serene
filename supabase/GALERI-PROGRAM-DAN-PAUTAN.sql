-- UBK SERI LA SERENE: galeri program + pengurusan pautan website
-- Jalankan SEKALI di Supabase SQL Editor pada projek portal ini.
-- Tidak memadam data lama.
INSERT INTO public.navigation(label,href,order_no,is_active)
SELECT 'GALERI PROGRAM','/galeri-program',COALESCE((SELECT max(order_no) FROM public.navigation),8)+1,true
WHERE NOT EXISTS (SELECT 1 FROM public.navigation WHERE href='/galeri-program');

CREATE TABLE IF NOT EXISTS public.external_links (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL,
 url text NOT NULL CHECK (url ~* '^https?://'),
 description text DEFAULT '',
 placement text NOT NULL DEFAULT 'nav' CHECK (placement IN ('nav','home')),
 order_no integer NOT NULL DEFAULT 20,
 is_active boolean NOT NULL DEFAULT true,
 created_at timestamptz DEFAULT now()
);
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "UBK external links public read" ON public.external_links;
CREATE POLICY "UBK external links public read" ON public.external_links FOR SELECT TO anon,authenticated USING (is_active=true);
DROP POLICY IF EXISTS "UBK external links admin read" ON public.external_links;
CREATE POLICY "UBK external links admin read" ON public.external_links FOR SELECT TO authenticated USING (coalesce(auth.jwt()->'app_metadata'->>'role','')='admin');
DROP POLICY IF EXISTS "UBK external links admin insert" ON public.external_links;
CREATE POLICY "UBK external links admin insert" ON public.external_links FOR INSERT TO authenticated WITH CHECK (coalesce(auth.jwt()->'app_metadata'->>'role','')='admin');
DROP POLICY IF EXISTS "UBK external links admin update" ON public.external_links;
CREATE POLICY "UBK external links admin update" ON public.external_links FOR UPDATE TO authenticated USING (coalesce(auth.jwt()->'app_metadata'->>'role','')='admin') WITH CHECK (coalesce(auth.jwt()->'app_metadata'->>'role','')='admin');
DROP POLICY IF EXISTS "UBK external links admin delete" ON public.external_links;
CREATE POLICY "UBK external links admin delete" ON public.external_links FOR DELETE TO authenticated USING (coalesce(auth.jwt()->'app_metadata'->>'role','')='admin');
NOTIFY pgrst,'reload schema';
-- PENTING: Akaun admin mesti ditetapkan app_metadata.role=admin, bukan user_metadata.
-- Galeri Program menggunakan jadual media_items dan bucket ubk-posters yang sedia ada.
-- Pastikan polisi RLS media_items dan Storage membenarkan akaun admin.
