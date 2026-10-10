'use client';
import {useState} from 'react';
import {usePathname} from 'next/navigation';
const topics=[
 {label:'🧭 Kenali CareerSnap',answer:'Terokai minat, personaliti dan pilihan laluan kerjaya melalui CareerSnap.',href:'/careersnap'},
 {label:'🧠 Jaga Minda Sihat',answer:'Temui panduan kesejahteraan diri dan bahan sokongan dalam ruangan Minda Sihat.',href:'/minda-sihat'},
 {label:'📝 Kenali Psikometrik',answer:'Semak bahan dan informasi pentaksiran psikometrik.',href:'/psikometrik'},
 {label:'🤝 Hubungi kaunselor',answer:'Gunakan ruangan temujanji pada halaman utama untuk menghubungi guru bimbingan dan kaunseling.',href:'/#temujanji'},
 {label:'🏆 Galeri Aktiviti',answer:'Lihat foto dan sorotan program UBK.',href:'/galeri-program'}
];
export default function AminAssistant(){
 const pathname=usePathname(); const [open,setOpen]=useState(false); const [selected,setSelected]=useState(0);
 if(pathname?.startsWith('/admin'))return null;
 return <div className="aminWidget">
  {open&&<section className="aminPanel" aria-label="Panduan AMIN"><div className="aminPanelHead"><div className="aminAvatar">✦</div><div><strong>AMIN <span>• Pembantu SERENE</span></strong><small>Panduan interaktif portal</small></div><button type="button" aria-label="Tutup AMIN" onClick={()=>setOpen(false)}>✕</button></div><div className="aminPanelBody"><p className="aminWelcome">Hai! 👋 Saya AMIN. Nak terokai bahagian mana hari ini?</p><div className="aminTopics">{topics.map((t,i)=><button type="button" key={t.href} className={selected===i?'selected':''} onClick={()=>setSelected(i)}>{t.label}</button>)}</div><div className="aminResponse"><p>{topics[selected].answer}</p><a href={topics[selected].href} onClick={()=>setOpen(false)}>Pergi ke halaman ↗</a></div><small className="aminDisclaimer">AMIN ialah panduan menu automatik, bukan chatbot AI langsung. Untuk sokongan peribadi, hubungi guru kaunseling.</small></div></section>}
  <button type="button" className="aminLauncher" aria-expanded={open} onClick={()=>setOpen(v=>!v)} aria-label={open?'Tutup pembantu AMIN':'Buka pembantu AMIN'}><span className="aminSpark">✦</span><span><strong>Hai, saya AMIN!</strong><small>{open?'Tutup panduan':'Ada yang boleh dibantu?'}</small></span><span className="aminLauncherArrow">{open?'×':'↗'}</span></button>
 </div>
}
