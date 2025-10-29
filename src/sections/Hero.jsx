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
									<circle cx="12" cy="17" r="1.5" fill="#FFB806"/>
									<path d="M9.6 7.5C9.6 6.119 10.719 5 12.1 5s2.5 1.119 2.5 2.5S13.481 10 12.1 10 9.6 11.119 9.6 12.5V13" stroke="#04396D" strokeWidth="1.6" strokeLinecap="round"/>
								</svg>
							</span>
							<span className="badge-text">100% Transparent Pricing</span>
						</div>
					</div>
					<div className="hero-right">
						<div className="hero-illustration">
						<img src="/assets/img.png" alt="Fees illustration" className="hero-img" onError={(e)=>{ e.currentTarget.src='/assets/hero-placeholder.svg' }} />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

