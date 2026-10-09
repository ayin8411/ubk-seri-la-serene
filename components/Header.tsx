'use client';
import {useState,useEffect} from 'react';

export default function Header({site,nav}:{site:any,nav:any[]}){
 const [open,setOpen]=useState(false);
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',fn);return ()=>window.removeEventListener('keydown',fn)},[]);
 return <>
 <header className="header"><div className="wrap headerInner"><a className="brand" href="/"><div className="logos">{site.school_logo_url?<img src={site.school_logo_url} alt="Logo sekolah"/>:<span>S</span>}{site.ubk_logo_url?<img src={site.ubk_logo_url} alt="Logo UBK"/>:<span>UBK</span>}</div><div><b>{site.title}</b><small>{site.tagline}</small></div></a></div></header>
 <div className="sideNavEdge" onMouseEnter={()=>setOpen(true)} aria-hidden="true"/>
 <button type="button" className="sideNavHandle" onMouseEnter={()=>setOpen(true)} onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="serene-side-nav" aria-label={open?'Tutup navigasi':'Buka navigasi'}><span aria-hidden="true">{open?'✕':'☰'}</span><span className="sideNavHandleText">MENU</span></button>
 {open&&<button type="button" className="sideNavBackdrop" aria-label="Tutup navigasi" onClick={()=>setOpen(false)}/>}
 <aside id="serene-side-nav" className={'sideNavDrawer'+(open?' isOpen':'')} aria-hidden={!open} aria-label="Navigasi portal" onMouseLeave={()=>setOpen(false)}><div className="sideNavTitle"><strong>NAVIGASI SERENE</strong><button type="button" onClick={()=>setOpen(false)} aria-label="Tutup menu">✕</button></div><nav className="sideNavLinks">{nav.map((x:any,i:number)=>{
   const href=typeof x.href==='string'?x.href.trim():'';
   if(!href || /^(javascript|data|vbscript):/i.test(href))return null;
   const external=/^https?:\/\//i.test(href);
   // Use a native anchor for internal pages: always requests the destination document,
   // avoiding stale Next.js client navigation/RSC payloads after deployment.
   return <a tabIndex={open?0:-1} key={`${href}-${i}`} href={href} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} onClick={()=>setOpen(false)}>{x.label}{external?' ↗':''}</a>
 })}</nav></aside>
 </>;
}
