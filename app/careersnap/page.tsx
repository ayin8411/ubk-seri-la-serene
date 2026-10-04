import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { publicData } from '@/lib/data'

export default async function Page() {
  const d = await publicData()

  // Terima huruf besar/kecil supaya "CareerSnap" dan "careersnap" kedua-duanya berfungsi.
  const media = (d.media ?? [])
    .filter((x: any) => String(x.section ?? '').trim().toLowerCase() === 'careersnap')
    .sort((a: any, b: any) => Number(a.order_no ?? 0) - Number(b.order_no ?? 0))

  const mediaType = (value: unknown) => String(value ?? '').trim().toLowerCase()
  const isVideo = (type: string) => ['video', 'mp4', 'mov', 'webm'].includes(type)
  const isImage = (type: string) => ['image', 'gambar', 'photo', 'png', 'jpg', 'jpeg', 'webp'].includes(type)
  const isPdf = (type: string) => ['pdf', 'application/pdf'].includes(type)

  return (
    <>
      <Header site={d.site} nav={d.nav} />

      <div className="pageHero">
        <div className="wrap">
          <span className="pill">CAREERSNAP</span>
          <h1>CareerSnap</h1>
          <p>Kenali personaliti kerjaya, hala tuju dan peluang masa depan.</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          {media.length > 0 && (
            <>
              <div className="sectionTitle">
                <h2>Media CareerSnap</h2>
                <p>Video, poster, gambar dan PDF dipaparkan terus daripada dashboard.</p>
              </div>

              {media.map((item: any, i: number) => {
                const type = mediaType(item.type)
                const title = item.title || 'Bahan CareerSnap'

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
            </>
          )}

        </div>
      </section>

      <Footer />
    </>
  )
}
