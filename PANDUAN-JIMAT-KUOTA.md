# UBK SERI LA SERENE — Versi Jimat Kuota Supabase

## Perubahan
- Video MP4 pada HOME, CareerSnap, Minda Sihat dan Kami Benci Buli kini memerlukan pengguna menekan **Main Video** sebelum URL media dimasukkan dalam pemain. Tiada muat turun video automatik sewaktu halaman dibuka.
- Video menggunakan `preload="none"`, dengan kawalan video biasa masih tersedia selepas dimainkan.
- Carousel infografik hanya memuatkan gambar aktif; gambar lain dimuatkan apabila dipilih. Auto-slaid berhenti sementara apabila bahagian carousel tidak kelihatan atau tab disembunyikan.
- Carousel bergulir hanya bergerak secara automatik apabila berada dalam paparan.
- Beberapa imej besar dan PDF menggunakan pemuatan lazy.
- Kod Dashboard Admin, temujanji, statistik, SERENE Mood Scan, permainan ZEP, borang dan sambungan Supabase tidak diubah.

## Penting
1. Deploy ZIP ini sebagai versi baharu ke projek Vercel **yang sama**, supaya domain sedia ada kekal digunakan.
2. Semak HOME dan CareerSnap: butang **Main Video** mesti dipaparkan sebelum pemain video dimuatkan.
3. Pastikan video boleh dimainkan selepas butang ditekan; jika pautan Supabase jenis `/object/sign/` telah tamat tempoh, buat pautan baharu atau gunakan pautan awam **hanya untuk bahan tidak sensitif**.
4. Pantau Supabase → Organization → Usage → Cached Egress. Perubahan ini mengurangkan permintaan masa hadapan tetapi **tidak memadam penggunaan lepas**.
5. Tiada SQL perlu dijalankan untuk perubahan ini dan tiada rekod Supabase dipadamkan.

## Perhatian
Angka sebenar penjimatan bergantung pada jumlah pelawat dan video yang mereka pilih untuk tonton. Jika had Free Tier masih dilepasi, perlu tunggu tetapan semula kitaran penggunaan atau pertimbangkan hosting media/video yang lebih sesuai.
