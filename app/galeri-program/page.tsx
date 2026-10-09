import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MediaImageCarousel from '@/components/MediaImageCarousel'
import {publicData} from '@/lib/data'
export default async function Page(){
 const d=await publicData()
 const images=(d.media||[]).filter((item:any)=>item.section==='galeri_program'&&['image','gambar','photo'].includes(String(item.type||'').toLowerCase())).sort((a:any,b:any)=>Number(a.order_no||0)-Number(b.order_no||0))
 return <><Header site={d.site} nav={d.nav}/>
 <div className="pageHero"><div className="wrap"><span className="pill">SOROTAN PROGRAM UBK</span><h1>GALERI PROGRAM</h1><p>Kenangan, aktiviti dan sorotan program UBK SERI LA SERENE.</p></div></div>
 <section className="section alumniSection"><div className="wrap"><div className="antiBuliCarouselSection"><div className="mindaPortraitHead"><span className="pill">GALERI BERGAMBAR</span><h2>AKTIVITI & PROGRAM</h2><p>Imbas kembali pelbagai program dan aktiviti sekolah.</p></div>
 {images.length?<MediaImageCarousel items={images} className="antiBuliCarousel" ariaLabel="Galeri Program UBK"/>:<div className="card" style={{textAlign:'center',padding:36}}>Gambar program akan dipaparkan di sini selepas dimuat naik melalui Dashboard → Galeri Program.</div>}
 </div></div></section><Footer/></>
}
