import React, { useEffect, useState } from 'react'
import { useRef } from 'react'

export default function Header(){
    const [isDark,setIsDark] = useState(()=>{
        if(typeof document!== 'undefined'){
            const t = document.documentElement.getAttribute('data-theme')
            return t === 'dark'
        }
        return false
    })

    const [headerHide, setHeaderHide] = useState(false)
    const lastScrollY = useRef(window.scrollY)
    const [notif, setNotif] = useState(0)

    useEffect(()=>{
        const el = document.documentElement
        const obs = new MutationObserver(()=>{
            setIsDark(el.getAttribute('data-theme') === 'dark')
        })
        obs.observe(el,{ attributes:true, attributeFilter:['data-theme'] })
        const onUpdated = ()=> setNotif(1)
        window.addEventListener('rates-updated', onUpdated)
        return ()=> { obs.disconnect(); window.removeEventListener('rates-updated', onUpdated) }
    },[])
	const [mobileOpen,setMobileOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
        let ticking = false
        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const curr = window.scrollY
                    setScrolled(curr > 10)
                    const goingDown = curr > lastScrollY.current
                    if(curr < 60) setHeaderHide(false)
                    else if(goingDown && curr > 64) setHeaderHide(true)
                    else if(curr < lastScrollY.current) setHeaderHide(false)
                    lastScrollY.current = curr
                    ticking = false
                })
                ticking = true
            }
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

    const onBell = ()=>{
        try{
            const el = document.getElementById('live-rates')
            if(el){ el.scrollIntoView({ behavior:'smooth', block:'start' }) }
            setNotif(0)
        }catch(_e){}
    }

	return (
		<>
        <style>{`
            .site-header.header-hide {
                transform: translateY(-82px);
                opacity: 0;
                box-shadow: none !important;
                pointer-events: none;
                transition: transform .38s cubic-bezier(.17,.88,.36,1.21), opacity .42s ease, box-shadow .2s;
            }
            .site-header {
                transition: transform .38s cubic-bezier(.17,.88,.36,1.21), opacity .42s, box-shadow .18s;
            }
        `}</style>
		<header className={`site-header${scrolled?' scrolled':''}${headerHide?' header-hide':''}`}>
			<div className="container">
				<div className="left">
					<a href="/" aria-label="Home">
						<img
							className="logo"
							src={isDark ? '/assets/logo-dark.png' : '/assets/logo.png'}
							alt="Logo"
							onError={(e)=>{
								if(isDark){
									e.currentTarget.src = '/assets/logo.png'
									e.currentTarget.classList.add('logo--invert')
								}else{
									e.currentTarget.src='/assets/logo-placeholder.svg'
								}
							}}
						/>
					</a>
				</div>
				<nav className="primary" aria-label="Main">
					<ul>
						<li><a href="#">Home</a></li>
						<li><a href="#">How It Works</a></li>
						<li><a href="#fees">Fees</a></li>
						<li><a href="#contact">Contact</a></li>
					</ul>
				</nav>
				<div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <button
                        type="button"
                        aria-label="Notifications"
                        onClick={onBell}
                        style={{position:'relative', background:'transparent', border:'1px solid rgba(0,0,0,0.1)', color:'#04396D', width:36, height:36, borderRadius:6, display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6v-3a6 6 0 1 0-12 0v3l-2 2v1h16v-1l-2-2Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {notif>0 && (
                            <span style={{position:'absolute', top:-6, right:-6, minWidth:16, height:16, padding:'0 4px', borderRadius:9999, background:'#FFB806', color:'#04396D', fontWeight:700, fontSize:11, display:'inline-flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff'}}>{notif}</span>
                        )}
                    </button>
					<button
						className="mobile-toggle"
						type="button"
						aria-label="Open menu"
						aria-expanded={mobileOpen}
						onClick={()=>setMobileOpen(true)}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
						</svg>
					</button>
					<button
						className="theme-toggle"
						type="button"
						aria-label="Toggle theme"
						onClick={()=>{
							const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
							if(isDark){
								document.documentElement.setAttribute('data-theme','light')
								localStorage.setItem('theme','light')
							}else{
								document.documentElement.setAttribute('data-theme','dark')
								localStorage.setItem('theme','dark')
							}
						}}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
						</svg>
					</button>
					<button className="cta" type="button">Start Swap</button>
				</div>
			</div>

			{mobileOpen && (
				<div className="mobile-menu" role="dialog" aria-modal="true">
					<div className="mobile-menu-backdrop" onClick={()=>setMobileOpen(false)} />
					<div className="mobile-menu-panel">
						<div className="mobile-menu-header">
							<a href="/" aria-label="Home" onClick={()=>setMobileOpen(false)}>
								<img className="logo" src={isDark?'/assets/logo-dark.png':'/assets/logo.png'} alt="Logo" />
							</a>
							<button className="mobile-close" type="button" aria-label="Close menu" onClick={()=>setMobileOpen(false)}>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</button>
						</div>
						<ul className="mobile-nav">
							<li><a href="#" onClick={()=>setMobileOpen(false)}>Home</a></li>
							<li><a href="#" onClick={()=>setMobileOpen(false)}>How It Works</a></li>
							<li><a href="#fees" onClick={()=>setMobileOpen(false)}>Fees</a></li>
							<li><a href="#contact" onClick={()=>setMobileOpen(false)}>Contact</a></li>
						</ul>
						<button className="cta mobile-cta" type="button" onClick={()=>setMobileOpen(false)}>Start Swap</button>
					</div>
				</div>
			)}
		</header>
		</>
	)
}
