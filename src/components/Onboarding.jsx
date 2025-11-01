import React, { useCallback, useEffect, useMemo, useState } from 'react'

export default function Onboarding(){
  const brand = { blue:'#04396D', yellow:'#FFB806', dark:'#0b274a' }
  const [open,setOpen] = useState(false)
  const [step,setStep] = useState(0)
  const [anchorRect,setAnchorRect] = useState(null)

  const steps = useMemo(()=>[
    { title: 'Welcome to VitalSwap', body: 'Quick tour: view live rates, transparent fees, and get help via the floating assistant. You can dismiss anytime.', selector: null },
    { title: 'Floating Assistant', body: 'Tap the assistant to ask for live rates, Customer or Business fees, or referrals. It can speak and reply in local languages.', selector: '.fa-btn' },
    { title: 'Live Exchange Rates', body: 'This card updates automatically. The bell in the header lights up when rates change. Click it to jump here.', selector: '#live-rates .rates-card' },
    { title: 'Fees & Calculator', body: 'Scroll to see fees (Customer/Business) and try the calculator for real-time conversions and estimated charges.', selector: '#fees' },
    { title: 'Theme & Navigation', body: 'Use the header toggle for Dark/Light mode. Explore sections using the top navigation and smooth scrolling.', selector: '.theme-toggle' }
  ],[])

  const close = useCallback(()=>{ 
    try{ localStorage.setItem('onboarding_done','1') }catch(_e){}
    setOpen(false) 
  },[])
  
  const next = useCallback(()=>{ 
    setStep(s => { 
      if(s < steps.length-1) return s+1
      else { 
        setTimeout(()=>{ 
          try{ localStorage.setItem('onboarding_done','1') }catch(_e){} 
          setOpen(false) 
        }, 0)
        return s
      }
    })
  },[steps.length])
  
  const back = useCallback(()=>{ 
    setStep(s => s > 0 ? s-1 : s) 
  },[])

  useEffect(()=>{
    try{
      const done = localStorage.getItem('onboarding_done')
      if(!done){ setOpen(true) }
    }catch(_e){}
  },[])

  useEffect(()=>{
    if(!open) return
    const onKey = (e)=>{
      if(e.key==='Escape'){ close() }
      if(e.key==='Enter'){ next() }
      if(e.key==='ArrowRight'){ next() }
      if(e.key==='ArrowLeft'){ back() }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[open, close, next, back])

  const selectEl = (sel)=>{
    if(!sel) return null
    try{ return document.querySelector(sel) }catch(_e){ return null }
  }

  const updateAnchor = (sel)=>{
    const el = selectEl(sel)
    if(!el){ setAnchorRect(null); return }
    setAnchorRect(el.getBoundingClientRect())
  }

  const scrollToSelector = (sel)=>{
    if(!sel) return
    const el = selectEl(sel)
    if(el){ el.scrollIntoView({ behavior:'smooth', block:'center' }) }
    let tries = 0
    const id = setInterval(()=>{
      updateAnchor(sel)
      tries++
      if(tries>6) clearInterval(id)
    }, 120)
  }

  useEffect(()=>{
    const sel = steps[step]?.selector
    updateAnchor(sel)
    if(sel){ setTimeout(()=> scrollToSelector(sel), 80) }
    const onWin = ()=> updateAnchor(sel)
    window.addEventListener('scroll', onWin, { passive:true })
    window.addEventListener('resize', onWin)
    return ()=>{ window.removeEventListener('scroll', onWin); window.removeEventListener('resize', onWin) }
  },[step, steps])

  if(!open) return null

  const current = steps[step]

  const vw = typeof window!=='undefined' ? window.innerWidth : 1024
  const vh = typeof window!=='undefined' ? window.innerHeight : 768
  const isSmall = vw < 420
  const cardW = Math.min(360, vw - 24)

  // compute explicit positions for box and arrow when anchored
  const boxLeft = anchorRect ? Math.min(Math.max(anchorRect.left, 12), vw - (cardW + 12)) : undefined
  const preferredTop = anchorRect ? Math.min(anchorRect.bottom + 12, vh - 200) : undefined
  const boxTop = isSmall ? (preferredTop ?? 12) : preferredTop

  // Overlay without blur (page stays crisp)
  const overlay = { position:'fixed', inset:0, background:'rgba(5,17,32,0.30)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', animation:'ob-fade .28s ease-out' }
  // Card with glassmorphism (responsive)
  const box = {
    position: anchorRect? 'fixed':'relative',
    left: anchorRect ? boxLeft : undefined,
    top: anchorRect ? boxTop : undefined,
    width: cardW, borderRadius:14,
    background:'linear-gradient(180deg, rgba(11,39,74,0.55), rgba(11,39,74,0.40))',
    color:'#fff',
    border:'1px solid rgba(255,255,255,0.28)',
    boxShadow:'0 18px 42px rgba(3,10,20,0.45)', padding:16,
    animation:'ob-zoom .26s cubic-bezier(.16,1,.3,1)',
    backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
    maxHeight: Math.min(360, vh - 40),
    overflow:'auto'
  }
  const titleStyle = { margin:'0 0 8px 0', fontWeight:900, fontSize: isSmall? 15:16, color:'#fff' }
  const bodyStyle = { margin:'0 0 12px 0', fontSize: isSmall? 13:14, color:'#e2e8f0', lineHeight:1.6, cursor:'pointer' }
  const row = { display:'flex', gap:8, justifyContent:'space-between', alignItems:'center' }
  const btn = { height:36, padding:'0 12px', borderRadius:8, border:`1px solid ${brand.yellow}66`, background:'rgba(4,57,109,0.75)', color:'#fff', cursor:'pointer', backdropFilter:'blur(2px)', fontSize: isSmall? 13:14 }
  const btnLight = { ...btn, background:'rgba(255,255,255,0.88)', color:brand.blue, border:'none' }

  // arrow pointing up from the card to the target (hide on very small screens)
  const arrow = (!isSmall) && anchorRect && boxLeft!=null && boxTop!=null ? {
    position:'fixed',
    left: Math.min(Math.max(anchorRect.left + anchorRect.width/2 - 8, boxLeft+12), boxLeft + cardW - 20),
    top: boxTop - 8,
    width:0, height:0,
    borderLeft:'8px solid transparent',
    borderRight:'8px solid transparent',
    borderBottom:'8px solid rgba(11,39,74,0.55)',
    filter:'drop-shadow(0 -1px 0 rgba(0,0,0,0.2))'
  } : null

  return (
    <div style={overlay}>
      <style>{`
        @keyframes ob-fade { from{opacity:0} to{opacity:1} }
        @keyframes ob-zoom { from{transform:scale(.96); opacity:.4} to{transform:scale(1); opacity:1} }
      `}</style>
      {arrow && <div style={arrow} />}
      <div style={box}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6}}>
          <h4 style={titleStyle}>{current.title}</h4>
          <button type="button" aria-label="Close" onClick={close} style={{...btn, background:'transparent', border:'1px solid rgba(255,255,255,0.35)', color:'#fff'}}>×</button>
        </div>
        <p style={bodyStyle} onClick={()=> current.selector && scrollToSelector(current.selector)}>{current.body}</p>
        <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:10}}>
          {steps.map((_,i)=> (
            <span key={i} style={{width:8,height:8,borderRadius:9999, background: i===step? brand.yellow:'#ffffff55'}} />
          ))}
        </div>
        <div style={row}>
          <button type="button" onClick={back} disabled={step===0} style={{...btn, opacity: step===0?0.5:1}}>Back</button>
          <div style={{display:'flex',gap:8}}>
            <button type="button" onClick={close} style={btn}>Skip</button>
            <button type="button" onClick={()=>{ next(); const sel = steps[step+1]?.selector; if(sel) setTimeout(()=> scrollToSelector(sel), 120) }} style={btnLight}>{step===steps.length-1? 'Done':'Next'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
