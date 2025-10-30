import React, { useEffect, useState } from 'react'

export default function Rates(){
	const [rates,setRates] = useState({ USD_NGN: 1500, NGN_USD: 0.00067 })
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const EXCHANGE_API = import.meta.env.VITE_EXCHANGE_API

	const fetchRate = async (from, to) => {
		if(!EXCHANGE_API) throw new Error('Exchange endpoint not configured');
		const url = `${EXCHANGE_API}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
		const res = await fetch(url)
		if(!res.ok) throw new Error(`Failed to fetch ${from}_${to}`);
		const data = await res.json();
		return data.rate;
	}

	const fetchRates = async () => {
		try {
			setLoading(true);
			setError('');
			const [usdToNgn, ngnToUsd] = await Promise.all([
				fetchRate('USD','NGN'),
				fetchRate('NGN','USD'),
			]);
			setRates({ USD_NGN: usdToNgn, NGN_USD: ngnToUsd });
		} catch(e) {
			setError('Live exchange rates could not be fetched. Showing last known values.');
		} finally {
			setLoading(false);
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
				<div className="rates-card reveal" style={{ margin: '0 auto', maxWidth: 720 }}>
					<div className="rates-header" style={{justifyContent:'center', textAlign:'center', display:'flex', alignItems:'center' }}>
						<h3 className="rates-title" style={{ margin: 0, flex: 1, textAlign: 'center' }}>Live Exchange Rates</h3>
						<button className="rates-refresh" type="button" aria-label="Refresh rates" onClick={fetchRates}>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M17 10a7 7 0 1 1-2.05-4.95" stroke="#FFB806" strokeWidth="2" strokeLinecap="round"/>
								<path d="M17 3v4h-4" stroke="#FFB806" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
					<div className="rates-grid" style={{ justifyContent:'center', gap:48, display:'flex', textAlign:'center', marginTop: '16px' }}>
						<div className="rate-item">
							<div className="rate-value">{rates.USD_NGN ? `₦${rates.USD_NGN.toLocaleString()}` : '-'}</div>
							<div className="rate-label">1 USD</div>
						</div>
						<div className="rate-item">
							<div className="rate-value">{rates.NGN_USD ? `$${rates.NGN_USD.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}` : '-'}</div>
							<div className="rate-label">1 NGN</div>
						</div>
					</div>
					<div className="rates-note" style={{textAlign:'center', marginTop:'18px', fontWeight:400}}>
						{loading ? 'Fetching latest rates…' : error ? error : 'Rates updated every 30 seconds'}
					</div>
				</div>
			</div>
		</section>
	)
}