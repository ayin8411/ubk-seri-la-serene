'use client'
import { useEffect, useState } from 'react'

export default function AlumniCarousel({items}:{items:any[]}){
  const safeItems = Array.isArray(items) ? items : []
  const [index,setIndex]=useState(0)
  useEffect(()=>{
    if(safeItems.length < 2) return
    const t=setInterval(()=>setIndex(i=>(i+1)%safeItems.length),4500)
    return ()=>clearInterval(t)
  },[safeItems.length])
  if(!safeItems.length) return <div className="alumniEmpty">Belum ada rekod alumni. Tambah melalui Dashboard Admin.</div>
  const x=safeItems[index]
  return <div className="alumniCarousel">
    <button className="alumniArrow alumniPrev" aria-label="Sebelum" onClick={()=>setIndex(i=>(i-1+safeItems.length)%safeItems.length)}>‹</button>
    <div className="alumniCard">
      <div className="alumniPhotoWrap">{x.photo_url?<img src={x.photo_url} alt={x.name || 'Alumni'} className="alumniPhoto"/>:<div className="alumniPhoto alumniPlaceholder">FOTO ALUMNI</div>}</div>
      <div className="alumniInfo">
        <span className="pill">BATCH SPM {x.batch || '-'}</span>
        <h3>{x.name || 'Nama Alumni'}</h3>
        <p><b>Jurusan:</b> {x.course || '-'}</p>
        <p><b>Tempat Belajar:</b> {x.institution || '-'}</p>
      </div>
    </div>
    <button className="alumniArrow alumniNext" aria-label="Seterusnya" onClick={()=>setIndex(i=>(i+1)%safeItems.length)}>›</button>
    {safeItems.length>1 && <div className="alumniDots">{safeItems.map((_:any,i:number)=><button key={i} aria-label={`Alumni ${i+1}`} className={i===index?'active':''} onClick={()=>setIndex(i)}/>)}</div>}
  </div>
}
