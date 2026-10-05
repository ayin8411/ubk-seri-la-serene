export default function HomeVideo({url,title='Video UBK'}:{url?:string,title?:string}){
  if(!url) return <b>Ruang Video UBK</b>
  const raw=url.trim()
  const low=raw.toLowerCase().split('?')[0]
  const direct=/\.(mp4|webm|ogg|mov)$/.test(low)
  let embed=raw
  try{
    const u=new URL(raw)
    if(u.hostname.includes('youtube.com')){
      const id=u.searchParams.get('v')
      if(id) embed=`https://www.youtube.com/embed/${id}`
    } else if(u.hostname==='youtu.be'){
      const id=u.pathname.replace(/^\//,'')
      if(id) embed=`https://www.youtube.com/embed/${id}`
    }
  }catch{}
  if(direct) return <video src={raw} controls playsInline preload="metadata" style={{width:'100%',height:'100%',objectFit:'contain',background:'#000'}}>{title}</video>
  return <iframe src={embed} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
}
