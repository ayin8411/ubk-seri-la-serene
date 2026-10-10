'use client'
import {useEffect,useState} from 'react'
type Counts={total:number;today:number;week:number}
export default function VisitorStats(){
 const [counts,setCounts]=useState<Counts|null>(null)
 const [error,setError]=useState(false)
 useEffect(()=>{
  let active=true
  const refresh=async()=>{try{const r=await fetch('/api/visitor-stats',{cache:'no-store'});if(!r.ok)throw new Error('fetch');const d=await r.json();if(active){setCounts(d);setError(false)}}catch{if(active)setError(true)}}
  refresh();const timer=setInterval(refresh,30000)
  return()=>{active=false;clearInterval(timer)}
 },[])
 return <section className="visitorSection" aria-label="Statistik pelawat portal"><div className="wrap"><div className="visitorPanel">
  <div className="visitorHead"><div><span className="pill">● LIVE FEED</span><h2>STATISTIK PELAWAT PORTAL</h2><p>Statistik lawatan halaman, dikemas kini setiap 30 saat.</p></div><span className="visitorLive">● {error?'Tidak tersedia':'AUTO UPDATE'}</span></div>
  <div className="visitorGrid"><div><span>Jumlah Lawatan</span><strong>{counts?counts.total.toLocaleString('ms-MY'):'—'}</strong></div><div><span>Hari Ini</span><strong>{counts?counts.today.toLocaleString('ms-MY'):'—'}</strong></div><div><span>7 Hari Terkini</span><strong>{counts?counts.week.toLocaleString('ms-MY'):'—'}</strong></div></div>
  {error&&<p className="visitorError">Statistik belum dapat dibaca. Semak tetapan Supabase dan panduan SQL yang disertakan.</p>}
  <p className="visitorNote">* Berdasarkan bilangan paparan halaman, bukan bilangan individu unik.</p>
 </div></div></section>
}
