import React from 'react'

export default function Fees(){
	return (
		<section id="fees" className="fees">
			<div className="fees-container">
				<header className="fees-header reveal">
					<h2 className="fees-title">Fee Breakdown</h2>
					<p className="fees-subtitle">Understanding every charge in your currency swap</p>
				</header>
				<div className="fees-grid">
					<article className="fee-card fee-card--primary reveal">
						<header className="fee-card-header">
							<span className="fee-card-icon" aria-hidden="true">
								<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="15" cy="15" r="12" fill="#FFB806"/>
									<path d="M10 12h8l-2.5-2.5" stroke="#04396D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									<path d="M20 18h-8l2.5 2.5" stroke="#04396D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</span>
							<span className="fee-chip fee-chip--amber">0.5%</span>
						</header>
						<h3 className="fee-card-title fee-card-title--light">Swap Fee</h3>
						<p className="fee-card-desc fee-card-desc--light">Low competitive rate for currency<br/>conversion</p>
						<ul className="fee-list">
							<li className="fee-list-item fee-list-item--light">Transparent pricing</li>
							<li className="fee-list-item fee-list-item--light">No hidden charges</li>
							<li className="fee-list-item fee-list-item--light">Volume discounts available</li>
							<li className="fee-list-item fee-list-item--light">No hidden charges</li>
						</ul>
					</article>

					<article className="fee-card reveal">
						<header className="fee-card-header">
							<span className="fee-card-icon" aria-hidden="true">
								<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M4 15h22" stroke="#04396D" strokeWidth="2" strokeLinecap="round"/>
									<path d="M8 10h14" stroke="#04396D" strokeWidth="2" strokeLinecap="round"/>
									<path d="M10 20h10" stroke="#04396D" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</span>
							<span className="fee-chip fee-chip--blue">Live</span>
						</header>
						<h3 className="fee-card-title">FX Rate</h3>
						<p className="fee-card-desc">Real-time market rates with minimal<br/>markup</p>
						<ul className="fee-list">
							<li className="fee-list-item">Mid-market rates</li>
							<li className="fee-list-item">Real-time updates</li>
							<li className="fee-list-item">Best available rates</li>
						</ul>
					</article>

					<article className="fee-card reveal">
						<header className="fee-card-header">
							<span className="fee-card-icon" aria-hidden="true">
								<svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M3 15h28" stroke="#04396D" strokeWidth="2" strokeLinecap="round"/>
									<path d="M3 9h20" stroke="#04396D" strokeWidth="2" strokeLinecap="round"/>
									<path d="M11 21h20" stroke="#04396D" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</span>
							<span className="fee-chip fee-chip--amber">$2</span>
						</header>
						<h3 className="fee-card-title">Processing Fee</h3>
						<p className="fee-card-desc">Fixed fee for secure transaction<br/>processing</p>
						<ul className="fee-list">
							<li className="fee-list-item">Secure processing</li>
							<li className="fee-list-item">Bank-grade security</li>
							<li className="fee-list-item">Fast settlements</li>
						</ul>
					</article>
				</div>
			</div>
		</section>
	)
}

