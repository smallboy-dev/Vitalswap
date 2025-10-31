import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function TipBubble(){
  const [open,setOpen] = useState(false)
  const [idx,setIdx] = useState(0)
  const timerRef = useRef(null)
  const autoHideRef = useRef(null)

  const tips = useMemo(()=>[
    'Did you know VitalSwap has one of the lowest fees in Africa?',
    'Ask the assistant “Show Customer fees” or “What’s the USD to NGN rate?”',
    'You can switch dark/light mode from the header at any time.',
    'Click the bell when it lights up to jump to Live Exchange Rates.',
    'Calculator uses live rates — try it with your amount.'
  ],[])

  useEffect(()=>{
    // show once per session after a short delay
    try{
      if(sessionStorage.getItem('tips_hidden')==='1') return
    }catch(_e){}
    const t = setTimeout(()=> setOpen(true), 2200)
    return ()=> clearTimeout(t)
  },[])

  const clearAutoHide = ()=>{ if(autoHideRef.current) clearTimeout(autoHideRef.current); autoHideRef.current = null }
  const scheduleAutoHide = ()=>{
    clearAutoHide()
    const vw = typeof window!=='undefined' ? window.innerWidth : 1024
    const isSmall = vw < 520
    const delay = isSmall ? 10000 : 14000 // 10s on mobile, 14s desktop
    autoHideRef.current = setTimeout(()=> hide(), delay)
  }

  useEffect(()=>{
    if(!open) return
    timerRef.current = setInterval(()=>{
      setIdx(v=> (v+1) % tips.length)
    }, 8000)
    scheduleAutoHide()
    return ()=>{ if(timerRef.current) clearInterval(timerRef.current); clearAutoHide() }
  },[open, tips.length])

  if(!open) return null

  const hide = ()=>{ setOpen(false); try{ sessionStorage.setItem('tips_hidden','1') }catch(_e){}; clearAutoHide() }
  const next = ()=>{ setIdx(v=> (v+1) % tips.length); scheduleAutoHide() }

  const vw = typeof window!=='undefined' ? window.innerWidth : 1024
  const isSmall = vw < 520
  const isTiny = vw < 380

  const maxWidth = isTiny ? '68vw' : isSmall ? '76vw' : '320px'
  const padY = isTiny ? 6 : isSmall ? 8 : 10
  const padX = isTiny ? 8 : isSmall ? 10 : 12
  const gap = isTiny ? 6 : isSmall ? 8 : 10
  const font = isTiny ? 12 : isSmall ? 12.8 : 13.5
  const btnH = isTiny ? 22 : isSmall ? 24 : 26
  const btnFont = isTiny ? 11 : isSmall ? 12 : 13
  const dotSize = isTiny ? 6 : 7
  const bottomOffset = isSmall ? 84 : 92

  const wrap = {
    position:'fixed', left: 12, bottom: bottomOffset, zIndex:45, maxWidth
  }
  const card = {
    display:'flex', alignItems:'flex-start', gap,
    background:'linear-gradient(180deg, rgba(11,39,74,0.55), rgba(11,39,74,0.40))',
    color:'#fff', padding:`${padY}px ${padX}px`, borderRadius:12,
    border:'1px solid rgba(255,255,255,0.28)',
    boxShadow:'0 14px 30px rgba(3,10,20,0.35)',
    backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
    animation:'tb-in .22s cubic-bezier(.16,1,.3,1)'
  }
  const text = { fontSize: font, lineHeight: 1.45, color:'#e5ecf6', margin:0 }
  const dot = { width:dotSize, height:dotSize, borderRadius:9999, background:'#FFB806', marginTop:6, boxShadow:'0 0 0 5px rgba(255,184,6,0.18)' }
  const actions = { display:'flex', gap:6, marginLeft:8 }
  const btn = { background:'transparent', border:'1px solid rgba(255,255,255,0.28)', color:'#fff', height:btnH, padding:'0 8px', borderRadius:6, cursor:'pointer', fontSize:btnFont }

  return (
    <div style={wrap}>
      <style>{`@keyframes tb-in{from{transform:translateY(6px);opacity:.4}to{transform:translateY(0);opacity:1}}`}</style>
      <div style={card} role="status" aria-live="polite">
        <span aria-hidden="true" style={dot}></span>
        <p style={text}>{tips[idx]}</p>
        <div style={actions}>
          <button type="button" style={btn} onClick={next} aria-label="Next tip">Next</button>
          <button type="button" style={btn} onClick={hide} aria-label="Dismiss tips">Close</button>
        </div>
      </div>
    </div>
  )
}
