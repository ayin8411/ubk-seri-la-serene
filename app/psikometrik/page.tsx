import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {publicData} from '@/lib/data';

const PSIKOMETRIK_REPORT_URL='https://datastudio.google.com/reporting/725490ad-eed1-4657-9e85-e76e6ea73ff0';

export default async function Page(){
  const d=await publicData();
  return <>
    <Header site={d.site} nav={d.nav}/>
    <main className="psychometricPreviewSection">
      <section className="psychometricPreviewCard">
        <div className="psychometricPreviewHeader">
          <div>
            <p className="psychometricEyebrow">PELAPORAN PENTAKSIRAN PSIKOMETRIK</p>
            <h1>Dashboard Psikometrik SMK Seri Lalang</h1>
            <p className="psychometricPreviewText">Paparan di bawah ialah preview dashboard. Tekan butang untuk membuka dashboard interaktif penuh.</p>
          </div>
          <a
            className="psychometricOpenButton"
            href={PSIKOMETRIK_REPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka Dashboard Psikometrik
          </a>
        </div>

        <a
          className="psychometricPreviewImageLink"
          href={PSIKOMETRIK_REPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka Dashboard Psikometrik"
        >
          <img
            className="psychometricPreviewImage"
            src="/psikometrik-preview.png"
            alt="Preview Dashboard Pelaporan Pentaksiran Psikometrik SMK Seri Lalang"
          />
          <span className="psychometricPreviewOverlay">Klik untuk buka dashboard interaktif</span>
        </a>
      </section>
    </main>
    <Footer/>
  </>;
}
