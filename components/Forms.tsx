'use client'
import {useState} from 'react'
import {createClient} from '@/lib/supabase/client'

function friendlyError(message?: string){
  if(!message) return 'Tidak dapat menyimpan data. Sila cuba lagi.'
  if(message.includes("appointment_date") || message.includes("appointment_time")) return 'Struktur pangkalan data Temujanji belum dikemas kini. Admin perlu jalankan fail SQL pembaikan yang disediakan.'
  if(message.includes("rating")) return 'Struktur pangkalan data Maklum Balas belum dikemas kini. Admin perlu jalankan fail SQL pembaikan yang disediakan.'
  return message
}

export function AppointmentForm(){
  const [msg,setMsg]=useState('')
  async function submit(e:any){
    e.preventDefault()
    const f=new FormData(e.currentTarget)
    const row=Object.fromEntries(f.entries())
    const s=createClient()
    if(!s){setMsg('Sambungan pangkalan data belum aktif.');return}
    const {error}=await s.from('appointments').insert(row)
    setMsg(error?friendlyError(error.message):'Temujanji berjaya dihantar.')
    if(!error)e.currentTarget.reset()
  }
  return <form className="formCard" onSubmit={submit}><h3>Temujanji Murid</h3><div className="grid2"><input name="student_name" placeholder="Nama murid" required/><input name="student_class" placeholder="Kelas" required/><input name="appointment_date" type="date" required/><input name="appointment_time" type="time" required/></div><select name="reason" required><option value="">Pilih tujuan</option><option>Akademik</option><option>Kerjaya</option><option>Emosi / Kesejahteraan</option><option>Lain-lain</option></select><textarea name="notes" placeholder="Catatan ringkas (pilihan)"/><button>Hantar Temujanji</button>{msg&&<p className="status">{msg}</p>}</form>
}

export function FeedbackForm(){
  const [msg,setMsg]=useState('')
  async function submit(e:any){
    e.preventDefault()
    const f=new FormData(e.currentTarget)
    const s=createClient()
    if(!s){setMsg('Sambungan pangkalan data belum aktif.');return}
    const {error}=await s.from('feedback').insert({name:f.get('name'),message:f.get('message'),rating:Number(f.get('rating'))})
    setMsg(error?friendlyError(error.message):'Terima kasih atas maklum balas anda.')
    if(!error)e.currentTarget.reset()
  }
  return <form className="formCard" onSubmit={submit}><h3>Apa Kata Anda?</h3><input name="name" placeholder="Nama (pilihan)"/><select name="rating" required><option value="">Penilaian</option><option value="1">⭐ Tidak Memuaskan</option><option value="2">⭐⭐ Memuaskan</option><option value="3">⭐⭐⭐ Amat Baik</option><option value="4">⭐⭐⭐⭐ Cemerlang</option></select><textarea name="message" placeholder="Kongsi pendapat atau cadangan" required/><button>Hantar Maklum Balas</button>{msg&&<p className="status">{msg}</p>}</form>
}
