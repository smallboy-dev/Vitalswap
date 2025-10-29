import React, { useEffect, useState } from 'react'

export default function Footer(){
    const [isDark,setIsDark] = useState(()=>{
        if(typeof document!== 'undefined'){
            const t = document.documentElement.getAttribute('data-theme')
            return t === 'dark'
        }
        return false
    })

    useEffect(()=>{
        const el = document.documentElement
        const obs = new MutationObserver(()=>{
            setIsDark(el.getAttribute('data-theme') === 'dark')
        })
        obs.observe(el,{ attributes:true, attributeFilter:['data-theme'] })
        return ()=> obs.disconnect()
    },[])
	return (
		<footer className="site-footer">
			<div className="footer-container">
				<div className="footer-top">
					<div>
						<img
							className="footer-brand-logo"
							src="/assets/logo-dark.png"
							alt="VitalSwap"
							onError={(e)=>{ e.currentTarget.src = '/assets/logo-placeholder.svg' }}
						/>
						<p className="footer-desc">Transparent currency swaps with competitive rates and zero hidden fees.</p>
					</div>
					<div>
						<h4 className="footer-col-title">Company</h4>
						<ul className="footer-links">
							<li><a className="footer-link" href="#">About</a></li>
							<li><a className="footer-link" href="#">How It Works</a></li>
							<li><a className="footer-link" href="#fees">Fees</a></li>
							<li><a className="footer-link" href="#contact">Contact</a></li>
						</ul>
					</div>
					<div>
						<h4 className="footer-col-title">Legal</h4>
						<ul className="footer-links">
							<li><a className="footer-link" href="#">Terms of Service</a></li>
							<li><a className="footer-link" href="#">Privacy Policy</a></li>
							<li><a className="footer-link" href="#">Cookie Policy</a></li>
						</ul>
					</div>
					<div>
						<h4 className="footer-col-title">Follow Us</h4>
						<div className="social-row">
							<a className="social-btn" aria-label="Twitter" href="#">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.9-2.6 1.1A4 4 0 0 0 12 8.8c0 .3 0 .6.1.9-3.3-.2-6.3-1.8-8.3-4.3-.4.7-.6 1.3-.6 2.1 0 1.4.7 2.6 1.8 3.4-.6 0-1.2-.2-1.7-.5 0 2 1.4 3.6 3.2 4-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.6 2.1 2.8 3.9 2.8A8 8 0 0 1 2 19.6 11.3 11.3 0 0 0 8.1 21c7.3 0 11.3-6.1 11.3-11.3v-.5c.8-.6 1.4-1.3 1.9-2.1z" fill="#FFB806"/>
								</svg>
							</a>
							<a className="social-btn" aria-label="LinkedIn" href="#">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8.5h4.9V24H.5V8.5zM9 8.5h4.7v2.1h.1c.7-1.3 2.5-2.7 5.1-2.7 5.4 0 6.4 3.6 6.4 8.3V24h-4.9v-7.3c0-1.7 0-3.8-2.3-3.8-2.4 0-2.7 1.9-2.7 3.7V24H9V8.5z" fill="#FFB806"/>
								</svg>
							</a>
						</div>
					</div>
				</div>
				<div className="footer-bottom">© 2025 VitalSwap. All rights reserved.</div>
			</div>
		</footer>
	)
}
