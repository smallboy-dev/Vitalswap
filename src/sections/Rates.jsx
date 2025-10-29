import React, { useEffect, useState } from 'react'

export default function Rates(){
	const [rates,setRates] = useState({ USD_NGN:1500, EUR_NGN:1650, GBP_NGN:1850 })

	const fetchRate = async (from,to)=>{
		const endpoint = '' /*Api*/
		const url = `${endpoint}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
		const res = await fetch(url)
		if(!res.ok) throw new Error(`Failed to fetch ${from}_${to}`)
		const data = await res.json()
		return data.rate
	}

	const fetchRates = async ()=>{
		try{
			const [usdNgn, eurNgn, gbpNgn] = await Promise.all([
				fetchRate('USD','NGN'),
				fetchRate('EUR','NGN'),
				fetchRate('GBP','NGN')
			])
			setRates({ USD_NGN: usdNgn, EUR_NGN: eurNgn, GBP_NGN: gbpNgn })
		}catch(e){
			// keep previous rates on error
		}
	}

	useEffect(()=>{
		fetchRates()
		const id = setInterval(fetchRates, 30000)
		return ()=> clearInterval(id)
	},[])
	return (
		<section className="rates">
			<div className="rates-container">
				<div className="rates-card reveal">
					<div className="rates-header">
						<h3 className="rates-title">Live Exchange Rates</h3>
					<button className="rates-refresh" type="button" aria-label="Refresh rates" onClick={fetchRates}>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M17 10a7 7 0 1 1-2.05-4.95" stroke="#FFB806" strokeWidth="2" strokeLinecap="round"/>
								<path d="M17 3v4h-4" stroke="#FFB806" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
					<div className="rates-grid">
						<div className="rate-item"><div className="rate-value">{`₦${rates.USD_NGN.toLocaleString()}`}</div><div className="rate-label">1 USD</div></div>
						<div className="rate-item"><div className="rate-value">{`₦${rates.EUR_NGN.toLocaleString()}`}</div><div className="rate-label">1 EUR</div></div>
						<div className="rate-item"><div className="rate-value">{`₦${rates.GBP_NGN.toLocaleString()}`}</div><div className="rate-label">1 GBP</div></div>
					</div>
					<div className="rates-note">Rates updated every 30 seconds</div>
				</div>
			</div>
		</section>
	)
}

