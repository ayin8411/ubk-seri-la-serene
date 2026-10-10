import {NextResponse} from 'next/server'
export const dynamic='force-dynamic'
const fallbackUrl='https://nfmjdvvqxbmqkjfgeibo.supabase.co'
const fallbackKey='sb_publishable_02qM2kPAUBikHOzel1FViA_LmcLRUZF'
export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL||fallbackUrl
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||fallbackKey
 // RPC exposes aggregates only; raw visitor records remain protected by RLS.
 try{
  const res=await fetch(`${url}/rest/v1/rpc/portal_visitor_stats`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:'{}',cache:'no-store'})
  if(!res.ok)throw new Error(`RPC HTTP ${res.status}`)
  const raw=await res.json()
  const v=Array.isArray(raw)?raw[0]:raw
  if(!v || !['total','today','week'].every(k=>Number.isFinite(Number(v[k]))))throw new Error('Invalid statistics')
  return NextResponse.json({total:Number(v.total),today:Number(v.today),week:Number(v.week)},{headers:{'Cache-Control':'no-store'}})
 }catch{return NextResponse.json({error:'Statistik belum tersedia. Jalankan SQL portal-visitor-stats.sql.'},{status:503,headers:{'Cache-Control':'no-store'}})}
}
