import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { publicData } from '@/lib/data'
import MediaImageCarousel from '@/components/MediaImageCarousel'
import ZepGame from '@/components/ZepGame'

export default async function Page() {
  const d = await publicData()

  const normalizeSection = (value: unknown) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_')

  const mediaType = (value: unknown) => String(value ?? '').trim().toLowerCase()
  const isVideo = (type: string) => ['video', 'mp4', 'mov', 'webm'].includes(type)
  const isImage = (type: string) => ['image', 'gambar', 'photo', 'png', 'jpg', 'jpeg', 'webp'].includes(type)
  const isPdf = (type: string) => ['pdf', 'application/pdf'].includes(type)

  // Media Minda Sihat diurus terus melalui Dashboard → Media.
  // Bahagian boleh ditulis sebagai minda_sihat, minda-sihat atau Minda Sihat.
  const media = (d.media ?? [])
    .filter((item: any) => normalizeSection(item.section) === 'minda_sihat')
    .sort((a: any, b: any) => Number(a.order_no ?? 0) - Number(b.order_no ?? 0))

  // Ruang khas untuk poster / infografik portrait.
  // Dalam Dashboard → Media, pilih Bahagian = tips_kesejahteraan.
  // Alias lama tips_minda_sihat juga masih disokong.
  const portraitTips = (d.media ?? [])
    .filter((item: any) => ['tips_kesejahteraan', 'tips_minda_sihat'].includes(normalizeSection(item.section)))
    .filter((item: any) => isImage(mediaType(item.type)))
    .sort((a: any, b: any) => Number(a.order_no ?? 0) - Number(b.order_no ?? 0))

  // Ruang berasingan untuk INFOGRAFIK MINDA SIHAT, juga image portrait.
  const portraitInfographics = (d.media ?? [])
    .filter((item: any) => normalizeSection(item.section) === 'infografik_minda_sihat')
    .filter((item: any) => isImage(mediaType(item.type)))
    .sort((a: any, b: any) => Number(a.order_no ?? 0) - Number(b.order_no ?? 0))

  const game = (d.links ?? []).find((x: any) => x.title === '__SERENE_ZEP_QUIZ__')
  const gameUrl = game?.url || 'https://quiz.zep.us/en/play/5gnavv'

  return (
    <>
      <Header site={d.site} nav={d.nav} />

      <div className="pageHero">
        <div className="wrap">
          <span className="pill">MINDA SIHAT</span>
          <h1>Ruang Minda Sihat</h1>
          <p>Informasi ringkas untuk menyokong kesejahteraan murid.</p>
        </div>
      </div>

      <section className="section" id="zon-permainan-minda-sihat">
        <div className="wrap">
          <div className="sectionTitle">
            <span className="pill">🎮 ZEP QUIZ</span>
            <h2>ZON PERMAINAN MINDA SIHAT</h2>
            <p>Jom teroka ilmu kesejahteraan emosi melalui permainan interaktif!</p>
          </div>
          <ZepGame url={gameUrl} />
        </div>
      </section>


      <section className="section">
        <div className="wrap">
          <div className="sectionTitle">
            <h2>Tips Kesejahteraan</h2>
          </div>

          <div className="cards">
            {d.tips.map((item: any, i: number) => (
              <div className="card" key={i}>
                <div className="icon">💛</div>
                {item.big_title && <div className="tipBigTitle">{item.big_title}</div>}
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>


          {portraitTips.length > 0 && (
            <div className="mindaPortraitSection">
              <div className="mindaPortraitHead">
                <span className="pill">POSTER BESAR</span>
                <h2>TIPS KESEJAHTERAAN</h2>
                <p>Paparan poster portrait besar, 2 poster satu baris pada desktop supaya tulisan lebih jelas dibaca.</p>
              </div>

              <div className="mindaPortraitGrid">
                {portraitTips.map((item: any, i: number) => (
                  <figure className="mindaPortraitCard" key={item.id ?? `${item.url}-${i}`}>
                    <img
                      src={item.url}
                      alt={item.title || 'Tips Minda Sihat'}
                      loading="lazy"
                    />
                    {item.title && <figcaption>{item.title}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {portraitInfographics.length > 0 && (
            <div className="mindaPortraitSection mindaInfographicSection">
              <div className="mindaPortraitHead">
                <span className="pill">INFOGRAFIK</span>
                <h2>INFOGRAFIK MINDA SIHAT</h2>
              </div>

              <MediaImageCarousel
                items={portraitInfographics}
                className="mindaInfographicCarousel"
                imageClassName="mindaCarouselImage"
                ariaLabel="Infografik Minda Sihat"
              />
            </div>
          )}

          {media.length > 0 && (
            <div className="mindaMediaGrid">
              {media.map((item: any, i: number) => {
                const type = mediaType(item.type)
                const title = item.title || 'Bahan Minda Sihat'

                return (
                  <div
                    className={`card mindaMediaCard ${isImage(type) ? 'mindaImageCard' : 'mindaWideCard'}`}
                    key={item.id ?? `${item.url}-${i}`}
                  >
                    {item.title && (
                      <h3 style={{ marginTop: 0, marginBottom: 16 }}>{item.title}</h3>
                    )}

                    {isVideo(type) && (
                      <video
                        src={item.url}
                        controls
                        playsInline
                        preload="metadata"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          borderRadius: 16,
                          background: '#000',
                        }}
                      >
                        Pelayar anda tidak menyokong paparan video.
                      </video>
                    )}

                    {isImage(type) && (
                      <img
                        src={item.url}
                        alt={title}
                        loading="lazy"
                        className="mindaMediaImage"
                        style={{ maxHeight: 260 }}
                      />
                    )}

                    {isPdf(type) && (
                      <>
                        <iframe
                          src={item.url}
                          title={title}
                          style={{
                            width: '100%',
                            maxWidth: 600,
                            height: 400,
                            display: 'block',
                            margin: '0 auto',
                            border: '1px solid rgba(0,0,0,.12)',
                            borderRadius: 16,
                            background: '#fff',
                          }}
                        />
                        <div style={{ marginTop: 14 }}>
                          <a
                            className="button yellow"
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Buka PDF Penuh
                          </a>
                        </div>
                      </>
                    )}

                    {!isVideo(type) && !isImage(type) && !isPdf(type) && (
                      <div>
                        <p>Format ini belum mempunyai paparan terus.</p>
                        <a
                          className="button yellow"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Buka Bahan
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
