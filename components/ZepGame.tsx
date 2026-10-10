 'use client';
import {useState} from 'react';
export default function ZepGame({url}:{url:string}){
 const [frameKey,setFrameKey]=useState(0);
 const [notice,setNotice]=useState(false);
 const safe=/^https:\/\/quiz\.zep\.us\/en\/play\/[a-zA-Z0-9_-]+\/?$/.test(url)?url:'https://quiz.zep.us/en/play/5gnavv';
 const fullscreen=()=>{const el=document.getElementById('serene-zep-iframe');if(el?.requestFullscreen){el.requestFullscreen().catch(()=>setNotice(true))}else setNotice(true)};
 return <div className="zepCard">
   <div className="zepTop"><div><span className="pill">ZEP QUIZ</span><h2>ZON PERMAINAN MINDA SIHAT</h2><p>Permainan dipaparkan terus dalam portal jika dibenarkan oleh ZEP QUIZ.</p></div><div className="zepActions"><button type="button" onClick={fullscreen}>⛶ Skrin Penuh</button><button type="button" onClick={()=>setFrameKey(k=>k+1)}>↻ Muat Semula</button><a href={safe} target="_blank" rel="noopener noreferrer">↗ Buka Game</a></div></div>
   <iframe key={frameKey} id="serene-zep-iframe" src={safe} title="ZEP QUIZ - ZON PERMAINAN MINDA SIHAT" allow="fullscreen; autoplay" allowFullScreen loading="eager" referrerPolicy="strict-origin-when-cross-origin" />
   <div className="zepFoot"><p>Jika paparan permainan kosong atau terhalang, ZEP QUIZ mungkin tidak membenarkan iframe. Gunakan butang <b>Buka Game</b> untuk bermain di laman asal.</p>{notice&&<p>Skrin penuh tidak tersedia pada pelayar ini. Cuba buka permainan di tab baharu.</p>}</div>
 </div>
}
