'use client'

import { useEffect, useRef } from 'react'

export default function CareerSnapCarousel({ items, heading = "Sorotan CareerSnap", description = "Sekilas aktiviti dan momen CareerSnap." }: { items: any[], heading?: string, description?: string }) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || items.length < 2) return

    const timer = window.setInterval(() => {
      const firstCard = track.querySelector<HTMLElement>('[data-carousel-card]')
      const step = (firstCard?.offsetWidth ?? 240) + 14
      const maxScroll = track.scrollWidth - track.clientWidth

      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 3500)

    return () => window.clearInterval(timer)
  }, [items.length])

  if (!items.length) return null

  const scroll = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.querySelector<HTMLElement>('[data-carousel-card]')
    const step = (firstCard?.offsetWidth ?? 240) + 14
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <section style={{ marginTop: 30, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 'clamp(20px, 2.4vw, 28px)' }}>{heading}</h2>
          <p style={{ margin: '5px 0 0', opacity: .72, fontSize: 14 }}>{description}</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            aria-label="Gambar sebelumnya"
            onClick={() => scroll(-1)}
            style={{
              width: 38, height: 38, borderRadius: 999, border: '1px solid rgba(0,0,0,.12)',
              background: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1,
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Gambar seterusnya"
            onClick={() => scroll(1)}
            style={{
              width: 38, height: 38, borderRadius: 999, border: '1px solid rgba(0,0,0,.12)',
              background: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1,
            }}
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          paddingBottom: 4,
        }}
      >
        {items.map((item: any, i: number) => (
          <div
            data-carousel-card
            key={item.id ?? `${item.url}-${i}`}
            style={{
              flex: '0 0 clamp(210px, 31vw, 300px)',
              scrollSnapAlign: 'start',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,.08)',
            }}
          >
            <img
              src={item.url}
              alt={item.title || `Sorotan CareerSnap ${i + 1}`}
              loading="lazy"
              style={{
                width: '100%',
                height: 170,
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {item.title && (
              <div style={{ padding: '10px 12px 12px', fontSize: 14, fontWeight: 700 }}>
                {item.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
