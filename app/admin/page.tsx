'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/client'

const tabs = [
  'Ringkasan',
  'Identiti & Pautan',
  'Halaman Pengurusan',
  'Navigasi',
  'Carousel',
  'Organisasi',
  'Minda Sihat',
  'Media',
  'CareerSnap',
  'Temujanji',
  'Apa Kata Anda',
  'Statistik',
]

const fieldLabels: Record<string, string> = {
  label: 'Nama Menu',
  href: 'Pautan / URL',
  order_no: 'Susunan Paparan',
  title: 'Tajuk',
  subtitle: 'Subtajuk',
  image_url: 'URL Gambar',
  role: 'Jawatan',
  name: 'Nama',
  photo_url: 'URL Foto',
  body: 'Kandungan / Tip',
  section: 'Bahagian',
  type: 'Jenis Media',
  url: 'URL',
  description: 'Penerangan',
  resource_type: 'Jenis Bahan',
}

const cfg: Record<string, [string, string[]]> = {
  Navigasi: ['navigation', ['label', 'href', 'order_no']],
  Carousel: ['carousel_items', ['title', 'subtitle', 'image_url', 'order_no']],
  Organisasi: ['organization_members', ['role', 'name', 'photo_url', 'order_no']],
  'Minda Sihat': ['mental_health_tips', ['title', 'body', 'order_no']],
  Media: ['media_items', ['section', 'type', 'title', 'url', 'order_no']],
  CareerSnap: ['careersnap_resources', ['title', 'description', 'url', 'resource_type', 'order_no']],
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
      'organization_members',
      'mental_health_tips',
      'media_items',
      'careersnap_resources',
      'appointments',
      'feedback',
      'page_views',
    ]
    const out: any = {}
    for (const n of names) {
      let q = s.from(n).select('*')
      if (['navigation','carousel_items','organization_members','mental_health_tips','media_items','careersnap_resources'].includes(n)) {
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
      <option value="minda_sihat">Minda Sihat — Media biasa</option>
      <option value="tips_minda_sihat">TIPS MINDA SIHAT — Image portrait</option>
      <option value="careersnap">CareerSnap</option>
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
          <p><b>Visi & Misi:</b> buka tab <b>Identiti & Pautan</b>.</p>
          <p><b>Nama, jawatan & foto carta organisasi:</b> buka tab <b>Organisasi</b> dan tekan <b>Edit</b>.</p>
          <p><b>Gambar:</b> tampal Public URL daripada Supabase Storage pada ruangan URL Gambar / URL Foto.</p>
        </div>
      </>}

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
          <h3>{tab === 'Organisasi' ? 'Tambah Ahli Carta Organisasi' : 'Tambah Item'}</h3>
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
        </div> : <div className="panel tableWrap">
          <table><thead><tr><th>ID</th>{c[1].map((f: string) => <th key={f}>{fieldLabels[f] || f}</th>)}<th>Aksi</th></tr></thead>
            <tbody>{(data[c[0]] || []).map((r: any) => <tr key={r.id}><td>{r.id}</td>{c[1].map((f: string) => <td key={f}>{String(r[f] ?? '').slice(0, 70)}</td>)}<td><div className="actionRow compact"><button onClick={() => openEdit(c[0], r, c[1])}>Edit</button><button className="dangerBtn" onClick={() => del(c[0], r.id)}>Padam</button></div></td></tr>)}</tbody>
          </table>
        </div>}
      </>}

      {tab === 'Temujanji' && <div className="panel tableWrap"><table><thead><tr><th>Nama</th><th>Kelas</th><th>Tarikh</th><th>Masa</th><th>Tujuan</th><th>Status</th></tr></thead><tbody>{(data.appointments || []).map((r: any) => <tr key={r.id}><td>{r.student_name}</td><td>{r.student_class}</td><td>{r.appointment_date}</td><td>{r.appointment_time}</td><td>{r.reason}</td><td><select value={r.status || 'BARU'} onChange={e => updateAppointment(r.id, e.target.value)}><option>BARU</option><option>DISAHKAN</option><option>SELESAI</option><option>DIBATALKAN</option></select></td></tr>)}</tbody></table></div>}

      {tab === 'Apa Kata Anda' && <div className="panel tableWrap"><table><thead><tr><th>Nama</th><th>Rating</th><th>Mesej</th><th>Tarikh</th></tr></thead><tbody>{(data.feedback || []).map((r: any) => <tr key={r.id}><td>{r.name || 'Anonim'}</td><td>{'⭐'.repeat(r.rating || 0)}</td><td>{r.message}</td><td>{new Date(r.created_at).toLocaleDateString('ms-MY')}</td></tr>)}</tbody></table></div>}

      {tab === 'Statistik' && <div className="panel"><h3>Analisis Pelawat</h3><p>Jumlah page view direkod berdasarkan setiap lawatan halaman.</p><div className="stats"><div className="stat"><span>Jumlah Views</span><strong>{data.page_views?.length || 0}</strong></div><div className="stat"><span>Halaman Unik</span><strong>{new Set((data.page_views || []).map((x: any) => x.path)).size}</strong></div><div className="stat"><span>Hari Ini</span><strong>{(data.page_views || []).filter((x: any) => new Date(x.created_at).toDateString() === new Date().toDateString()).length}</strong></div></div><div className="tableWrap" style={{ marginTop: 24 }}><table><thead><tr><th>Halaman</th><th>Views</th></tr></thead><tbody>{Object.entries((data.page_views || []).reduce((a: any, x: any) => (a[x.path] = (a[x.path] || 0) + 1, a), {})).sort((a: any, b: any) => b[1] - a[1]).map(([p, n]: any) => <tr key={p}><td>{p}</td><td>{n}</td></tr>)}</tbody></table></div></div>}
    </main>
  </div>
}
