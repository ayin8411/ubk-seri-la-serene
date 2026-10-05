import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { publicData } from '@/lib/data'

export default async function Page() {
  const d = await publicData()

  const normalizeSection = (value: unknown) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_')

  const mediaType = (value: unknown) => String(value ?? '').trim().toLowerCase()

  // Media Minda Sihat diurus terus melalui Dashboard → Media.
  // Bahagian boleh ditulis sebagai minda_sihat, minda-sihat atau Minda Sihat.
  const media = (d.media ?? [])
    .filter((item: any) => normalizeSection(item.section) === 'minda_sihat')
    .sort((a: any, b: any) => Number(a.order_no ?? 0) - Number(b.order_no ?? 0))

  const isVideo = (type: string) => ['video', 'mp4', 'mov', 'webm'].includes(type)
  const isImage = (type: string) => ['image', 'gambar', 'photo', 'png', 'jpg', 'jpeg', 'webp'].includes(type)
  const isPdf = (type: string) => ['pdf', 'application/pdf'].includes(type)

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

      <section className="section">
        <div className="wrap">
          <div className="sectionTitle">
            <h2>Tips Kesejahteraan</h2>
          </div>

          <div className="cards">
            {d.tips.map((item: any, i: number) => (
              <div className="card" key={i}>
                <div className="icon">💛</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>

          {media.length > 0 && (
            <div style={{ marginTop: 42 }}>
              {media.map((item: any, i: number) => {
                const type = mediaType(item.type)
                const title = item.title || 'Bahan Minda Sihat'

                return (
                  <div
                    className="card"
                    key={item.id ?? `${item.url}-${i}`}
                    style={{ margin: '0 auto 28px', overflow: 'hidden', maxWidth: 680 }}
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
                        style={{
                          width: '100%',
                          maxWidth: 380,
                          height: 'auto',
                          display: 'block',
                          margin: '0 auto',
                          objectFit: 'contain',
                          borderRadius: 16,
                        }}
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
