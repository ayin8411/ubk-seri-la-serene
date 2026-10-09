import './globals.css'; import type {Metadata} from 'next'; import Tracker from '@/components/Tracker'; import DynamicFavicon from '@/components/DynamicFavicon'
export const metadata:Metadata={title:'UBK SERI LA SERENE',description:'Portal Unit Bimbingan dan Kaunseling SMK Seri Lalang'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ms"><body><Tracker/><DynamicFavicon/>{children}</body></html>}
