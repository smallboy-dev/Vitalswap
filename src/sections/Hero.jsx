import React from 'react'

export default function Hero(){
	return (
		<section className="hero">
			<div className="hero-container">
				<div className="hero-inner">
					<div className="hero-left">
						<h1 className="hero-title">Transparent Fees. Total Confidence.</h1>
						<p className="hero-subtitle">At VitalSwap, we believe in complete transparency. Know exactly what you're paying for every swap with our clear, upfront fee structure. No hidden charges, no surprises.</p>
						<div className="hero-badge">
							<span className="badge-icon" aria-hidden="true">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="12" cy="12" r="11.5" fill="#FFB806"/>
									<path d="M9 12l2 2 4-4" stroke="#04396D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</span>
							<span className="badge-text">100% Transparent Pricing</span>
						</div>
					</div>
					<div className="hero-right">
						<div className="hero-illustration">
						<img src="/assets/wo.jpg" alt="Fees illustration" className="hero-img" onError={(e)=>{ e.currentTarget.src='/assets/hero-placeholder.svg' }} />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

