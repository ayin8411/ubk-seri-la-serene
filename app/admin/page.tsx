'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/client'

const tabs = [
  'Ringkasan',
  'Identiti & Pautan',
  'Favicon Portal',
  'Halaman Pengurusan',
  'Navigasi',
  'Pengurusan Pautan Website',
  'ZON PERMAINAN MINDA SIHAT',
  'Galeri Program',
  'Carousel',
  'Pengumuman',
  'Jom Hubungi GBK Anda',
  'Seri La Serene Di Hati',
  'Jejak Alumni',
  'Organisasi',
  'Tips Kesejahteraan',
  'Media',
  'Pencapaian PRS/SLB',
  'Aktiviti SERENE TERAJU',
  'CareerSnap',
  'Temujanji',
  'Apa Kata Anda',
  'Statistik',
]

const fieldLabels: Record<string, string> = {
  label: 'Nama Menu',
  href: 'Pautan / URL',
  order_no: 'Susunan Paparan',
  big_title: 'Tajuk Besar',
  title: 'Tajuk',
  subtitle: 'Subtajuk',
  image_url: 'URL Gambar',
  role: 'Jawatan',
  name: 'Nama',
  photo_url: 'URL Foto',
  body: 'Penerangan Tip Kesejahteraan',
  section: 'Bahagian',
  type: 'Jenis Media',
  url: 'URL',
  description: 'Penerangan',
  resource_type: 'Jenis Bahan',
  batch: 'Batch SPM',
  course: 'Jurusan / Program',
  institution: 'Tempat Belajar',
}

const cfg: Record<string, [string, string[]]> = {
  Navigasi: ['navigation', ['label', 'href', 'order_no']],
  Carousel: ['carousel_items', ['title', 'subtitle', 'image_url', 'order_no']],
  Organisasi: ['organization_members', ['role', 'name', 'photo_url', 'order_no']],
  'Tips Kesejahteraan': ['mental_health_tips', ['big_title', 'title', 'body', 'order_no']],
  Media: ['media_items', ['section', 'type', 'title', 'url', 'order_no']],
  CareerSnap: ['careersnap_resources', ['title', 'description', 'url', 'resource_type', 'order_no']],
  Pengumuman: ['announcements', ['title', 'body', 'order_no']],
  'Jejak Alumni': ['alumni', ['name', 'batch', 'course', 'institution', 'photo_url', 'order_no']],
}

