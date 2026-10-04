'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = { site: any; org: any[]; nav: any[] }

export default function ManagementInlineEditor({ site, org, nav }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [siteForm, setSiteForm] = useState<any>({ ...site })
  const [members, setMembers] = useState<any[]>(org.map(x => ({ ...x })))
  const [menus, setMenus] = useState<any[]>(nav.map(x => ({ ...x })))

  useEffect(() => {
    let mounted = true
    async function check() {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setIsAdmin(data.user?.app_metadata?.role === 'admin')
    }
    check()
    const { data: listener } = supabase.auth.onAuthStateChange(() => check())
    return () => { mounted = false; listener.subscription.unsubscribe() }
  }, [])

  if (!isAdmin) return null

  const setField = (key: string, value: any) => setSiteForm((s: any) => ({ ...s, [key]: value }))
  const setMember = (index: number, key: string, value: any) => setMembers(list => list.map((x, i) => i === index ? { ...x, [key]: value } : x))
  const setMenu = (index: number, key: string, value: any) => setMenus(list => list.map((x, i) => i === index ? { ...x, [key]: value } : x))

  async function savePage() {
    setSaving(true); setMessage('')
    const payload = {
      title: siteForm.title,
      tagline: siteForm.tagline,
      school_logo_url: siteForm.school_logo_url || null,
      ubk_logo_url: siteForm.ubk_logo_url || null,
      management_badge: siteForm.management_badge,
      management_title: siteForm.management_title,
      management_intro: siteForm.management_intro,
      vision: siteForm.vision,
      mission: siteForm.mission,
      management_org_title: siteForm.management_org_title,
      management_files_title: siteForm.management_files_title,
      management_files_text: siteForm.management_files_text,
      management_files_button: siteForm.management_files_button,
      management_drive_url: siteForm.management_drive_url,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('site_settings').update(payload).eq('id', 1)
    if (error) setMessage(`Gagal simpan: ${error.message}`)
    else {
      setMessage('Perubahan halaman berjaya disimpan dan paparan dikemas kini.')
      router.refresh()
    }
    setSaving(false)
  }

  async function saveMember(index: number) {
    const m = members[index]
    setMessage('')
    if (!m.id) return
    const { error } = await supabase.from('organization_members').update({
      name: m.name,
      role: m.role,
      photo_url: m.photo_url || null,
      order_no: Number(m.order_no || 0),
    }).eq('id', m.id)
    if (error) setMessage(`Gagal simpan ahli: ${error.message}`)
    else {
      setMessage(`Maklumat ${m.name || 'ahli'} berjaya disimpan.`)
      router.refresh()
    }
  }

  async function addMember() {
    const { data, error } = await supabase.from('organization_members').insert({
      name: 'Nama Baru', role: 'JAWATAN', photo_url: null, order_no: members.length + 1,
    }).select().single()
    if (error) setMessage(`Gagal tambah ahli: ${error.message}`)
    else { setMembers([...members, data]); setMessage('Ahli baharu ditambah. Sila edit maklumatnya.'); router.refresh() }
  }

  async function deleteMember(index: number) {
    const m = members[index]
    if (!m.id || !confirm(`Padam ${m.name || 'ahli ini'}?`)) return
    const { error } = await supabase.from('organization_members').delete().eq('id', m.id)
    if (error) setMessage(`Gagal padam: ${error.message}`)
    else { setMembers(members.filter((_, i) => i !== index)); setMessage('Ahli berjaya dipadam.'); router.refresh() }
  }

  async function saveMenu(index: number) {
    const m = menus[index]
    if (!m.id) return
    const { error } = await supabase.from('navigation').update({
      label: m.label, href: m.href, order_no: Number(m.order_no || 0), is_active: m.is_active !== false,
    }).eq('id', m.id)
    if (error) setMessage(`Gagal simpan menu: ${error.message}`)
    else { setMessage(`Menu ${m.label} berjaya disimpan.`); router.refresh() }
  }

  return <>
    <button className="floatingEdit" onClick={() => setOpen(true)}>✏️ Edit Halaman</button>
    {open && <div className="editorBackdrop" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
      <aside className="pageEditor">
        <div className="pageEditorTop">
          <div><span className="pill">MOD ADMIN</span><h2>Edit Halaman Pengurusan</h2><p>Edit terus dan tekan Simpan. Paparan akan dikemas kini secara automatik.</p></div>
          <button className="editorClose" onClick={() => setOpen(false)}>✕</button>
        </div>

        {message && <div className="editorMessage">{message}</div>}

        <div className="editorSection">
          <h3>1. Header Portal</h3>
          <label>Tajuk Portal</label><input value={siteForm.title || ''} onChange={e => setField('title', e.target.value)} />
          <label>Tagline</label><input value={siteForm.tagline || ''} onChange={e => setField('tagline', e.target.value)} />
          <div className="grid2 editorGrid">
            <div><label>URL Logo Sekolah</label><input value={siteForm.school_logo_url || ''} onChange={e => setField('school_logo_url', e.target.value)} placeholder="https://..." /></div>
            <div><label>URL Logo UBK</label><input value={siteForm.ubk_logo_url || ''} onChange={e => setField('ubk_logo_url', e.target.value)} placeholder="https://..." /></div>
          </div>
        </div>

        <div className="editorSection">
          <h3>2. Tajuk Halaman</h3>
          <label>Label Kecil</label><input value={siteForm.management_badge || ''} onChange={e => setField('management_badge', e.target.value)} />
          <label>Tajuk Utama</label><input value={siteForm.management_title || ''} onChange={e => setField('management_title', e.target.value)} />
          <label>Penerangan</label><textarea value={siteForm.management_intro || ''} onChange={e => setField('management_intro', e.target.value)} />
        </div>

        <div className="editorSection">
          <h3>3. Visi & Misi</h3>
          <label>Visi</label><textarea value={siteForm.vision || ''} onChange={e => setField('vision', e.target.value)} />
          <label>Misi</label><textarea value={siteForm.mission || ''} onChange={e => setField('mission', e.target.value)} />
          <label>Tajuk Carta Organisasi</label><input value={siteForm.management_org_title || ''} onChange={e => setField('management_org_title', e.target.value)} />
        </div>

        <div className="editorSection">
          <div className="editorSectionHead"><h3>4. Carta Organisasi</h3><button onClick={addMember}>+ Tambah Ahli</button></div>
          {members.map((m, i) => <div className="memberEditor" key={m.id || i}>
            <div className="memberPreview">{m.photo_url ? <img src={m.photo_url} alt={m.name || 'Foto'} /> : <span>FOTO</span>}</div>
            <div className="memberFields">
              <label>Nama</label><input value={m.name || ''} onChange={e => setMember(i, 'name', e.target.value)} />
              <label>Jawatan</label><input value={m.role || ''} onChange={e => setMember(i, 'role', e.target.value)} />
              <label>URL Foto</label><input value={m.photo_url || ''} onChange={e => setMember(i, 'photo_url', e.target.value)} placeholder="https://..." />
              <label>Susunan</label><input type="number" value={m.order_no ?? 0} onChange={e => setMember(i, 'order_no', e.target.value)} />
              <div className="editorActions"><button onClick={() => saveMember(i)}>Simpan Ahli</button><button className="dangerBtn" onClick={() => deleteMember(i)}>Padam</button></div>
            </div>
          </div>)}
        </div>

        <div className="editorSection">
          <h3>5. Pengurusan Fail</h3>
          <label>Tajuk</label><input value={siteForm.management_files_title || ''} onChange={e => setField('management_files_title', e.target.value)} />
          <label>Penerangan</label><textarea value={siteForm.management_files_text || ''} onChange={e => setField('management_files_text', e.target.value)} />
          <label>Teks Butang</label><input value={siteForm.management_files_button || ''} onChange={e => setField('management_files_button', e.target.value)} />
          <label>URL Google Drive</label><input value={siteForm.management_drive_url || ''} onChange={e => setField('management_drive_url', e.target.value)} placeholder="https://drive.google.com/..." />
        </div>

        <div className="editorSection">
          <h3>6. Menu Navigasi</h3>
          {menus.map((m, i) => <div className="navEditorRow" key={m.id || i}>
            <input value={m.label || ''} onChange={e => setMenu(i, 'label', e.target.value)} aria-label="Nama menu" />
            <input value={m.href || ''} onChange={e => setMenu(i, 'href', e.target.value)} aria-label="Pautan menu" />
            <button onClick={() => saveMenu(i)}>Simpan</button>
          </div>)}
        </div>

        <div className="editorSticky">
          <button className="bigSave" disabled={saving} onClick={savePage}>{saving ? 'Menyimpan...' : '💾 Simpan Semua Teks Halaman'}</button>
          <button className="secondaryBtn" onClick={() => window.location.reload()}>↻ Refresh Preview</button>
        </div>
      </aside>
    </div>}
  </>
}
