import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { publicData } from '@/lib/data'
import MediaImageCarousel from '@/components/MediaImageCarousel'
import CareerSnapCarousel from '@/components/CareerSnapCarousel'

export default async function Page(){
 const d=await publicData()
 const images=(section:string)=>(d.media||[]).filter((x:any)=>x.section===section && ['image','gambar','png','jpg','jpeg','webp','photo'].includes(String(x.type||'').toLowerCase())).sort((a:any,b:any)=>Number(a.order_no||0)-Number(b.order_no||0))
 const pencapaian=images('serene_teraju_pencapaian')
 const aktiviti=images('serene_teraju_aktiviti')
 return <>
  <Header site={d.site} nav={d.nav}/>
  <div className="pageHero"><div className="wrap"><span className="pill">KEPIMPINAN MURID</span><h1>SERENE TERAJU</h1><p>Memimpin dengan inspirasi, membina legasi. Sorotan pencapaian dan aktiviti PRS serta SLB SMK Seri Lalang.</p></div></div>
  <section className="section"><div className="wrap">
   <div className="antiBuliCarouselSection"><div className="mindaPortraitHead"><span className="pill">KEJAYAAN PEMIMPIN MUDA</span><h2>PENCAPAIAN PRS / SLB</h2><p>Pengiktirafan, anugerah dan pencapaian pemimpin murid.</p></div>
    {pencapaian.length ? <MediaImageCarousel items={pencapaian} className="antiBuliCarousel" imageClassName="antiBuliCarouselImage" ariaLabel="Pencapaian PRS SLB"/> : <div className="card" style={{padding:25,textAlign:'center'}}>Galeri pencapaian akan dipaparkan di sini. Admin boleh menambah gambar melalui Dashboard → Pencapaian PRS/SLB.</div>}
   </div>
   <div className="terajuActivities"><div className="mindaPortraitHead"><span className="pill">LEADERS IN ACTION</span><h2>AKTIVITI SERENE TERAJU</h2><p>Kenangan kursus, program dan aktiviti kepimpinan murid.</p></div>
    {aktiviti.length ? <CareerSnapCarousel items={aktiviti} heading="Galeri Aktiviti SERENE TERAJU" description="Aktiviti dan kenangan pemimpin PRS serta SLB."/> : <div className="card" style={{padding:25,textAlign:'center'}}>Galeri aktiviti akan dipaparkan di sini. Admin boleh menambah gambar melalui Dashboard → Aktiviti SERENE TERAJU.</div>}
   </div>
  </div></section>
  <Footer/>
 </>
}
