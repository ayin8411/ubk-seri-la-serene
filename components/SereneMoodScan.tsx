'use client'

import { useEffect, useRef, useState } from 'react'

/** Mood Scan is served from the portal's own public/ folder, not an external iframe. */
export default function SereneMoodScan() {
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(740)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return
      if (!event.data || event.data.type !== 'serene-mood:height') return
      const reported = Number(event.data.height)
      if (Number.isFinite(reported)) setHeight(Math.max(470, Math.min(2300, Math.ceil(reported))))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div className="sereneMoodWidget">
      <div className="sereneMoodWidgetTop">
        <div>
          <span className="pill">💙 SERENE MOOD SCAN</span>
          <p>Semak emosi tanpa nama. Pilih emoji, dapatkan petua dan buka kad motivasi.</p>
        </div>
        <div className="sereneMoodWidgetActions">
          <a href="/serene-mood-scan/index.html" target="_blank" rel="noopener noreferrer">↗ Paparan Penuh</a>
          <button type="button" onClick={() => { setHeight(740); setReloadKey(v => v + 1) }}>↻ Mula Semula</button>
        </div>
      </div>
      <iframe
        key={reloadKey}
        ref={frame}
        className="sereneMoodFrame"
        src="/serene-mood-scan/index.html?embed=1"
        title="SERENE MOOD SCAN: Permainan Semakan Emosi Interaktif"
        style={{ height }}
        loading="eager"
        referrerPolicy="same-origin"
      />
      <div className="sereneMoodWidgetFooter">
        <span>🔒 Maklumat emosi direkod tanpa nama. Permintaan kepada GBK dihantar melalui borang sulit yang berasingan.</span>
        <a href="/serene-mood-scan/index.html#guru" target="_blank" rel="noopener noreferrer">Papan Pemuka Guru ↗</a>
      </div>
    </div>
  )
}
