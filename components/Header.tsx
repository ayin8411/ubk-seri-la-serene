import Link from 'next/link'
export default function Header({site,nav}:{site:any,nav:any[]}){
 return <header className="header"><div className="wrap headerInner">
  <Link className="brand" href="/">
   <div className="logos">{site.school_logo_url?<img src={site.school_logo_url} alt="Logo sekolah"/>:<span>S</span>}{site.ubk_logo_url?<img src={site.ubk_logo_url} alt="Logo UBK"/>:<span>UBK</span>}</div>
   <div><b>{site.title}</b><small>{site.tagline}</small></div>
  </Link>
  <nav>{nav.map((x:any)=><Link key={x.href} href={x.href}>{x.label}</Link>)}</nav>
 </div></header>
}
