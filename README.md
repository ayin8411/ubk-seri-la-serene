# UBK SERI LA SERENE

Landing page + admin dashboard (Next.js + Supabase), tema biru/kuning.

## Fungsi
- Logo sekolah & UBK boleh ditukar melalui dashboard (URL imej)
- Menu navigasi boleh ditambah/dipadam
- Carousel highlight
- Video homepage
- Pengurusan: visi, misi, carta organisasi, Google Drive
- Psikometrik: pautan Google Drive
- Minda Sihat: tips + video
- CareerSnap: video + PDF/resources
- Temujanji murid
- Apa Kata Anda + rating
- Statistik page views
- Admin login menggunakan Supabase Auth
- RLS melindungi data temujanji/maklum balas daripada bacaan awam

## Setup Supabase
1. Cipta projek Supabase.
2. SQL Editor > tampal dan Run `supabase/schema.sql`.
3. Authentication > Users > cipta user admin (email/password).
4. SQL Editor > jadikan user itu admin melalui `app_metadata`:
   `update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb where email='EMAIL_ADMIN_ANDA';`
   Selepas itu log keluar dan log masuk semula supaya token JWT menerima role admin.
5. Project > Connect: salin Project URL dan Publishable key.
6. Cipta `.env.local` berdasarkan `.env.example`.

## Jalankan
```bash
npm install
npm run dev
```
Buka `http://localhost:3000` dan dashboard `http://localhost:3000/admin`.

## Deploy Vercel
Import repo/folder ini ke Vercel dan tambah dua Environment Variables yang sama:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Kemudian Deploy.

## Video
Gunakan URL embed, contoh YouTube embed: `https://www.youtube.com/embed/VIDEO_ID`.

## Logo/Gambar
Versi ini menggunakan URL imej supaya mudah. Anda boleh letak fail di Supabase Storage kemudian tampal public URL melalui dashboard.


## Versi framework
Projek ini menggunakan Next.js 16.3.8 (Active LTS security release) dan React 19.2.4.

## Dashboard Admin - versi edit penuh
Versi ini menambah fungsi Edit untuk Navigasi, Carousel, Carta Organisasi, Minda Sihat, Media dan CareerSnap. Untuk Carta Organisasi, admin boleh menukar nama, jawatan, URL foto dan susunan paparan. Visi dan Misi diedit melalui tab `Identiti & Pautan`.

## CareerSnap carousel
Untuk galeri hiasan kecil di bawah halaman CareerSnap:
- Bahagian: `careersnap`
- Jenis Media: `carousel`
- URL: pautan imej Supabase
- Susunan Paparan: 1, 2, 3 dan seterusnya

Carousel memaparkan kira-kira 3 gambar pada desktop, 1 gambar pada telefon, auto-scroll perlahan dan boleh swipe/tekan anak panah.


## Kemas kini Minda Sihat — 2 poster besar sebaris
- TIPS MINDA SIHAT kini memaparkan 2 poster portrait besar dalam satu baris pada desktop.
- INFOGRAFIK MINDA SIHAT ditambah di bawah TIPS MINDA SIHAT dengan saiz paparan yang sama.
- Kedua-dua ruang diurus dari Dashboard → Media melalui pilihan Bahagian `tips_minda_sihat` atau `infografik_minda_sihat`.
- Tablet/telefon bertukar kepada 1 poster sebaris supaya teks kekal mudah dibaca.


## Kemas kini v6 — Minda Sihat
- Poster TIPS MINDA SIHAT dan INFOGRAFIK MINDA SIHAT dibesarkan dengan 2 poster portrait satu baris pada desktop.
- Setiap poster boleh menggunakan lebar sehingga 520px supaya teks lebih mudah dibaca.
- Pada tablet dan telefon, poster menjadi 1 satu baris.
- Dashboard kini mempunyai tab khusus `Tips Kesejahteraan` untuk tambah, edit, padam dan susun semula kandungan kad Tips Kesejahteraan.


## Kemaskini Tips Kesejahteraan
Tab **Tips Kesejahteraan** dalam Dashboard kini mempunyai medan **Tajuk Besar** sebelum **Tajuk**. Medan ini dipaparkan pada kad Tips Kesejahteraan di halaman Minda Sihat. Pangkalan data Supabase telah ditambah lajur `big_title`.
