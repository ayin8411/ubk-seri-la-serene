'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Checkin = { id: string; mood: string; created_at: string }
type Support = { id: string; nama: string; kelas: string; mesej: string | null; created_at: string }

const moodTypes = [
  { key: 'ceria', label: 'Ceria', emoji: '😄', color: '#1b9e8b' },
  { key: 'tenang', label: 'Tenang', emoji: '😌', color: '#3892db' },
  { key: 'biasa', label: 'Biasa sahaja', emoji: '😐', color: '#8292a9' },
  { key: 'letih', label: 'Letih', emoji: '😴', color: '#e1a039' },
  { key: 'risau', label: 'Risau', emoji: '😟', color: '#b080d4' },
  { key: 'sedih', label: 'Sedih', emoji: '😢', color: '#637fba' },
]

const MAX_ROWS = 5000
const PAGE_SIZE = 500

function malaysiaDate(iso: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso))
}
function displayDate(iso: string) {
  return new Date(iso).toLocaleString('ms-MY', {
    timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
function csvValue(value: unknown) {
  let data = String(value == null ? '' : value)
  // Prevent spreadsheet software from treating student-written text as formulas.
  if (/^[=+\-@\t\r]/.test(data)) data = "'" + data
  return '"' + data.replaceAll('"', '""') + '"'
}
async function fetchPages(client: any, table: string, fields: string) {
  let output: any[] = []
  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    const { data, error } = await client.from(table).select(fields)
      .order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    output = output.concat(data || [])
    if (!data || data.length < PAGE_SIZE) break
  }
  return output
}

/** Access stays behind the parent portal admin sign-in AND Supabase RLS. */
export default function SereneMoodAdminPanel({ client, userId }: { client: any; userId: string }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [message, setMessage] = useState('')
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [support, setSupport] = useState<Support[]>([])
  const [search, setSearch] = useState('')
  const [showCount, setShowCount] = useState(15)

  const refresh = useCallback(async () => {
    setLoading(true)
    setMessage('')
    try {
      const { data: membership, error: memberError } = await client
        .from('serene_mood_admins').select('user_id').eq('user_id', userId).maybeSingle()
      if (memberError) throw memberError
      if (!membership) {
        setAllowed(false)
        setMessage('Akaun ini belum diberi kebenaran untuk melihat rekod SERENE MOOD SCAN. Hubungi admin Supabase.')
        return
      }
      setAllowed(true)
      const [c, s] = await Promise.all([
        fetchPages(client, 'serene_mood_checkins', 'id,mood,created_at'),
        fetchPages(client, 'serene_mood_support', 'id,nama,kelas,mesej,created_at'),
      ])
      setCheckins(c as Checkin[])
      setSupport(s as Support[])
      if (c.length >= MAX_ROWS || s.length >= MAX_ROWS) {
        setMessage('Paparan dihadkan kepada 5,000 rekod terkini bagi setiap kategori. Untuk laporan penuh, gunakan eksport pangkalan data.')
      }
    } catch (err: any) {
      setMessage('Tidak berjaya memuatkan data. Sila log masuk semula dan semak kebenaran Supabase. ' + (err?.message || 'Ralat tidak diketahui.'))
    } finally {
      setLoading(false)
    }
  }, [client, userId])

  useEffect(() => { refresh() }, [refresh])

  const today = malaysiaDate(new Date().toISOString())
  const checkinsToday = checkins.filter(x => malaysiaDate(x.created_at) === today).length
  const counts = moodTypes.map(type => ({ ...type, count: checkins.filter(x => x.mood === type.key).length }))
  const maxMoodCount = Math.max(1, ...counts.map(x => x.count))
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const day = malaysiaDate(d.toISOString())
    return { day, count: checkins.filter(x => malaysiaDate(x.created_at) === day).length }
  }), [checkins])
  const maxDayCount = Math.max(1, ...week.map(x => x.count))

  const filtered = support.filter(row =>
    (row.nama + ' ' + row.kelas + ' ' + (row.mesej || '')).toLocaleLowerCase('ms-MY')
      .includes(search.trim().toLocaleLowerCase('ms-MY'))
  )

  function downloadCsv() {
    if (!allowed || loading) return
    const rows = [['Tarikh dan masa', 'Nama murid', 'Kelas', 'Catatan'],
      ...filtered.map(row => [displayDate(row.created_at), row.nama, row.kelas, row.mesej || ''])]
    const csv = '\ufeff' + rows.map(row => row.map(csvValue).join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = 'serene-mood-permintaan-sokongan.csv'
    document.body.append(link); link.click(); link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return <div className="sereneAdminBoard">
    <div className="panel sereneAdminHero">
      <div><span className="sereneAdminPill">🔐 PAPAN PEMUKA GURU</span>
        <h2>💙 SERENE MOOD SCAN</h2>
        <p>Semakan emosi tanpa nama dan permintaan sokongan murid. Paparan ini hanya untuk guru yang mendapat kebenaran admin.</p>
      </div>
      <div className="sereneAdminButtons">
        <button type="button" onClick={refresh} disabled={loading}>{loading ? 'Memuatkan...' : '↻ Muat Semula'}</button>
        <a className="sereneAdminLink" href="/minda-sihat#serene-mood-scan" target="_blank" rel="noopener noreferrer">Lihat Borang Murid ↗</a>
      </div>
    </div>
    {loading && <div className="panel" role="status">Sedang menyemak kebenaran guru dan memuatkan rekod...</div>}
    {message && <div className="panel" role="status">{message}</div>}
    {!loading && allowed && <>
      <div className="sereneAdminStats">
        <div><span>Semakan emosi</span><strong>{checkins.length}{checkins.length === MAX_ROWS ? '+' : ''}</strong></div>
        <div><span>Semakan hari ini</span><strong>{checkinsToday}</strong></div>
        <div><span>Permintaan untuk GBK</span><strong>{support.length}{support.length === MAX_ROWS ? '+' : ''}</strong></div>
      </div>
      <div className="sereneAdminCharts">
        <section className="panel"><h3>Taburan Emosi</h3><p className="sereneAdminMuted">Data agregat sahaja, tiada nama murid.</p>
          {counts.map(m => <div className="sereneAdminBar" key={m.key}>
            <span>{m.emoji} {m.label}</span><div className="sereneAdminTrack"><div style={{width:`${100*m.count/maxMoodCount}%`, background:m.color}} /></div>
            <b>{m.count}</b></div>)}
        </section>
        <section className="panel"><h3>Trend 7 Hari</h3><p className="sereneAdminMuted">Bilangan semakan emosi mengikut hari (Malaysia).</p>
          {week.map(item => <div className="sereneAdminBar" key={item.day}>
            <span>{item.day.slice(5)}</span><div className="sereneAdminTrack"><div style={{width:`${100*item.count/maxDayCount}%`}} /></div>
            <b>{item.count}</b></div>)}
        </section>
      </div>
      <section className="panel">
        <div className="sereneAdminHead">
          <div><h3>💌 Permintaan Sokongan / Jom Borak dengan GBK</h3>
            <p className="sereneAdminMuted">Nama, kelas dan catatan di sini adalah sulit. Jangan kongsi fail eksport melalui pautan awam.</p></div>
          <button type="button" onClick={downloadCsv} className="secondaryBtn" disabled={!filtered.length}>↓ Eksport CSV</button>
        </div>
        <label htmlFor="serene-support-search">Cari nama, kelas atau catatan</label>
        <input id="serene-support-search" value={search} onChange={e => {setSearch(e.target.value);setShowCount(15)}} placeholder="Cari dalam permintaan sokongan..." />
        <p className="sereneAdminMuted">{filtered.length} permintaan ditemui</p>
        <div className="tableWrap"><table><thead><tr><th>Tarikh / Masa</th><th>Nama Murid</th><th>Kelas</th><th>Catatan</th></tr></thead>
          <tbody>{filtered.length ? filtered.slice(0,showCount).map(item => <tr key={item.id}>
            <td>{displayDate(item.created_at)}</td><td>{item.nama}</td><td>{item.kelas}</td>
            <td className="sereneAdminNote">{item.mesej || '—'}</td></tr>) : <tr><td colSpan={4}>Tiada permintaan yang sepadan.</td></tr>}</tbody>
        </table></div>
        {showCount < filtered.length && <button type="button" className="secondaryBtn" onClick={() => setShowCount(n => n + 15)}>Lihat 15 lagi</button>}
      </section>
    </>}
  </div>
}
