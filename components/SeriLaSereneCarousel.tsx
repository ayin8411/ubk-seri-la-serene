'use client'

import { useEffect, useRef } from 'react'

export default function SeriLaSereneCarousel({ items }: { items: any[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || items.length < 2) return

    const timer = window.setInterval(() => {
      const firstCard = track.querySelector<HTMLElement>('[data-serene-card]')
      const step = (firstCard?.offsetWidth ?? 250) + 14
      const maxScroll = track.scrollWidth - track.clientWidth

      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 3800)

    return () => window.clearInterval(timer)
  }, [items.length])

  const scroll = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.querySelector<HTMLElement>('[data-serene-card]')
    const step = (firstCard?.offsetWidth ?? 250) + 14
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <section className="sereneGallerySection">
      <div className="wrap">
        <div className="sereneGalleryHead">
          <div>
            <span className="pill">GALERI UBK</span>
            <h2>BILIK SERI LA SERENE</h2>
            <p>Kenali ruang, suasana dan kemudahan Bilik Bimbingan &amp; Kaunseling.</p>
          </div>
          {items.length > 1 && (
            <div className="sereneGalleryControls">
              <button type="button" aria-label="Gambar sebelumnya" onClick={() => scroll(-1)}>‹</button>
              <button type="button" aria-label="Gambar seterusnya" onClick={() => scroll(1)}>›</button>
            </div>
          )}
        </div>

        {items.length ? (
          <div className="sereneGalleryTrack" ref={trackRef}>
            {items.map((item: any, i: number) => (
              <figure className="sereneGalleryCard" data-serene-card key={item.id ?? `${item.url}-${i}`}>
                <img src={item.url} alt={item.title || `Bilik SERI LA SERENE ${i + 1}`} loading="lazy" />
                {item.title && <figcaption>{item.title}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          <div className="sereneGalleryEmpty">
            <b>Galeri BILIK SERI LA SERENE</b>
            <span>Tambah gambar melalui Dashboard → Media dengan Bahagian <b>home</b> dan Jenis Media <b>carousel</b>.</span>
          </div>
        )}
      </div>
    </section>
  )
}
