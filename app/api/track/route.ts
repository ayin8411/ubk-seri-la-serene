import {NextResponse} from 'next/server'
const FALLBACK_URL = 'https://nfmjdvvqxbmqkjfgeibo.supabase.co'
const FALLBACK_PUBLISHABLE_KEY = 'sb_publishable_02qM2kPAUBikHOzel1FViA_LmcLRUZF'
export async function POST(req:Request){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL||FALLBACK_URL
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||FALLBACK_PUBLISHABLE_KEY
  try{
    const {path}=await req.json()
    const r=await fetch(`${url}/rest/v1/page_views`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'content-type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({path:path||'/'})})
    if(!r.ok){
      const detail=await r.text().catch(()=> '')
      console.error('page_views insert failed',r.status,detail)
      return NextResponse.json({ok:false},{status:200})
    }
    return NextResponse.json({ok:true})
  }catch(error){
    console.error('page_views tracker failed',error)
    return NextResponse.json({ok:false},{status:200})
  }
}
