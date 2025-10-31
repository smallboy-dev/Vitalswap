import React, { useEffect, useState, useRef } from 'react'

export default function Rates(){
	const [rates,setRates] = useState({ USD_NGN:1500, NGN_USD:0.00067 })
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [updated, setUpdated] = useState(false)
	const clearTimer = useRef(null)

	const EXCHANGE_API = import.meta.env.VITE_EXCHANGE_API

	const fetchRate = async (from,to)=>{
		if(!EXCHANGE_API) throw new Error('Exchange endpoint not configured');
		const url = `${EXCHANGE_API}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
		const res = await fetch(url)
		if(!res.ok) throw new Error(`Failed to fetch ${from}_${to}`);
		const data = await res.json();
		return data.rate
	}

	const markUpdated = ()=>{
		setUpdated(true)
		try{ window.dispatchEvent(new CustomEvent('rates-updated')) }catch(_e){}
		if(clearTimer.current) clearTimeout(clearTimer.current)
		clearTimer.current = setTimeout(()=> setUpdated(false), 5000)
	}

	const fetchRates = async ()=>{
		try{
			setLoading(true)
			setError('')
			const [usdToNgn, ngnToUsd] = await Promise.all([
				fetchRate('USD','NGN'),
				fetchRate('NGN','USD'),
			])
			setRates(prev=>{
				if(prev.USD_NGN !== usdToNgn || prev.NGN_USD !== ngnToUsd){
					markUpdated()
				}
				return { USD_NGN: usdToNgn, NGN_USD: ngnToUsd }
			})
		}catch(e){
			setError('Live exchange rates could not be fetched. Showing last known values.');
		}finally{
			setLoading(false)
		}
	}

	useEffect(()=>{
		fetchRates()
		const id = setInterval(fetchRates, 30000)
		return ()=> { clearInterval(id); if(clearTimer.current) clearTimeout(clearTimer.current) }
	},[])
	return (
		<section id="live-rates" className="rates">
			<div className="rates-container">
				<div className="rates-card reveal">
					<div className="rates-header" style={{position:'relative'}}>
						<h3 className="rates-title" style={{display:'flex',alignItems:'center',gap:8,margin:0}}>
							Live Exchange Rates
							{updated && (
								<span style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,184,6,0.15)',color:'#FFB806',border:'1px solid rgba(255,184,6,0.5)',borderRadius:9999,padding:'2px 8px',fontSize:12,transition:'opacity .4s ease'}}>
									<span style={{width:8,height:8,borderRadius:9999,background:'#FFB806',boxShadow:'0 0 0 6px rgba(255,184,6,0.15)'}}></span>
									Updated
								</span>
							)}
						</h3>
						<button className="rates-refresh" type="button" aria-label="Refresh rates" onClick={fetchRates}>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M17 10a7 7 0 1 1-2.05-4.95" stroke="#FFB806" strokeWidth="2" strokeLinecap="round"/>
								<path d="M17 3v4h-4" stroke="#FFB806" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
					<div className="rates-grid">
						<div className="rate-item"><div className="rate-value">{rates.USD_NGN ? `₦${rates.USD_NGN.toLocaleString()}` : '-'}</div><div className="rate-label">1 USD</div></div>
						<div className="rate-item"><div className="rate-value">{rates.NGN_USD ? `$${rates.NGN_USD.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}` : '-'}</div><div className="rate-label">1 NGN</div></div>
					</div>
					<div className="rates-note">
						{loading ? 'Fetching latest rates…' : error ? error : 'Rates updated every 30 seconds'}
					</div>
				</div>
			</div>
		</section>
	)
}