export default function Admin() {
  const [tab, setTab] = useState(tabs[0])
  const [user, setUser] = useState<any>(null)
  const [login, setLogin] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [data, setData] = useState<any>({})
  const [editing, setEditing] = useState<any>(null)
  const s = useMemo(() => createClient(), [])

  async function load() {
    if (!s) return
    const names = [
      'site_settings',
      'navigation',
      'carousel_items',
      'announcements',
      'alumni',
      'organization_members',
      'mental_health_tips',
      'media_items',
      'external_links',
      'careersnap_resources',
      'appointments',
      'feedback',
      'page_views',
    ]
    const out: any = {}
    for (const n of names) {
      let q = s.from(n).select('*')
      if (['navigation','carousel_items','announcements','alumni','organization_members','mental_health_tips','media_items','external_links','careersnap_resources'].includes(n)) {
        q = q.order('order_no', { ascending: true })
      } else {
        q = q.order('id', { ascending: false })
      }
      const res = await q
      out[n] = res.data || []
    }
    setData(out)
  }

  useEffect(() => {
    if (!s) return
    s.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) load()
    })
  }, [s])

  async function signIn(e: any) {
    e.preventDefault()
    if (!s) return
    const { data, error } = await s.auth.signInWithPassword(login)
    setMsg(error?.message || 'Log masuk berjaya')
    setUser(data.user)
    if (data.user) load()
  }

  async function saveSite(e: any) {
    e.preventDefault()
    if (!s) return
    const row = Object.fromEntries(new FormData(e.currentTarget).entries())
    const { error } = await s.from('site_settings').update(row).eq('id', 1)
    setMsg(error?.message || 'Visi, misi dan tetapan portal berjaya disimpan')
    await load()
  }

  async function saveFavicon(e: any) {
    e.preventDefault()
    if (!s) return
    const form = e.currentTarget as HTMLFormElement
    const file = (form.elements.namedItem('favicon_file') as HTMLInputElement)?.files?.[0]
    if (!file) { setMsg('Sila pilih fail gambar favicon dahulu.'); return }
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    if (!['png','jpg','jpeg','webp','ico'].includes(ext)) { setMsg('Format yang diterima: PNG, JPG, WEBP atau ICO.'); return }
    if (file.size > 2 * 1024 * 1024) { setMsg('Fail favicon mesti tidak melebihi 2MB.'); return }
    setMsg('Sedang memuat naik favicon...')
    const filename = `portal-favicons/favicon-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const contentType = ext === 'ico' ? 'image/x-icon' : file.type || 'image/png'
    const uploaded = await s.storage.from('ubk-posters').upload(filename, file, {contentType, upsert:false})
    if (uploaded.error) { setMsg(`Upload gagal: ${uploaded.error.message}`); return }
    const url = s.storage.from('ubk-posters').getPublicUrl(filename).data.publicUrl
    const {error} = await s.from('site_settings').update({favicon_url:url}).eq('id',1)
    if (error) { setMsg(`Favicon gagal disimpan: ${error.message}. Jalankan SQL FAVICON-PORTAL.sql dahulu.`); return }
    document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach(el=>el.remove())
    const link = document.createElement('link')
    link.rel = 'icon'; link.href = url; document.head.appendChild(link)
    setMsg('Favicon berjaya disimpan! Buka semula portal atau muat semula halaman untuk melihat logo baharu.')
    form.reset()
    await load()
  }

  async function resetFavicon() {
    const {error} = await s.from('site_settings').update({favicon_url:null}).eq('id',1)
    if (error) {setMsg(`Gagal mengembalikan favicon: ${error.message}`);return}
    document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach(el=>el.remove())
    const link = document.createElement('link');link.rel='icon';link.href='/favicon.png';document.head.appendChild(link)
    setMsg('Favicon asal UBK berjaya dipulihkan.')
    await load()
  }

  async function savePoster(e: any, column: 'contact_image_url' | 'serene_image_url') {
    e.preventDefault()
    if (!s) return
    setMsg('Menyimpan gambar...')
    const form = e.currentTarget as HTMLFormElement
    const file = (form.elements.namedItem('poster_file') as HTMLInputElement)?.files?.[0]
    let imageUrl = String((form.elements.namedItem('poster_url') as HTMLInputElement)?.value || '').trim()
    if (file) {
      if (!file.type.startsWith('image/')) { setMsg('Sila pilih fail gambar PNG, JPG atau WEBP.'); return }
      if (file.size > 10 * 1024 * 1024) { setMsg('Saiz gambar mestilah tidak melebihi 10MB.'); return }
      const extension = (file.name.split('.').pop() || 'png').toLowerCase()
      const filename = `${column}-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
      const result = await s.storage.from('ubk-posters').upload(filename, file, { contentType:file.type, upsert:false })
      if (result.error) { setMsg(`Gagal muat naik: ${result.error.message}. Pastikan SQL pemasangan telah dijalankan.`); return }
      imageUrl = s.storage.from('ubk-posters').getPublicUrl(filename).data.publicUrl
    }
    const { error } = await s.from('site_settings').update({ [column]: imageUrl || (column === 'contact_image_url' ? '/jom-hubungi-gbk-anda.png' : '/seri-la-serene-di-hati.png') }).eq('id', 1)
    setMsg(error ? `Gagal simpan: ${error.message}. Jalankan SQL pemasangan dahulu.` : 'Gambar berjaya dikemas kini. Muat semula halaman Home untuk melihat perubahan.')
    if (!error) { form.reset(); await load() }
  }

  async function addTerajuImage(e: any, section: string) {
    e.preventDefault()
    if (!s) return
    const form = e.currentTarget as HTMLFormElement
    const file = (form.elements.namedItem('teraju_file') as HTMLInputElement)?.files?.[0]
    const title = String((form.elements.namedItem('teraju_title') as HTMLInputElement)?.value || '').trim()
    const order_no = Number((form.elements.namedItem('teraju_order') as HTMLInputElement)?.value || 0)
    let url = String((form.elements.namedItem('teraju_url') as HTMLInputElement)?.value || '').trim()
    if (file) {
      if (!['image/png','image/jpeg','image/webp'].includes(file.type)) {setMsg('Gunakan PNG, JPG atau WEBP sahaja.');return}
      if (file.size > 10 * 1024 * 1024) {setMsg('Gambar maksimum 10MB.');return}
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const name = `portal-galleries/${section}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const result = await s.storage.from('ubk-posters').upload(name,file,{contentType:file.type,upsert:false})
      if (result.error) {setMsg(`Upload gagal: ${result.error.message}`);return}
      url = s.storage.from('ubk-posters').getPublicUrl(name).data.publicUrl
    }
    if (!url) {setMsg('Pilih gambar atau masukkan URL gambar.');return}
    const {error} = await s.from('media_items').insert({section,type:'image',title,url,order_no,is_active:true})
    setMsg(error ? `Tidak berjaya: ${error.message}` : 'Gambar berjaya ditambah. Sila refresh halaman SERENE TERAJU.')
    if (!error) form.reset()
    await load()
  }

  async function add(e: any, table: string) {
    e.preventDefault()
    if (!s) return
    const row: any = Object.fromEntries(new FormData(e.currentTarget).entries())
    if ('order_no' in row) row.order_no = Number(row.order_no || 0)
    row.is_active = true
    const { error } = await s.from(table).insert(row)
    setMsg(error?.message || 'Item berjaya ditambah')
    if (!error) e.currentTarget.reset()
    await load()
  }

  async function saveEdit(e: any) {
    e.preventDefault()
    if (!s || !editing) return
    const row: any = Object.fromEntries(new FormData(e.currentTarget).entries())
    if ('order_no' in row) row.order_no = Number(row.order_no || 0)
    const { error } = await s.from(editing.table).update(row).eq('id', editing.id)
    setMsg(error?.message || 'Perubahan berjaya disimpan')
    if (!error) setEditing(null)
    await load()
  }

  async function del(table: string, id: any) {
    if (!s) return
    if (!confirm('Padam item ini?')) return
    const { error } = await s.from(table).delete().eq('id', id)
    setMsg(error?.message || 'Item dipadam')
    if (editing?.id === id && editing?.table === table) setEditing(null)
    await load()
  }


  // Alih menu satu kedudukan; simpan susunan terus ke Supabase.
  async function moveNavigation(id: number, direction: -1 | 1) {
    if (!s) return
    const rows = [...(data.navigation || [])].sort((a:any,b:any) => (a.order_no ?? 0) - (b.order_no ?? 0) || Number(a.id) - Number(b.id))
    const at = rows.findIndex((r:any) => r.id === id)
    const target = at + direction
    if (at < 0 || target < 0 || target >= rows.length) return
    const [item] = rows.splice(at, 1)
    rows.splice(target, 0, item)
    // Gunakan jarak 10 agar susunan konsisten walaupun sebelum ini nombor sama.
    for (let i=0;i<rows.length;i++) {
      const {error} = await s.from('navigation').update({order_no:(i+1)*10}).eq('id', rows[i].id)
      if (error) {setMsg(`Gagal menyimpan susunan: ${error.message}`);await load();return}
    }
    setMsg('Susunan navigasi telah disimpan. Refresh portal untuk melihat perubahan.')
    await load()
  }

  async function addOrganizationSlot(orderNo: number) {
    if (!s) return
    const { data: created, error } = await s.from('organization_members').insert({
      name: 'Nama',
      role: 'Jawatan',
      photo_url: null,
      order_no: orderNo,
    }).select().single()
    setMsg(error?.message || `Ruang organisasi ${orderNo} berjaya ditambah. Tekan Edit untuk masukkan foto, nama dan jawatan.`)
    await load()
    if (!error && created) openEdit('organization_members', created, cfg.Organisasi[1])
  }

  async function updateAppointment(id: any, status: string) {
    if (!s) return
    const { error } = await s.from('appointments').update({ status }).eq('id', id)
    setMsg(error?.message || 'Status temujanji dikemas kini')
    await load()
  }

  function openEdit(table: string, row: any, fields: string[]) {
    setEditing({ table, id: row.id, row: { ...row }, fields })
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderField(field: string, defaultValue: any, edit = false) {
    const common: any = {
      key: field,
      name: field,
      defaultValue: defaultValue ?? '',
      placeholder: fieldLabels[field] || field,
    }
    const required = ['label', 'title', 'name', 'url', 'role'].includes(field)
    if (field === 'body' || field === 'description') return <textarea {...common} required={required} />
    if (field === 'section') return <select {...common}>
      <option value="">Pilih bahagian</option>
      <option value="home">HOME — Video pilihan di halaman utama</option>
      <option value="minda_sihat">Minda Sihat — Media biasa</option>
      <option value="tips_kesejahteraan">Tips Kesejahteraan — Poster portrait besar</option>
      <option value="tips_minda_sihat">TIPS MINDA SIHAT — Poster portrait besar (label lama)</option>
      <option value="infografik_minda_sihat">INFOGRAFIK MINDA SIHAT — Poster portrait besar</option>
      <option value="kami_benci_buli">KAMI BENCI BULI — Gambar / PDF / Video</option>
      <option value="careersnap">CareerSnap</option>
      <option value="galeri_program">GALERI PROGRAM — Carousel Gambar</option>
      <option value="serene_teraju_pencapaian">SERENE TERAJU — Pencapaian PRS/SLB</option>
      <option value="serene_teraju_aktiviti">SERENE TERAJU — Aktiviti</option>
    </select>
    return <input {...common} type={field === 'order_no' ? 'number' : 'text'} required={required} />
  }

  if (!hasSupabaseEnv()) {
    return <div className="adminMain"><div className="panel"><h1>Dashboard Admin — Demo</h1><p>Masukkan Supabase URL + Publishable Key untuk mengaktifkan dashboard.</p><a className="button" href="/">Lihat Landing Page</a></div></div>
  }

  if (!user) {
    return <div className="adminMain" style={{ maxWidth: 480, margin: '70px auto' }}>
      <form className="panel" onSubmit={signIn}>
        <h1>Log Masuk Admin</h1>
        <input type="email" placeholder="Email admin" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} required />
        <input type="password" placeholder="Kata laluan" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} required />
        <button>Log Masuk</button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  }

  const site = data.site_settings?.[0] || {}
  const c = cfg[tab]

  return <div className="adminShell">
    <aside className="adminSide">
      <h2>UBK Admin</h2>
      {tabs.map(x => <button key={x} className={tab === x ? 'active' : ''} onClick={() => { setTab(x); setEditing(null); setMsg('') }}>{x}</button>)}
      <button onClick={() => s?.auth.signOut().then(() => location.reload())}>Log Keluar</button>
    </aside>

    <main className="adminMain">
      <div className="adminTop">
        <div><h1>{tab}</h1><p>Urus kandungan portal UBK tanpa mengubah kod.</p></div>
        <a className="button yellow" href="/" target="_blank">Lihat Laman</a>
      </div>

      {msg && <div className="panel adminMessage">{msg}</div>}

      {tab === 'Ringkasan' && <>
        <div className="stats">
          <div className="stat"><span>Temujanji</span><strong>{data.appointments?.length || 0}</strong></div>
          <div className="stat"><span>Maklum balas</span><strong>{data.feedback?.length || 0}</strong></div>
          <div className="stat"><span>Page views</span><strong>{data.page_views?.length || 0}</strong></div>
        </div>
        <div className="panel adminGuide">
          <h3>Cara cepat mengedit portal</h3>
          <p><b>Favicon:</b> buka tab <b>Favicon Portal</b> untuk muat naik logo pada tab browser.</p>
          <p><b>Visi & Misi:</b> buka tab <b>Identiti & Pautan</b>.</p>
          <p><b>Nama, jawatan & foto carta organisasi:</b> buka tab <b>Organisasi</b> dan tekan <b>Edit</b>.</p>
          <p><b>Tips Kesejahteraan:</b> buka tab <b>Tips Kesejahteraan</b> untuk tambah, edit atau padam tajuk dan penerangan tip.</p>
          <p><b>Gambar:</b> tampal Public URL daripada Supabase Storage pada ruangan URL Gambar / URL Foto.</p><p><b>Video HOME:</b> buka tab <b>Media</b>, pilih Bahagian <b>HOME</b>, Jenis Media <b>video</b>, kemudian tampal pautan YouTube atau Public URL fail MP4.</p>
        </div>
      </>}

      {tab === 'Favicon Portal' && <div className="panel">
        <h3>Tetapan Favicon Portal UBK</h3>
        <p>Favicon ialah logo kecil pada tab pelayar. Admin boleh menukar logo tanpa mengubah kod atau deploy ZIP baharu.</p>
        <div style={{display:'flex',alignItems:'center',gap:18,margin:'18px 0',flexWrap:'wrap'}}>
          <img src={site.favicon_url || '/favicon.png'} alt="Pratonton favicon UBK" style={{width:96,height:96,objectFit:'contain',borderRadius:15,background:'#f3f7fc',padding:8}}/>
          <div><b>Pratonton Favicon Semasa</b><p>Disyorkan imej segi empat sama (512 × 512 piksel), bersaiz tidak melebihi 2MB.</p></div>
        </div>
        <form onSubmit={saveFavicon}>
          <label htmlFor="favicon_file">Pilih gambar favicon baharu (PNG, JPG, WEBP atau ICO)</label>
          <input id="favicon_file" name="favicon_file" type="file" accept=".png,.jpg,.jpeg,.webp,.ico,image/png,image/jpeg,image/webp,image/x-icon" required/>
          <div className="actionRow" style={{marginTop:16}}><button type="submit">Muat Naik &amp; Simpan Favicon</button><button type="button" className="secondaryBtn" onClick={resetFavicon}>Guna Semula Logo UBK Asal</button></div>
        </form>
        <p className="adminHelp">Penting: sebelum menggunakan fungsi ini buat kali pertama, jalankan fail <b>supabase/FAVICON-PORTAL.sql</b> dalam Supabase SQL Editor. Jika logo lama masih muncul, tutup dan buka semula tab atau kosongkan cache pelayar.</p>
      </div>}

      {tab === 'Identiti & Pautan' && <form className="panel" onSubmit={saveSite} key={site.updated_at || 'site'}>
        <h3>Identiti Portal</h3>
        <label>Tajuk Portal</label><input name="title" defaultValue={site.title} placeholder="Tajuk portal" />
        <label>Tagline</label><input name="tagline" defaultValue={site.tagline} placeholder="Tagline" />
        <label>URL Logo Sekolah</label><input name="school_logo_url" defaultValue={site.school_logo_url} placeholder="https://..." />
        <label>URL Logo UBK</label><input name="ubk_logo_url" defaultValue={site.ubk_logo_url} placeholder="https://..." />
        <div className="grid2 adminFormGrid">
          <div><label>Visi</label><textarea name="vision" defaultValue={site.vision} placeholder="Masukkan visi UBK" /></div>
          <div><label>Misi</label><textarea name="mission" defaultValue={site.mission} placeholder="Masukkan misi UBK" /></div>
        </div>
        <h3>Pautan</h3>
        <label>Google Drive Pengurusan</label><input name="management_drive_url" defaultValue={site.management_drive_url} placeholder="Link Google Drive Pengurusan" />
        <label>Google Drive Psikometrik</label><input name="psychometric_drive_url" defaultValue={site.psychometric_drive_url} placeholder="Link Google Drive Psikometrik" />
        <label>Penerangan Temujanji</label><textarea name="appointment_intro" defaultValue={site.appointment_intro} placeholder="Penerangan temujanji" />
        <button>Simpan Perubahan</button>
      </form>}

      {tab === 'Halaman Pengurusan' && <>
        <form className="panel" onSubmit={saveSite} key={`management-${site.updated_at || 'site'}`}>
          <div className="editHeader">
            <div><span className="pill">EDITOR HALAMAN</span><h3>Edit Keseluruhan Halaman Pengurusan</h3></div>
            <a className="button yellow" href="/pengurusan" target="_blank">Preview Halaman</a>
          </div>
          <h3>Header Portal</h3>
          <div className="grid2 adminFormGrid">
            <div><label>Tajuk Portal</label><input name="title" defaultValue={site.title} /></div>
            <div><label>Tagline</label><input name="tagline" defaultValue={site.tagline} /></div>
            <div><label>URL Logo Sekolah</label><input name="school_logo_url" defaultValue={site.school_logo_url} placeholder="https://..." /></div>
            <div><label>URL Logo UBK</label><input name="ubk_logo_url" defaultValue={site.ubk_logo_url} placeholder="https://..." /></div>
          </div>
          <h3>Bahagian Atas Halaman Pengurusan</h3>
          <div className="grid2 adminFormGrid">
            <div><label>Label Atas Halaman</label><input name="management_badge" defaultValue={site.management_badge || 'PENGURUSAN'} /></div>
            <div><label>Tajuk Utama Halaman</label><input name="management_title" defaultValue={site.management_title || 'Pengurusan UBK'} /></div>
          </div>
          <label>Penerangan Halaman</label><textarea name="management_intro" defaultValue={site.management_intro || 'Visi, misi, organisasi dan akses pengurusan fail.'} />
          <div className="grid2 adminFormGrid">
            <div><label>Visi</label><textarea name="vision" defaultValue={site.vision} /></div>
            <div><label>Misi</label><textarea name="mission" defaultValue={site.mission} /></div>
          </div>
          <label>Tajuk Carta Organisasi</label><input name="management_org_title" defaultValue={site.management_org_title || 'Carta Organisasi'} />
          <h3>Bahagian Pengurusan Fail</h3>
          <div className="grid2 adminFormGrid">
            <div><label>Tajuk</label><input name="management_files_title" defaultValue={site.management_files_title || 'PENGURUSAN FAIL'} /></div>
            <div><label>Teks Butang</label><input name="management_files_button" defaultValue={site.management_files_button || 'Buka Google Drive'} /></div>
          </div>
          <label>Penerangan</label><textarea name="management_files_text" defaultValue={site.management_files_text || 'Akses folder pengurusan yang dipautkan dengan Google Drive.'} />
          <label>Pautan Google Drive Pengurusan</label><input name="management_drive_url" defaultValue={site.management_drive_url} placeholder="https://drive.google.com/..." />
          <button>Simpan Semua Perubahan Halaman</button>
        </form>

        <div className="panel">
          <div className="editHeader">
            <div><span className="pill">MENU ATAS</span><h3>Navigasi Halaman</h3></div>
            <button onClick={() => setTab('Navigasi')}>Edit Menu Navigasi</button>
          </div>
          <p className="adminHelp">Nama menu dan pautan seperti UTAMA, PENGURUSAN, PSIKOMETRIK, MINDA SIHAT dan CAREERSNAP boleh diubah di sini.</p>
        </div>
        <div className="panel">
          <div className="editHeader"><div><span className="pill">CARTA ORGANISASI</span><h3>Edit Nama, Jawatan & Foto</h3></div></div>
          <p className="adminHelp">Tekan <b>Edit</b> pada mana-mana kad. URL foto boleh ditampal daripada Supabase Storage.</p>
        </div>
        <div className="orgAdminGrid">
          {(data.organization_members || []).map((r: any) => <div className="panel orgAdminCard" key={r.id}>
            {r.photo_url ? <img className="orgAdminPhoto" src={r.photo_url} alt={r.name} /> : <div className="orgAdminPhoto placeholder">FOTO</div>}
            <h3>{r.name || 'Belum diisi'}</h3>
            <p>{r.role || 'Jawatan belum diisi'}</p>
            <small>Susunan: {r.order_no ?? 0}</small>
            <div className="actionRow">
              <button onClick={() => { setTab('Organisasi'); openEdit('organization_members', r, cfg.Organisasi[1]) }}>Edit</button>
              <button className="dangerBtn" onClick={() => del('organization_members', r.id)}>Padam</button>
            </div>
          </div>)}
        </div>
        <div className="panel"><button onClick={() => setTab('Organisasi')}>+ Tambah Ahli Organisasi</button></div>
      </>}

      {(tab === 'Jom Hubungi GBK Anda' || tab === 'Seri La Serene Di Hati') && (() => {
        const first = tab === 'Jom Hubungi GBK Anda'
        const column = first ? 'contact_image_url' : 'serene_image_url'
        const current = site[column] || (first ? '/jom-hubungi-gbk-anda.png' : '/seri-la-serene-di-hati.png')
        return <form className="panel" onSubmit={e => savePoster(e, column)} key={`${column}-${current}`}>
          <div className="editHeader"><div><span className="pill">HOME • EDIT GAMBAR</span><h3>{first ? 'JOM HUBUNGI GBK ANDA' : 'SERI LA SERENE DI HATI'}</h3></div><a className="button yellow" href="/" target="_blank">Lihat Home</a></div>
          <p className="adminHelp">Pilih gambar dari komputer untuk menggantikan poster asal. Gambar akan disimpan di Supabase Storage dan dipaparkan di Home tanpa perlu deploy semula. Pilihan lain: tampal URL gambar.</p>
          <img src={current} alt={`Pratonton ${tab}`} style={{display:'block',width:'100%',maxWidth:480,maxHeight:600,objectFit:'contain',borderRadius:18,margin:'16px auto',background:'#f4f8fd'}} />
          <label>Muat Naik Gambar Baharu (PNG / JPG / WEBP, maksimum 10MB)</label>
          <input name="poster_file" type="file" accept="image/png,image/jpeg,image/webp" />
          <label>Atau URL Gambar</label>
          <input name="poster_url" type="text" defaultValue={current} placeholder="https://..." />
          <p className="adminHelp">Jika memilih fail gambar, fail tersebut akan digunakan walaupun URL diisi. Untuk kembali ke poster asal, kosongkan URL dan simpan tanpa memilih fail.</p>
          <button type="submit">Simpan & Tukar Gambar</button>
        </form>
      })()}

      {(tab === 'Pencapaian PRS/SLB' || tab === 'Aktiviti SERENE TERAJU' || tab === 'Galeri Program') && (() => {
        const achievement = tab === 'Pencapaian PRS/SLB'
        const section = tab==='Galeri Program' ? 'galeri_program' : achievement ? 'serene_teraju_pencapaian' : 'serene_teraju_aktiviti'
        const items = (data.media_items || []).filter((item:any)=>item.section === section)
        return <div className="panel">
          <div className="editHeader"><div><span className="pill">GALERI • CAROUSEL</span><h3>{tab}</h3></div><a className="button yellow" href={tab === 'Galeri Program' ? '/galeri-program' : '/serene-teraju'} target="_blank">Lihat Halaman</a></div>
          <p className="adminHelp">Muat naik gambar dari komputer atau tampal URL. Gambar boleh ditambah sebanyak mana yang diperlukan, dipaparkan mengikut susunan nombor.</p>
          <form onSubmit={e=>addTerajuImage(e,section)}>
            <label>Tajuk / kapsyen gambar</label><input name="teraju_title" placeholder="Contoh: Anugerah PRS Peringkat Daerah" />
            <label>Pilih gambar PNG / JPG / WEBP (maksimum 10MB)</label><input name="teraju_file" type="file" accept="image/png,image/jpeg,image/webp" />
            <label>Atau URL gambar</label><input name="teraju_url" placeholder="https://..." />
            <label>Susunan Paparan</label><input name="teraju_order" type="number" defaultValue={items.length+1} />
            <button type="submit">+ Tambah Gambar Carousel</button>
          </form>
          <div className="orgAdminGrid" style={{marginTop:24}}>{items.map((item:any)=><article className="panel orgAdminCard" key={item.id}>
            <img src={item.url} alt={item.title||'Gambar SERENE TERAJU'} style={{width:'100%',height:170,objectFit:'contain'}} />
            <h3>{item.title || 'Tanpa kapsyen'}</h3><small>Susunan: {item.order_no}</small>
            <div className="actionRow"><button onClick={()=>{setTab('Media');openEdit('media_items',item,cfg.Media[1])}}>Edit</button><button className="dangerBtn" onClick={()=>del('media_items',item.id)}>Padam</button></div>
          </article>)}</div>
          {items.length===0 && <p>Belum ada gambar. Tambah gambar pertama menggunakan borang di atas.</p>}
        </div>
      })()}

      {tab === 'ZON PERMAINAN MINDA SIHAT' && <div className="panel">
        <div className="editHeader"><div><span className="pill">GAME INTERAKTIF</span><h3>Tetapan ZEP QUIZ</h3></div></div>
        <p className="adminHelp">Tukar URL permainan di sini. Permainan akan dipaparkan di halaman MINDA SIHAT. Fungsi iframe bergantung pada kebenaran embedding oleh ZEP QUIZ.</p>
        <form onSubmit={async (e)=>{
          e.preventDefault(); if(!s)return;
          const form=e.currentTarget;
          const url=String((form.elements.namedItem('game_url') as HTMLInputElement)?.value||'').trim();
          if(!/^https:\/\/quiz\.zep\.us\/en\/play\/[a-zA-Z0-9_-]+\/?$/.test(url)){setMsg('Gunakan pautan https://quiz.zep.us/en/play/... yang sah.');return}
          const existing=(data.external_links||[]).find((x:any)=>x.title==='__SERENE_ZEP_QUIZ__');
          const row={title:'__SERENE_ZEP_QUIZ__',url,description:'Tetapan permainan iframe ZON PERMAINAN MINDA SIHAT',placement:'home',order_no:999,is_active:true};
          const result=existing?await s.from('external_links').update(row).eq('id',existing.id):await s.from('external_links').insert(row);
          setMsg(result.error?`Tidak berjaya: ${result.error.message}`:'Pautan game berjaya disimpan. Refresh halaman MINDA SIHAT.');await load();
        }}>
          <label>Link permainan ZEP QUIZ</label>
          <input key={(data.external_links||[]).find((x:any)=>x.title==='__SERENE_ZEP_QUIZ__')?.url||'default'} name="game_url" type="url" required defaultValue={(data.external_links||[]).find((x:any)=>x.title==='__SERENE_ZEP_QUIZ__')?.url||'https://quiz.zep.us/en/play/5gnavv'} />
          <button type="submit">Simpan Link Permainan</button>
        </form>
        <p><a href="/minda-sihat#zon-permainan-minda-sihat" target="_blank" rel="noopener noreferrer">Lihat halaman MINDA SIHAT ↗</a></p>
      </div>}

      {tab === 'Pengurusan Pautan Website' && <div className="panel">
        <div className="editHeader"><div><span className="pill">LAMAN LUAR</span><h3>Tambah pautan website</h3></div></div>
        <p className="adminHelp">Pilih lokasi paparan. Navigasi Kiri akan muncul dalam menu tersembunyi; Butang Home akan muncul sebagai kad pautan pada Home. Pautan dibuka dalam tab baharu.</p>
        <form onSubmit={e=>add(e,'external_links')}>
          <label>Nama website / tajuk</label><input name="title" required placeholder="Contoh: CareerSnap Online" />
          <label>Alamat laman web (https://...)</label><input name="url" type="url" required pattern="https?://.*" placeholder="https://contoh.com" />
          <label>Penerangan ringkas (pilihan)</label><textarea name="description" placeholder="Maklumat ringkas website" />
          <label>Lokasi paparan</label><select name="placement" defaultValue="nav"><option value="nav">Navigasi Kiri</option><option value="home">Butang di Home</option></select>
          <label>Nombor susunan</label><input name="order_no" type="number" defaultValue={20}/>
          <button type="submit">+ Tambah Pautan</button>
        </form>
        <div className="tableWrap" style={{marginTop:20}}><table><thead><tr><th>Tajuk</th><th>URL</th><th>Lokasi</th><th>Tindakan</th></tr></thead><tbody>{(data.external_links||[]).filter((item:any)=>item.title!=='__SERENE_ZEP_QUIZ__').map((item:any)=><tr key={item.id}><td>{item.title}</td><td><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></td><td>{item.title==='__SERENE_ZEP_QUIZ__'?'Tetapan Game':item.placement==='nav'?'Navigasi Kiri':'Home'}</td><td><div className="actionRow compact"><button onClick={()=>openEdit('external_links',item,['title','url','description','placement','order_no'])}>Edit</button><button className="dangerBtn" onClick={()=>del('external_links',item.id)}>Padam</button></div></td></tr>)}</tbody></table></div>
        {editing?.table==='external_links' && <form className="panel editPanel" onSubmit={saveEdit} key={editing.id}><h3>Edit Pautan</h3><label>Tajuk</label><input name="title" required defaultValue={editing.row.title}/><label>URL</label><input name="url" type="url" required defaultValue={editing.row.url}/><label>Penerangan</label><textarea name="description" defaultValue={editing.row.description||''}/><label>Lokasi paparan</label><select name="placement" defaultValue={editing.row.placement}><option value="nav">Navigasi Kiri</option><option value="home">Butang di Home</option></select><label>Susunan</label><input name="order_no" type="number" defaultValue={editing.row.order_no||0}/><button>Simpan Perubahan</button></form>}
      </div>}

      {tab === 'Navigasi' && <div className="panel"><h3>Ubah Tajuk & Kedudukan Menu</h3><p>Tekan <b>Edit</b> untuk menukar tajuk navigasi tanpa mengubah alamat halaman (URL). Tekan <b>↑ Naik</b> atau <b>↓ Turun</b> untuk mengubah kedudukan dalam menu kiri. Susunan disimpan di Supabase dan terus digunakan selepas laman dimuat semula.</p><p>Menu GALERI PROGRAM dan SERENE TERAJU juga boleh diubah. Pastikan alamat halaman dalaman seperti <code>/galeri-program</code> tidak ditukar jika mahu halaman sedia ada terus berfungsi.</p></div>}
      {c && <>
        {editing && editing.table === c[0] && <form className="panel editPanel" onSubmit={saveEdit} key={`${editing.table}-${editing.id}`}>
          <div className="editHeader">
            <div><span className="pill">EDIT ITEM</span><h3>{tab === 'Organisasi' ? 'Edit Ahli Carta Organisasi' : `Edit ${tab}`}</h3></div>
            <button type="button" className="secondaryBtn" onClick={() => setEditing(null)}>Batal</button>
          </div>
          {tab === 'Organisasi' && editing.row.photo_url && <div className="editPhotoPreview"><img src={editing.row.photo_url} alt={editing.row.name || 'Foto'} /></div>}
          {editing.fields.map((f: string) => <div key={f}><label>{fieldLabels[f] || f}</label>{renderField(f, editing.row[f], true)}</div>)}
          <button>Simpan Perubahan</button>
        </form>}

        <form className="panel" onSubmit={e => add(e, c[0])}>
          <h3>{tab === 'Organisasi' ? 'Tambah Ahli Carta Organisasi' : tab === 'Tips Kesejahteraan' ? 'Tambah Tips Kesejahteraan' : 'Tambah Item'}</h3>
          {c[1].map((f: string) => <div key={f}><label>{fieldLabels[f] || f}</label>{renderField(f, '')}</div>)}
          <button>Tambah</button>
        </form>

        {tab === 'Organisasi' ? <div className="orgAdminGrid">
          {(data[c[0]] || []).map((r: any) => <div className="panel orgAdminCard" key={r.id}>
            {r.photo_url ? <img className="orgAdminPhoto" src={r.photo_url} alt={r.name} /> : <div className="orgAdminPhoto placeholder">FOTO</div>}
            <h3>{r.name || 'Belum diisi'}</h3>
            <p>{r.role || 'Jawatan belum diisi'}</p>
            <small>Susunan: {r.order_no ?? 0}</small>
            <div className="actionRow">
              <button onClick={() => openEdit(c[0], r, c[1])}>Edit</button>
              <button className="dangerBtn" onClick={() => del(c[0], r.id)}>Padam</button>
            </div>
          </div>)}
          {Array.from({ length: Math.max(0, 6 - (data[c[0]] || []).length) }, (_, idx) => {
            const slot = (data[c[0]] || []).length + idx + 1
            return <div className="panel orgAdminCard orgAdminEmpty" key={`empty-org-${slot}`}>
              <div className="orgAdminPhoto placeholder">FOTO</div>
              <h3>Ruang {slot}</h3>
              <p>Belum diisi</p>
              <small>Foto • Nama • Jawatan</small>
              <div className="actionRow">
                <button onClick={() => addOrganizationSlot(slot)}>+ Tambah Ruang Ini</button>
              </div>
            </div>
          })}
        </div> : <div className="panel tableWrap">
          <table><thead><tr><th>ID</th>{c[1].map((f: string) => <th key={f}>{fieldLabels[f] || f}</th>)}<th>Aksi</th></tr></thead>
            <tbody>{(data[c[0]] || []).map((r: any) => <tr key={r.id}><td>{r.id}</td>{c[1].map((f: string) => <td key={f}>{String(r[f] ?? '').slice(0, 70)}</td>)}<td><div className="actionRow compact"><button onClick={() => openEdit(c[0], r, c[1])}>Edit Tajuk</button>{tab === 'Navigasi' && <><button type="button" className="secondaryBtn" disabled={(data.navigation||[])[0]?.id===r.id} onClick={() => moveNavigation(r.id,-1)}>↑ Naik</button><button type="button" className="secondaryBtn" disabled={(data.navigation||[])[(data.navigation||[]).length-1]?.id===r.id} onClick={() => moveNavigation(r.id,1)}>↓ Turun</button></>}<button className="dangerBtn" onClick={() => del(c[0], r.id)}>Padam</button></div></td></tr>)}</tbody>
          </table>
        </div>}
      </>}

      {tab === 'Temujanji' && <div className="panel tableWrap"><table><thead><tr><th>Nama</th><th>Kelas</th><th>Tarikh</th><th>Masa</th><th>Tujuan</th><th>Status</th></tr></thead><tbody>{(data.appointments || []).map((r: any) => <tr key={r.id}><td>{r.student_name}</td><td>{r.student_class}</td><td>{r.appointment_date}</td><td>{r.appointment_time}</td><td>{r.reason}</td><td><select value={r.status || 'BARU'} onChange={e => updateAppointment(r.id, e.target.value)}><option>BARU</option><option>DISAHKAN</option><option>SELESAI</option><option>DIBATALKAN</option></select></td></tr>)}</tbody></table></div>}

      {tab === 'Apa Kata Anda' && <div className="panel tableWrap"><table><thead><tr><th>Nama</th><th>Rating</th><th>Mesej</th><th>Tarikh</th></tr></thead><tbody>{(data.feedback || []).map((r: any) => <tr key={r.id}><td>{r.name || 'Anonim'}</td><td>{'⭐'.repeat(r.rating || 0)}</td><td>{r.message}</td><td>{new Date(r.created_at).toLocaleDateString('ms-MY')}</td></tr>)}</tbody></table></div>}

      {tab === 'Statistik' && <div className="panel"><h3>Analisis Pelawat</h3><p>Jumlah page view direkod berdasarkan setiap lawatan halaman.</p><div className="stats"><div className="stat"><span>Jumlah Views</span><strong>{data.page_views?.length || 0}</strong></div><div className="stat"><span>Halaman Unik</span><strong>{new Set((data.page_views || []).map((x: any) => x.path)).size}</strong></div><div className="stat"><span>Hari Ini</span><strong>{(data.page_views || []).filter((x: any) => new Date(x.created_at).toDateString() === new Date().toDateString()).length}</strong></div></div><div className="tableWrap" style={{ marginTop: 24 }}><table><thead><tr><th>Halaman</th><th>Views</th></tr></thead><tbody>{Object.entries((data.page_views || []).reduce((a: any, x: any) => (a[x.path] = (a[x.path] || 0) + 1, a), {})).sort((a: any, b: any) => b[1] - a[1]).map(([p, n]: any) => <tr key={p}><td>{p}</td><td>{n}</td></tr>)}</tbody></table></div></div>}
    </main>
  </div>
}
