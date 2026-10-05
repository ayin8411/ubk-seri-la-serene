import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { publicData } from '@/lib/data'
import MediaImageCarousel from '@/components/MediaImageCarousel'

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

  const media = (d.media ?? [])
    .filter((item: any) => normalizeSection(item.section) === 'kami_benci_buli')
    .sort((a: any, b: any) => Number(a.order_no ?? 0) - Number(b.order_no ?? 0))

  const imageMedia = media.filter((item: any) => isImage(mediaType(item.type)))
  const otherMedia = media.filter((item: any) => !isImage(mediaType(item.type)))

  return (
    <>
      <Header site={d.site} nav={d.nav} />

      <div className="pageHero antiBuliHero">
        <div className="wrap">
          <span className="pill">SEKOLAH SELAMAT</span>
          <h1>KAMI BENCI BULI</h1>
          <p>Ruang kesedaran, pendidikan dan bahan pencegahan buli untuk warga sekolah.</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          {media.length > 0 ? (
            <>
              {imageMedia.length > 0 && (
                <div className="antiBuliCarouselSection">
                  <div className="mindaPortraitHead">
                    <span className="pill">GALERI</span>
                    <h2>GAMBAR KAMI BENCI BULI</h2>
                  </div>
                  <MediaImageCarousel
                    items={imageMedia}
                    className="antiBuliCarousel"
                    imageClassName="antiBuliCarouselImage"
                    ariaLabel="Galeri Kami Benci Buli"
                  />
                </div>
              )}

              {otherMedia.length > 0 && (
                <div className="antiBuliMediaGrid antiBuliOtherMedia">
                  {otherMedia.map((item: any, i: number) => {
                    const type = mediaType(item.type)
                    const title = item.title || 'Bahan Anti Buli'
                    return (
                      <article className={`card antiBuliMediaCard ${isVideo(type) || isPdf(type) ? 'antiBuliWideCard' : ''}`} key={item.id ?? `${item.url}-${i}`}>
                        {item.title && <h3>{item.title}</h3>}

                        {isVideo(type) && (
                          <video
                            src={item.url}
                            controls
                            playsInline
                            preload="metadata"
                            className="antiBuliVideo"
                          >
                            Pelayar anda tidak menyokong paparan video.
                          </video>
                        )}

                        {isPdf(type) && (
                          <>
                            <iframe src={item.url} title={title} className="antiBuliPdf" />
                            <div className="antiBuliAction">
                              <a className="button yellow" href={item.url} target="_blank" rel="noreferrer">
                                Buka PDF Penuh
                              </a>
                            </div>
                          </>
                        )}

                        {!isVideo(type) && !isPdf(type) && (
                          <div>
                            <p>Format ini belum mempunyai paparan terus.</p>
                            <a className="button yellow" href={item.url} target="_blank" rel="noreferrer">Buka Bahan</a>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="card antiBuliEmpty">
              <h2>KAMI BENCI BULI</h2>
              <p>Bahan gambar, PDF dan video akan dipaparkan di sini selepas ditambah melalui Dashboard → Media.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
