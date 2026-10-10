import Header from '@/components/Header';import Footer from '@/components/Footer';import Carousel from '@/components/Carousel';import SeriLaSereneCarousel from '@/components/SeriLaSereneCarousel';import AlumniCarousel from '@/components/AlumniCarousel';import {AppointmentForm,FeedbackForm} from '@/components/Forms';import {publicData} from '@/lib/data';import HomeVideo from '@/components/HomeVideo';

export default async function Home(){
  const d=await publicData();
  const homeVideo=d.media.find((x:any)=>x.section==='home'&&x.type==='video');
  const sereneGallery=d.media.filter((x:any)=>x.section==='home'&&x.type==='carousel');
  return <>
    <Header site={d.site} nav={d.nav}/>

    <Carousel items={d.carousel}/>

    <section className="announcementSection">
      <div className="wrap">
        <div className="announcementBar">
          <div className="announcementIcon">📢</div>
          <div>
            <span className="announcementLabel">PENGUMUMAN</span>
            {d.announcements.length ? <>
              <h2>{d.announcements[0].title}</h2>
              <p>{d.announcements[0].body}</p>
            </> : <><h2>Pengumuman Terkini</h2><p>Tiada pengumuman buat masa ini.</p></>}
          </div>
        </div>
      </div>
    </section>

    <section className="section white homePosterSection">
      <div className="wrap">
        <div className="sectionTitle"><h2>JOM HUBUNGI GBK ANDA</h2></div>
        <div className="homePosterBox"><img src={d.site.contact_image_url || '/jom-hubungi-gbk-anda.png'} alt="Talian sokongan psikososial — Jom Hubungi GBK Anda" /></div>
      </div>
    </section>
    <section className="section homePosterSection serenePosterSection">
      <div className="wrap">
        <div className="sectionTitle"><h2>SERI LA SERENE DI HATI</h2></div>
        <div className="homePosterBox"><img src={(d.site as any).serene_image_url || '/seri-la-serene-di-hati.png'} alt="Rasional penamaan UBK Seri La Serene" /></div>
      </div>
    </section>

    {(d.links||[]).some((x:any)=>x.placement==='home' && x.title!=='__SERENE_ZEP_QUIZ__') && <section className="section alumniSection"><div className="wrap"><div className="sectionTitle"><h2>PAUTAN PILIHAN</h2><p>Terokai laman web dan bahan rujukan pilihan UBK.</p></div><div className="externalHomeLinks">{(d.links||[]).filter((x:any)=>x.placement==='home' && x.title!=='__SERENE_ZEP_QUIZ__').map((x:any)=><a key={x.id} className="externalHomeCard" href={x.url} target="_blank" rel="noopener noreferrer"><strong>{x.title} ↗</strong>{x.description&&<span>{x.description}</span>}</a>)}</div></div></section>}

    <section className="section alumniSection">
      <div className="wrap">
        <div className="sectionTitle"><span className="pill">INSPIRASI LEPASAN SPM</span><h2>JEJAK ALUMNI</h2><p>Dari SERI LA ke dunia — lihat perjalanan bekas murid meneruskan pengajian mereka.</p></div>
        <AlumniCarousel items={d.alumni}/>
      </div>
    </section>

    <section className="section white"><div className="wrap grid2"><div><span className="pill">VIDEO PILIHAN</span><h2 style={{fontSize:38,color:'var(--blue)'}}>Highlight & Informasi UBK</h2></div><div className="videoBox"><HomeVideo url={homeVideo?.url} title={homeVideo?.title || 'Video UBK'}/></div></div></section>
    <SeriLaSereneCarousel items={sereneGallery}/>
    <section className="section"><div className="wrap"><div className="sectionTitle"><h2>Temujanji & Maklum Balas</h2><p>{d.site.appointment_intro}</p></div><div className="formsGrid"><AppointmentForm/><FeedbackForm/></div></div></section>
    <Footer/>
  </>
}
