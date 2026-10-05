'use client'

import { useEffect, useState } from 'react'

type CarouselItem = {
  id?: string | number | null
  url: string
  title?: string | null
}

type Props = {
  items: CarouselItem[]
  className?: string
  imageClassName?: string
  ariaLabel?: string
}

export default function MediaImageCarousel({
  items,
  className = '',
  imageClassName = '',
  ariaLabel = 'Galeri gambar',
}: Props) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length)
    }, 5500)
    return () => window.clearInterval(timer)
  }, [items.length])

  if (!items.length) return null

  const go = (index: number) => {
    const total = items.length
    setActive((index + total) % total)
  }

  return (
    <div className={`mediaCarousel ${className}`.trim()} aria-label={ariaLabel}>
      <div className="mediaCarouselViewport">
        {items.map((item, index) => (
          <figure
            className={`mediaCarouselSlide ${index === active ? 'active' : ''}`}
            key={item.id ?? `${item.url}-${index}`}
            aria-hidden={index !== active}
          >
            <img
              src={item.url}
              alt={item.title || `${ariaLabel} ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              className={imageClassName}
            />
            {item.title && <figcaption>{item.title}</figcaption>}
          </figure>
        ))}

        {items.length > 1 && (
          <>
            <button
              className="mediaCarouselArrow mediaCarouselPrev"
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Gambar sebelumnya"
            >
              ‹
            </button>
            <button
              className="mediaCarouselArrow mediaCarouselNext"
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Gambar seterusnya"
            >
              ›
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="mediaCarouselDots" aria-label="Pilih gambar">
          {items.map((_, index) => (
            <button
              type="button"
              key={index}
              className={index === active ? 'active' : ''}
              aria-label={`Pergi ke gambar ${index + 1}`}
              aria-current={index === active ? 'true' : undefined}
              onClick={() => go(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
