import React, { useState } from 'react'

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
					<div>
						<p className="ref-name">{name}</p>
						<p className="ref-handle">{handle}</p>
					</div>
				</div>
				<p className="ref-link">{link.replace('https://','')}</p>
				<button className="ref-btn" type="button" onClick={onCopy}>{label}</button>
			</article>
		)
	}
	return (
		<section className="referrals">
			<div className="referrals-container">
				<header className="referrals-header reveal">
					<h2 className="referrals-title">SwapTag Referrals</h2>
					<p className="referrals-subtitle">Invite friends and earn rewards with every successful swap</p>
				</header>
				<div className="referrals-grid">
					<div className="reveal"><Card initials="SJ" name="Jephthah" handle="@jeff" link="https://vitalswap.com/ref/jeff" /></div>
					<div className="reveal"><Card initials="MC" name="Kelechi" handle="@KayC" link="https://vitalswap.com/ref/KayC" /></div>
					<div className="reveal"><Card initials="EW" name="Otunloba" handle="@Otunloba" link="https://vitalswap.com/ref/Otunloba" /></div>
				</div>
			</div>
		</section>
	)
}

