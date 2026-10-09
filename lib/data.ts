import { defaults } from './defaults'

const FALLBACK_URL = 'https://nfmjdvvqxbmqkjfgeibo.supabase.co'
const FALLBACK_PUBLISHABLE_KEY = 'sb_publishable_02qM2kPAUBikHOzel1FViA_LmcLRUZF'

async function getJson(url:string,headers:any){
  try{const r=await fetch(url,{headers,cache:'no-store'});const j=await r.json();return Array.isArray(j)?j:[]}catch{return []}
}

export async function publicData(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY
  const headers = { apikey: key }
  try {
    const [s,n,c,o,t,m,r,a,al] = await Promise.all([
      getJson(`${url}/rest/v1/site_settings?select=*&id=eq.1`,headers),
      getJson(`${url}/rest/v1/navigation?select=*&is_active=eq.true&order=order_no.asc`,headers),
      getJson(`${url}/rest/v1/carousel_items?select=*&is_active=eq.true&order=order_no.asc`,headers),
      getJson(`${url}/rest/v1/organization_members?select=*&order=order_no.asc`,headers),
      getJson(`${url}/rest/v1/mental_health_tips?select=*&is_active=eq.true&order=order_no.asc`,headers),
      getJson(`${url}/rest/v1/media_items?select=*&is_active=eq.true&order=order_no.asc`,headers),
      getJson(`${url}/rest/v1/careersnap_resources?select=*&is_active=eq.true&order=order_no.asc`,headers),
      getJson(`${url}/rest/v1/announcements?select=*&is_active=eq.true&order=order_no.asc`,headers),
      getJson(`${url}/rest/v1/alumni?select=*&is_active=eq.true&order=order_no.asc`,headers),
    ])
    return {site:s?.[0]??defaults.site,nav:n?.length?(n.some((item:any)=>item.href==='/serene-teraju')?n:[...n,{label:"SERENE TERAJU",href:"/serene-teraju",order_no:99}]):defaults.nav,carousel:c?.length?c:defaults.carousel,org:o?.length?o:defaults.org,tips:t?.length?t:defaults.tips,media:m??[],resources:r??[],announcements:a??[],alumni:al??[]}
  } catch {
    return {site:defaults.site,nav:defaults.nav,carousel:defaults.carousel,org:defaults.org,tips:defaults.tips,media:[],resources:[],announcements:[],alumni:[]}
  }
}
