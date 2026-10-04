'use client'
import {useEffect} from 'react'
export default function Tracker(){useEffect(()=>{fetch('/api/track',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({path:location.pathname})}).catch(()=>{})},[]);return null}
