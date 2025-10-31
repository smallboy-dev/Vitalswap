import React, { useRef, useState, useEffect } from 'react'

export default function Referrals(){
	const copy = async (text)=>{
		if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
		const ta = document.createElement('textarea')
		ta.value=text; document.body.appendChild(ta); ta.select()
		try{ document.execCommand('copy') } finally { document.body.removeChild(ta) }
	}
	const Card = ({initials,name,handle,link}) => {
		const [label,setLabel] = useState('Copy Link & Earn')
		const onCopy = ()=>{
			copy(link).then(()=>{ setLabel('Copied!'); setTimeout(()=>setLabel('Copy Link & Earn'), 1200) })
		}
		return (
			<article className="ref-card">
				<div className="ref-header">
					<div className="ref-avatar" aria-hidden="true">{initials}</div>
					<div className="ref-meta">
						<p className="ref-name">{name}</p>
						<p className="ref-handle">{handle}</p>
					</div>
				</div>
				<p className="ref-link">{link.replace('https://','')}</p>
				<button className="ref-btn" type="button" onClick={onCopy}>{label}</button>
			</article>
		)
	}

	const items = [
		{ initials:'Jf', name:'Jephthah', handle:'@jeff', link:'https://vitalswap.com/ref/jeff' },
		{ initials:'KC', name:'Kelechi', handle:'@KayC', link:'https://vitalswap.com/ref/KayC' },
		{ initials:'OL', name:'Otunloba', handle:'@Otunloba', link:'https://vitalswap.com/ref/Otunloba' },
		{ initials:'TC', name:'Tochukwu', handle:'@Tochukwu', link:'https://vitalswap.com/ref/Tochukwu' },
		{ initials:'OL', name:'Otunloba', handle:'@Otunloba', link:'https://vitalswap.com/ref/Otunloba' }
	]

	const [index,setIndex] = useState(0)
	const [paused,setPaused] = useState(false)
	const wrapRef = useRef(null)
	const touchRef = useRef({ x:0, y:0, active:false })
	const timerRef = useRef(null)

	const prev = ()=> setIndex(i=> (i-1+items.length)%items.length)
	const next = ()=> setIndex(i=> (i+1)%items.length)

	useEffect(()=>{
		const el = wrapRef.current
		if(!el) return
		const onTouchStart = (e)=>{
			const t = e.touches?.[0]; if(!t) return
			touchRef.current = { x:t.clientX, y:t.clientY, active:true }
		}
		const onTouchMove = (e)=>{
			if(!touchRef.current.active) return
			const t = e.touches?.[0]; if(!t) return
			const dx = t.clientX - touchRef.current.x
			if(Math.abs(dx) > 40){
				if(dx < 0) next(); else prev();
				touchRef.current.active = false
			}
		}
		const onTouchEnd = ()=>{ touchRef.current.active = false }
		const onEnter = ()=> setPaused(true)
		const onLeave = ()=> setPaused(false)
		el.addEventListener('touchstart', onTouchStart, { passive:true })
		el.addEventListener('touchmove', onTouchMove, { passive:true })
		el.addEventListener('touchend', onTouchEnd)
		el.addEventListener('mouseenter', onEnter)
		el.addEventListener('mouseleave', onLeave)
		return ()=>{
			el.removeEventListener('touchstart', onTouchStart)
			el.removeEventListener('touchmove', onTouchMove)
			el.removeEventListener('touchend', onTouchEnd)
			el.removeEventListener('mouseenter', onEnter)
			el.removeEventListener('mouseleave', onLeave)
		}
	},[])

	useEffect(()=>{
		if(timerRef.current) clearInterval(timerRef.current)
		if(!paused){
			timerRef.current = setInterval(()=> next(), 6500)
		}
		return ()=>{ if(timerRef.current) clearInterval(timerRef.current) }
	},[paused])

	return (
		<section className="referrals">
			<style>{`
				.ref-carousel { position: relative; overflow: hidden; }
				.ref-track { display: flex; transition: transform .7s cubic-bezier(.16,1,.3,1); will-change: transform; }
				.ref-slide { flex: 0 0 100%; padding: 8px; box-sizing: border-box; }
				.ref-slide > .reveal, .ref-slide > div { max-width: 560px; margin: 0 auto; }
				@media (min-width: 720px){ .ref-slide { padding: 12px } }
				/* Card */
				.ref-card { max-width: 560px; margin: 0 auto; border-radius: 14px; text-align:center; padding: 16px 18px; box-shadow: 0 10px 26px rgba(2,10,30,0.25); }
				.ref-header { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; margin-bottom: 8px }
				.ref-avatar { width:56px; height:56px; border-radius:9999; display:flex; align-items:center; justify-content:center; font-weight:800; background:#cfe5ff; color:#04396D; }
				.ref-meta { text-align:center }
				.ref-name { margin: 0; font-weight:800; font-size: 18px }
				.ref-handle { margin: 2px 0 0 0; opacity:.8; font-size: 13.5px }
				.ref-link { margin: 10px auto 12px auto; padding: 8px 12px; border-radius: 10px; background: rgba(4,57,109,0.12); color:#cfe5ff; width: fit-content; max-width: 100%; }
				.ref-card .ref-btn { height: 42px; font-weight: 700; }
				.referrals-container { max-width: 1000px; margin: 0 auto; }
				/* Controls */
				.ref-controls { display:flex; justify-content:center; align-items:center; gap:10px; margin-top:16px }
				.ref-dot{ width:8px; height:8px; border-radius:9999; background:#d1d5db; transition: transform .25s }
				.ref-dot.active{ background:#FFB806; box-shadow:0 0 0 5px rgba(255,184,6,0.18); transform: scale(1.15) }
				.ref-nav{ width:34px; height:34px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; color:#04396D; display:inline-flex; align-items:center; justify-content:center; cursor:pointer }
				.ref-nav:disabled{ opacity:.45; cursor:not-allowed }
			`}</style>
			<div className="referrals-container">
				<header className="referrals-header reveal" style={{textAlign:'center', maxWidth:700, margin:'0 auto'}}>
					<h2 className="referrals-title">SwapTag Referrals</h2>
					<p className="referrals-subtitle">Invite friends and earn rewards with every successful swap</p>
				</header>
				<div className="ref-carousel" ref={wrapRef}>
					<div className="ref-track" style={{ transform:`translateX(-${index*100}%)` }}>
						{items.map((it, i)=> (
							<div className="ref-slide" key={i}>
								<div className="reveal"><Card initials={it.initials} name={it.name} handle={it.handle} link={it.link} /></div>
							</div>
						))}
					</div>
				</div>
				<div className="ref-controls">
					<button type="button" className="ref-nav" aria-label="Previous" onClick={prev}>‹</button>
					{items.map((_,i)=> (<span key={i} className={`ref-dot${i===index?' active':''}`} />))}
					<button type="button" className="ref-nav" aria-label="Next" onClick={next}>›</button>
				</div>
			</div>
		</section>
	)
}

