const social = [
  {
    name: 'Instagram',
    handle: '@ubk.smkserilalang',
    href: 'https://www.instagram.com/ubk.smkserilalang/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r="1" className="fillDot"/></svg>
    )
  },
  {
    name: 'TikTok',
    handle: '@ubkserilalang',
    href: 'https://www.tiktok.com/@ubkserilalang',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 3v10.1a4.7 4.7 0 1 1-4-4.65v2.95a1.9 1.9 0 1 0 1.2 1.76V3h2.8Zm0 0c.4 2.4 1.9 3.95 4.8 4.4v2.9c-2.05-.12-3.65-.78-4.8-1.78V3Z"/></svg>
    )
  },
  {
    name: 'Facebook',
    handle: 'UBK SMKSL Kluang',
    href: 'https://www.facebook.com/share/1Kqq1QwSoA/?mibextid=wwXIfr',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4.5c-.52-.07-2.3-.22-4.42-.22-4.18 0-7.04 2.55-7.04 7.25V15H2v4h3.54v10H10V19h3.4l.54-4H10v-3.08C10 10.76 10.31 8 14 8Z" transform="scale(.78) translate(4 -1)"/></svg>
    )
  }
]

export default function Footer(){
  return <footer>
    <div className="wrap socialFollow">
      <div className="socialIntro">
        <span className="socialKicker">MEDIA SOSIAL UBK</span>
        <h2>JOM FOLLOW KAMI</h2>
        <p>Ikuti aktiviti, info kerjaya, psikometrik dan perkembangan terkini UBK SERI LA SERENE.</p>
      </div>
      <div className="socialLinks">
        {social.map((item)=><a key={item.name} className="socialCard" href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.name} ${item.handle}`}>
          <span className="socialIcon">{item.icon}</span>
          <span><b>{item.name}</b><small>{item.handle}</small></span>
          <span className="socialArrow">↗</span>
        </a>)}
      </div>
    </div>
    <div className="wrap footerBottom">
      <div><b>UBK SERI LA SERENE</b><p>Aura Positif, Minda Progresif, Murid Proaktif</p></div>
      <div><a href="/admin">Dashboard Admin</a><p>© {new Date().getFullYear()} SMK Seri Lalang</p></div>
    </div>
  </footer>
}
