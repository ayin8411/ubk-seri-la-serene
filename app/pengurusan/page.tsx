import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ManagementInlineEditor from '@/components/ManagementInlineEditor';
import {publicData} from '@/lib/data';

export default async function Page(){
  const d=await publicData();
  const site=d.site||{};
  return <>
    <Header site={site} nav={d.nav}/>
    <div className="pageHero managementHero"><div className="wrap">
      <span className="pill">{site.management_badge||'PENGURUSAN'}</span>
      <h1>{site.management_title||'Pengurusan UBK'}</h1>
      <p>{site.management_intro||'Visi, misi, organisasi dan akses pengurusan fail.'}</p>
    </div></div>
    <section className="section managementSection"><div className="wrap">
      <div className="grid2">
        <div className="card visionCard"><div className="cardAccent">VISI</div><h3>Visi</h3><p>{site.vision||'Perkhidmatan bimbingan dan kaunseling yang berkualiti ke arah kesejahteraan dan kecemerlangan murid.'}</p></div>
        <div className="card missionCard"><div className="cardAccent">MISI</div><h3>Misi</h3><p>{site.mission||'Membimbing murid mengenali potensi diri, membuat keputusan bijak dan membina masa depan yang positif.'}</p></div>
      </div>
      <div className="sectionTitle orgTitle" style={{marginTop:60}}><span className="titleKicker">STRUKTUR UBK</span><h2>{site.management_org_title||'Carta Organisasi'}</h2></div>
      <div className="org">{d.org.map((x:any,i:number)=><div className="person" key={x.id||i}>{x.photo_url?<img src={x.photo_url} alt={x.name}/>:<div className="avatar">FOTO</div>}<h3>{x.name||'Nama'}</h3><p>{x.role||'Jawatan'}</p></div>)}</div>
      <div className="card fileCard" style={{marginTop:34}}>
        <div className="fileIcon">📁</div><div><h3>{site.management_files_title||'PENGURUSAN FAIL'}</h3>
        <p>{site.management_files_text||'Akses folder pengurusan yang dipautkan dengan Google Drive.'}</p>
        <a className="btn yellow" target="_blank" href={site.management_drive_url||'#'}>{site.management_files_button||'Buka Google Drive'}</a></div>
      </div>
    </div></section>
    <ManagementInlineEditor site={site} org={d.org} nav={d.nav}/>
    <Footer/>
  </>
}
