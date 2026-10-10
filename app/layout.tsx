import './globals.css'
import type { Metadata, Viewport } from 'next'
import Tracker from '@/components/Tracker'
import DynamicFavicon from '@/components/DynamicFavicon'
import AminAssistant from '@/components/AminAssistant'

export const metadata: Metadata = {
  title: 'UBK SERI LA SERENE',
  description: 'Portal Unit Bimbingan dan Kaunseling SMK Seri Lalang',
  applicationName: 'UBK SERI LA SERENE',
  appleWebApp: { capable: true, title: 'UBK SERENE', statusBarStyle: 'default' },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/favicon.ico',
    apple: [{url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png'}],
  },
  manifest: '/site.webmanifest',
}
export const viewport: Viewport = { themeColor: '#003a96' }
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ms"><body><Tracker/><DynamicFavicon/>{children}<AminAssistant/></body></html>
}
