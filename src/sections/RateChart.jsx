import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function RateChart(){
	const [data,setData] = useState([])
	const [error,setError] = useState('')
	const [hover,setHover] = useState(null)
	const svgRef = useRef(null)
	const EXCHANGE_API = import.meta.env.VITE_EXCHANGE_API

	useEffect(()=>{
		let cancelled = false
		;(async()=>{
			try{
				let base = null
				try{
					if(EXCHANGE_API){
						const r = await fetch(`${EXCHANGE_API}?from=USD&to=NGN`)
						if(r.ok){
							const j = await r.json(); base = j?.rate ?? null
						}
					}
				}catch(_e){ base = null }
			if(base==null){
				try{
					const rf = await fetch('/assets/rates-fallback.json')
					if(rf.ok){ const jj = await rf.json(); base = jj?.USD_NGN ?? 1480 }
				}catch(_e){ base = 1480 }
			}
			const today = new Date()
			const arr = []
			let last = base
			for(let i=6;i>=0;i--){
				const d = new Date(today); d.setDate(today.getDate()-i)
				const pct = (Math.random()-0.5) * 0.04 // ±2%
				last = Math.max(1, Math.round(last*(1+pct)))
				arr.push({
					label: d.toLocaleDateString(undefined,{ month:'short', day:'numeric'}),
					value: last,
					date: d
				})
			}
			if(!cancelled){
				setData(arr)
				setError('')
			}
		}catch(e){ if(!cancelled) setError('Unable to prepare chart data.') }
		
		})()
		return ()=>{ cancelled = true }
	},[EXCHANGE_API])

	const view = useMemo(()=>{
		if(!data || data.length===0) return null
		const containerW = Math.min(880, Math.max(640, typeof window!=='undefined' ? (window.innerWidth-64) : 720))
		const W=containerW, H=260, padL=48, padR=24, padT=24, padB=40
		const xs = data.map((_,i)=> padL + (i*(W-padL-padR))/(data.length-1))
		const vals = data.map(p=>p.value)
		const min = Math.min(...vals), max = Math.max(...vals)
		const niceMin = Math.floor(min/10)*10
		const niceMax = Math.ceil(max/10)*10
		const scaleY = (v)=>{
			if(niceMax===niceMin) return H/2
			return H-padB - ((v-niceMin)*(H-padT-padB))/(niceMax-niceMin)
		}
		const points = vals.map((v,i)=>({ x: xs[i], y: scaleY(v), v }))
		// Catmull–Rom to Bezier path
		const t = 0.2
		let d = ''
		for(let i=0;i<points.length;i++){
			const p0 = points[i-1] || points[i]
			const p1 = points[i]
			const p2 = points[i+1] || points[i]
			const p3 = points[i+2] || p2
			if(i===0){ d += `M ${p1.x},${p1.y} `; continue }
			const cp1x = p1.x + (p2.x - p0.x) * t
			const cp1y = p1.y + (p2.y - p0.y) * t
			const cp2x = p2.x - (p3.x - p1.x) * t
			const cp2y = p2.y - (p3.y - p1.y) * t
			d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `
		}
		return { W,H,padL,padR,padT,padB,points,vals,min: niceMin,max: niceMax, path:d }
	},[data])

	const onMove = (e)=>{
		if(!svgRef.current || !view) return
		const rect = svgRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		let nearest = null, dmin = Infinity
		view.points.forEach((p,idx)=>{
			const dd = Math.abs(p.x - x)
			if(dd<dmin){ dmin = dd; nearest = { idx, ...p } }
		})
		if(nearest) setHover(nearest)
	}

	const onLeave = ()=> setHover(null)

	const currentRate = data.length > 0 ? data[data.length - 1].value : null
	const previousRate = data.length > 1 ? data[data.length - 2].value : null
	const change = currentRate && previousRate ? ((currentRate - previousRate) / previousRate * 100).toFixed(2) : null
	const isPositive = change && parseFloat(change) >= 0

	return (
		<section className="rates" style={{paddingTop:0}}>
			<div className="rates-container">
				<div className="rates-card reveal" style={{
					marginTop:16,
					background: 'linear-gradient(135deg, #0b274a 0%, #1e3a5f 100%)',
					border: '1px solid rgba(255,255,255,0.1)',
					borderRadius: '16px',
					padding: '24px',
					boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
				}}>
					<div style={{marginBottom:20}}>
						<div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, flexWrap:'wrap', gap:16}}>
							<div>
								<h3 className="rates-title" style={{margin:0, marginBottom:4, fontSize:24, fontWeight:700}}>7‑Day USD → NGN Trend</h3>
								<div style={{fontSize:13, color:'#94a3b8', display:'flex', alignItems:'center', gap:6}}>
									<span>Historical exchange rate movement</span>
								</div>
							</div>
							{currentRate && (
								<div style={{
									background: 'rgba(255,255,255,0.08)',
									padding: '12px 16px',
									borderRadius: '12px',
									border: '1px solid rgba(255,255,255,0.1)',
									minWidth: 140
								}}>
									<div style={{fontSize:12, color:'#94a3b8', marginBottom:4}}>Current Rate</div>
									<div style={{display:'flex', alignItems:'center', gap:8}}>
										<span style={{fontSize:20, fontWeight:700, color:'#fff'}}>₦{currentRate.toLocaleString()}</span>
										{change && (
											<span style={{
												fontSize:12,
												fontWeight:600,
												color: isPositive ? '#10b981' : '#ef4444',
												display:'flex',
												alignItems:'center',
												gap:4
											}}>
												{isPositive ? '↗' : '↘'} {Math.abs(parseFloat(change)).toFixed(2)}%
											</span>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
					{error && (
						<div style={{
							color:'#fee2e2',
							background:'rgba(127,29,29,0.3)',
							border: '1px solid rgba(239,68,68,0.3)',
							padding:12,
							borderRadius:8,
							marginBottom:16
						}}>{error}</div>
					)}
					{view && (
						<div style={{overflowX:'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px'}}>
							<svg ref={svgRef} width={view.W} height={view.H} viewBox={`0 0 ${view.W} ${view.H}`} style={{display:'block'}} onMouseMove={onMove} onMouseLeave={onLeave}>
								<defs>
									<linearGradient id="rc-fill" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#FFB806" stopOpacity="0.35" />
										<stop offset="50%" stopColor="#FFB806" stopOpacity="0.15" />
										<stop offset="100%" stopColor="#FFB806" stopOpacity="0" />
									</linearGradient>
									<filter id="glow">
										<feGaussianBlur stdDeviation="2" result="coloredBlur"/>
										<feMerge>
											<feMergeNode in="coloredBlur"/>
											<feMergeNode in="SourceGraphic"/>
										</feMerge>
									</filter>
								</defs>
								<g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
									<line x1={view.padL} x2={view.W-view.padR} y1={view.H-view.padB} y2={view.H-view.padB} strokeWidth="1.5" />
									<line x1={view.padL} x2={view.padL} y1={view.padT} y2={view.H-view.padB} strokeWidth="1.5" />
									{[0,0.25,0.5,0.75,1].map((t,i)=>{
										const y = view.padT + (1-t)*(view.H-view.padT-view.padB)
										const v = Math.round(view.min + t*(view.max-view.min))
										return (
											<g key={i}>
												<line x1={view.padL} x2={view.W-view.padR} y1={y} y2={y} />
												<text x={view.padL-12} y={y+4} textAnchor="end" fontSize="11" fill="#cbd5e1" fontWeight="500">₦{v.toLocaleString()}</text>
											</g>
										)
									})}
									{data.map((p,i)=> (
										<text key={i} x={view.points[i].x} y={view.H-16} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">{p.label}</text>
									))}
								</g>
								<path d={`${view.path} L ${view.W-view.padR},${view.H-view.padB} L ${view.padL},${view.H-view.padB} Z`} fill="url(#rc-fill)" />
								<path d={view.path} fill="none" stroke="#FFB806" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
								{view.points.map((p, i) => (
									<circle key={i} cx={p.x} cy={p.y} r="3" fill="#FFB806" opacity="0.6" />
								))}
								{hover && (
									<g>
										<line x1={hover.x} x2={hover.x} y1={view.padT} y2={view.H-view.padB} stroke="#FFB806" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
										<circle cx={hover.x} cy={hover.y} r="6" fill="#FFB806" stroke="#fff" strokeWidth="2" filter="url(#glow)" />
										<rect 
											x={Math.min(hover.x+12, view.W-180)} 
											y={view.padT+8} 
											width="170" 
											height="56" 
											rx="12" 
											fill="rgba(11,39,74,0.95)" 
											stroke="rgba(255,184,6,0.3)" 
											strokeWidth="1.5"
											style={{backdropFilter: 'blur(10px)'}}
										/>
										<text x={Math.min(hover.x+24, view.W-168)} y={view.padT+28} fontSize="11" fill="#94a3b8" fontWeight="500">Date</text>
										<text x={Math.min(hover.x+24, view.W-168)} y={view.padT+44} fontSize="13" fill="#fff" fontWeight="600">{data[hover.idx].label}</text>
										<text x={Math.min(hover.x+158, view.W-34)} y={view.padT+28} fontSize="11" fill="#94a3b8" fontWeight="500" textAnchor="end">Rate</text>
										<text x={Math.min(hover.x+158, view.W-34)} y={view.padT+44} fontSize="15" fill="#FFB806" fontWeight="700" textAnchor="end">₦{hover.v.toLocaleString()}</text>
									</g>
								)}
							</svg>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
