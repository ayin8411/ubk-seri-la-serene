import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {publicData} from '@/lib/data';

const PSIKOMETRIK_REPORT_URL='https://datastudio.google.com/reporting/725490ad-eed1-4657-9e85-e76e6ea73ff0?embedded=true';

export default async function Page(){
  const d=await publicData();
  return <>
    <Header site={d.site} nav={d.nav}/>
    <section className="psychometricDirectSection">
      <iframe
        className="psychometricDirectFrame"
        src={PSIKOMETRIK_REPORT_URL}
        title="Pelaporan Pentaksiran Psikometrik SMK Seri Lalang"
        loading="eager"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
    <Footer/>
  </>;
}
