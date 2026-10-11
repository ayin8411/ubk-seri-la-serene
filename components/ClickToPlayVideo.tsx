'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type Props = {
  url: string
  title?: string
  className?: string
  style?: CSSProperties
}

/**
 * Avoid sending any video requests to Supabase until a visitor explicitly
 * chooses to watch. `preload="none"` is kept as another bandwidth safeguard.
 */
export default function ClickToPlayVideo({ url, title = 'Video UBK', className, style }: Props) {
  const [started, setStarted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!started) return
    // This is initiated by the user's button press. If autoplay is blocked,
    // native video controls still allow manual playback.
    videoRef.current?.play().catch(() => {})
  }, [started, url])

  if (!started) {
    return (
      <button
        type="button"
        onClick={() => setStarted(true)}
        className={`ubkVideoStart ${className || ''}`.trim()}
        style={{ ...style, display: 'flex', background: undefined, height: style?.height === 'auto' ? undefined : style?.height }}
        aria-label={`Main video: ${title}`}
      >
        <span className="ubkVideoStartIcon" aria-hidden="true">▶</span>
        <strong>Main Video</strong>
        <small>{title}</small>
        <span className="ubkVideoStartNote">Video dimuatkan apabila anda menekan main.</span>
      </button>
    )
  }
  return (
    <video
      ref={videoRef}
      key={url}
      src={url}
      controls
      playsInline
      preload="none"
      className={className}
      style={style}
      aria-label={title}
    >
      Pelayar anda tidak menyokong paparan video.
    </video>
  )
}
