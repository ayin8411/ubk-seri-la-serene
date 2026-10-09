'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DynamicFavicon(){
  useEffect(() => {
    let active = true
    const s = createClient()
    s.from('site_settings').select('favicon_url').eq('id',1).maybeSingle().then(({data}) => {
      if (!active) return
      const url = data?.favicon_url || '/favicon.png'
      document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(node => node.remove())
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = url.toLowerCase().split('?')[0].endsWith('.ico') ? 'image/x-icon' : 'image/png'
      link.href = url
      document.head.appendChild(link)
    })
    return () => { active = false }
  },[])
  return null
}
