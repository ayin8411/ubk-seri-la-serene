import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {publicData} from '@/lib/data';

const PSIKOMETRIK_REPORT_URL='https://datastudio.google.com/reporting/725490ad-eed1-4657-9e85-e76e6ea73ff0';

export default async function Page(){
  const d=await publicData();
  return <>
    <Header site={d.site} nav={d.nav}/>
    <div className="pageHero">
      <div className="wrap">
        <span className="pill">PSIKOMETRIK</span>
        <h1>Pentaksiran Psikometrik</h1>
        <p>Dashboard dan maklumat psikometrik murid.</p>
      </div>
    </div>
    <section className="section psychometricMainSection">
      <div className="wrap">
        <div className="psychometricReportCard">
          <div className="psychometricReportHeader">
            <div>
              <h2>Dashboard Psikometrik</h2>
              <p>Laporan interaktif dipaparkan terus di halaman ini.</p>
            </div>
            <a className="btn yellow" href={PSIKOMETRIK_REPORT_URL} target="_blank" rel="noreferrer">Buka Paparan Penuh</a>
          </div>
          <div className="psychometricEmbedWrap">
            <iframe
              src={PSIKOMETRIK_REPORT_URL}
              title="Dashboard Psikometrik UBK SERI LA SERENE"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
    <Footer/>
  </>;
}
