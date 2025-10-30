import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function FloatingAssistant(){
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [listening, setListening] = useState(false)
    const [messages, setMessages] = useState(()=>[
        { role:'assistant', text: "Hi! I'm your VitalSwap AI Assistant. Ask me about fees, rates, or referrals." }
    ])
    const [feeModeAsk, setFeeModeAsk] = useState(null) 

    const chatRef = useRef(null)
    const recRef = useRef(null)

    const brand = useMemo(()=>({ blue:'#04396D', yellow:'#FFB806' }),[])

	// External APIs (env-driven)
	const FEE_API = import.meta?.env?.VITE_FEE_API
	const EXCHANGE_API = import.meta?.env?.VITE_EXCHANGE_API

    // Fetch live rates from exchange API
    const fetchLiveRates = useCallback(async () => {
      console.log('EXCHANGE_API:', EXCHANGE_API); // Log the API
      if (!EXCHANGE_API) {
        console.log('EXCHANGE_API env variable not set');
        return null;
      }
      try {
        const [usdNgn, ngnUsd] = await Promise.all([
          fetch(`${EXCHANGE_API}?from=USD&to=NGN`).then(r=>r.ok?r.json():Promise.reject(r)),
          fetch(`${EXCHANGE_API}?from=NGN&to=USD`).then(r=>r.ok?r.json():Promise.reject(r)),
        ]);
        console.log('Live API rates responses:', { usdNgn, ngnUsd });
        return {
          USD_NGN: usdNgn.rate,
          NGN_USD: ngnUsd.rate
        };
      } catch (e) {
        console.log('Live rates fetch error:', e);
        return null;
      }
    }, [EXCHANGE_API]);

    useEffect(()=>{
        const el = chatRef.current
        if(el) el.scrollTop = el.scrollHeight
    },[messages, open])

    // Text-to-Speech for assistant replies
    const speak = useCallback((text)=>{
        try{
            if(!('speechSynthesis' in window)) return
            const utter = new SpeechSynthesisUtterance(text)
            utter.rate = 1
            utter.pitch = 1
            window.speechSynthesis.cancel() // stop any ongoing speech
            window.speechSynthesis.speak(utter)
        }catch(_e){  }
    },[])

	// Fetch fees from external API
	const fetchFees = useCallback(async ()=>{
		try{
			const res = await fetch(FEE_API, { headers: { 'Accept':'application/json' } })
			if(!res.ok) throw new Error('Failed to fetch fees')
			const data = await res.json()
			return data
		}catch(_e){
			return null
		}
	},[FEE_API])

    const addAssistantMessage = useCallback((text)=>{
        setMessages(prev=>[...prev, { role:'assistant', text }])
        speak(text)
    },[speak])

    const handleUserSend = useCallback(async (raw)=>{
        const text = (raw ?? input).trim()
        if(!text) return
        setMessages(prev=>[...prev, { role:'user', text }])
        setInput('')

        // Very simple intent matching
        const lower = text.toLowerCase()
        if(lower.includes('fee') || (feeModeAsk==='awaiting' && /(customer|business)/.test(lower))) {
            let fees=null;
            try{
                fees = await fetchFees();
            }catch(_e){fees=null;}
            if(!fees){
                try{
                    const res = await fetch('/assets/fees-fallback.json');
                    if(res.ok) fees = await res.json();
                }catch(_e){fees=null;}
            }
            if(!fees){
                addAssistantMessage("Sorry, fee details are currently unavailable.");
                return;
            }
            const isCustomer = lower.includes('customer');
            const isBusiness = lower.includes('business');
            let group=null;
            if(isCustomer || (feeModeAsk==="awaiting" && /(customer)/.test(lower))) group='Customer';
            if(isBusiness || (feeModeAsk==="awaiting" && /(business|company)/.test(lower))) group='Business';
            if(!group) {
                setFeeModeAsk('awaiting');
                addAssistantMessage('Do you want Customer or Business fees?');
                return;
            }
            const groupObj = fees[group];
            if(!groupObj){
                addAssistantMessage(`No ${group} fee data found.`);
                setFeeModeAsk(null);
                return;
            }
            let reply = `${group} fees:\n`;
            Object.entries(groupObj).forEach(([category, arr])=>{
                reply += `\n${category}:\n`;
                (arr||[]).forEach(item=>{
                    reply += `- ${item.Service}: ${item.Fee}\n`;
                });
            });
            addAssistantMessage(reply.trim());
            speak(reply.trim());
            setFeeModeAsk(null);
            return;
        }
        if(lower.includes('rate') || lower.includes('dollar') || lower.includes('naira') || lower.includes('fx')){
            let rates = await fetchLiveRates();
            if(!rates) {
                try {
                    const res = await fetch('/assets/rates-fallback.json');
                    if(res.ok) rates = await res.json();
                }catch(_e){rates=null;}
            }
            if(rates && rates.USD_NGN && rates.NGN_USD){
                const reply = `Current rates:\n$1 = ₦${rates.USD_NGN.toLocaleString()}\n₦1 = $${rates.NGN_USD.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
                addAssistantMessage(reply);
                speak(reply);
            } else {
                addAssistantMessage("Sorry, I couldn't fetch the latest rates at the moment. Please try again later.");
            }
            return;
        }
        if(lower.includes('referral') || lower.includes('refer') || lower.includes('invite')){
            const reply = 'To refer someone, copy your swap tag or referral link and share it with your friends. When your friend signs up with your link and completes a swap, you both get rewarded.';
            addAssistantMessage(reply); speak(reply);
            return;
        }
        addAssistantMessage("I can help with FX rates, fees, and referrals. Try asking: 'What’s the current dollar to naira rate?'");
    },[input, addAssistantMessage, fetchLiveRates, fetchFees, feeModeAsk])

    // Speech Recognition (if available)
    useEffect(()=>{
        try{
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition
            if(!SR) return
            const rec = new SR()
            rec.continuous = false
            rec.lang = 'en-US'
            rec.interimResults = false
            rec.maxAlternatives = 1
            rec.onresult = (e)=>{
                const transcript = e.results?.[0]?.[0]?.transcript || ''
                setInput(transcript)
                setListening(false)
                // Auto-send on capture
                handleUserSend(transcript)
            }
            rec.onend = ()=>{ setListening(false) }
            rec.onerror = ()=>{ setListening(false) }
            recRef.current = rec
        }catch(_e){ /* not supported */ }
    },[handleUserSend])

    const startListening = useCallback(()=>{
        const rec = recRef.current
        if(!rec){
            // If not supported, insert a small hint
            addAssistantMessage('Voice input is not supported by your browser. Please type your question.')
            return
        }
        try{
            setListening(true)
            rec.start()
        }catch(_e){ setListening(false) }
    },[addAssistantMessage])

    const stopListening = useCallback(()=>{
        try{ recRef.current?.stop() }catch(_e){ /* no-op */ }
        setListening(false)
    },[])

    // Styles (scoped via prefixed class names)
    const s = {
        btn: {
            position:'fixed', right:16, bottom:16, zIndex:40,
            width:56, height:56, borderRadius:9999,
            background: brand.yellow, color: brand.blue, border:'none', cursor:'pointer',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 12px 24px rgba(4,57,109,0.25)',
            transition:'transform .2s ease, box-shadow .2s ease'
        },
        panelWrap: {
            position:'fixed', right:16, bottom:84, zIndex:40,
            width:'min(100vw - 24px, 380px)',
            pointerEvents:'none'
        },
        panel: {
            borderRadius:16,
            background:'linear-gradient(180deg, #ffffff, #f7fafc)',
            boxShadow:'0 24px 48px rgba(0,0,0,0.18)',
            border:'1px solid rgba(4,57,109,0.12)',
            overflow:'hidden', transformOrigin:'bottom right',
            transition:'transform .22s cubic-bezier(.16,1,.3,1), opacity .22s ease',
            pointerEvents:'auto'
        },
        header: {
            height:52, display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'0 12px', background:'#04396D', color:'#fff'
        },
        title: { margin:0, fontSize:14, fontWeight:800, fontFamily:'Gilroy, Poppins, system-ui' },
        close: {
            width:32, height:32, borderRadius:8, border:'none', cursor:'pointer',
            background:'rgba(255,255,255,0.12)', color:'#fff'
        },
        chat: {
            height:320, overflow:'auto', padding:12, background:'linear-gradient(180deg, #ffffff, #eef2f7)'
        },
        row: { display:'flex', gap:8, margin:'8px 0' },
        bubbleUser: {
            marginLeft:'auto', maxWidth:'80%', padding:'10px 12px', borderRadius:12,
            background:'#FFB806', color: brand.blue, fontFamily:'Poppins, system-ui',
            boxShadow:'0 8px 14px rgba(255,184,6,0.25)'
        },
        bubbleAi: {
            marginRight:'auto', maxWidth:'85%', padding:'10px 12px', borderRadius:12,
            background:'#04396D', color:'#ffffff', fontFamily:'Poppins, system-ui',
            boxShadow:'0 8px 14px rgba(4,57,109,0.25)'
        },
        inputBar: {
            display:'grid', gridTemplateColumns:'36px 1fr 44px', gap:8, padding:12,
            background:'#ffffff', borderTop:'1px solid rgba(4,57,109,0.12)'
        },
        mic: {
            width:36, height:36, borderRadius:8, border:'1px solid rgba(4,57,109,0.18)',
            background: listening ? 'rgba(255,184,6,0.22)' : 'transparent', color: brand.blue, cursor:'pointer'
        },
        send: {
            width:44, height:36, borderRadius:8, border:'none',
            background: brand.yellow, color: brand.blue, cursor:'pointer', fontWeight:700
        },
        input: {
            width:'100%', height:36, borderRadius:8, border:'1px solid #D1D5DB',
            padding:'0 10px', fontFamily:'Poppins, system-ui', outline:'none'
        }
    }

    const portalTarget = typeof document !== 'undefined' ? document.body : null

    const ui = (
        <>
            {/* Inline CSS for small responsive tweaks and animations */}
            <style>{`
                .fa-btn:hover{ transform: translateY(-2px); box-shadow: 0 18px 26px rgba(4,57,109,0.3) }
                .fa-panel-enter{ transform: scale(0.96); opacity: 0 }
                .fa-panel-enter.fa-panel-enter-active{ transform: scale(1); opacity: 1 }
                @media (max-width: 480px){
                  .fa-panel{ width: calc(100vw - 12px) !important; min-width: 0 !important; max-width: 98vw; }
                }
                @media (max-width: 600px) {
                    .fa-btn { width: 60px !important; height: 60px !important; right: 8px !important; bottom: 8px !important; }
                    .fa-panel { right: 7px !important; bottom: 80px !important; min-width: 0 !important; max-width: 98vw; }
                }
                @media (max-width: 400px) {
                    .fa-btn { width: 55px !important; height: 55px !important; }
                    .fa-panel { width: 99vw !important; }
                }
                .fa-panel, .fa-panel * { box-sizing: border-box; }
                .fa-panel { min-width: 0; width: 100%; }
                .fa-panel input, .fa-panel textarea { font-size: 1rem; }
                .fa-panel .fa-panel-title, .fa-panel h4 { font-size: 15px !important; }
                .fa-panel .fa-panel-header, .fa-panel .fa-panel-footer { padding: 10px 10px !important; }
                .fa-panel .fa-panel-bubble { font-size: 1rem; }
                @media (max-width:520px) {
                    .fa-panel { border-radius: 9px !important; right: 0 !important; bottom: 0 !important; min-width: 0 !important; width: 100vw !important; }
                    .fa-panel .fa-panel-bubble { font-size: .97rem !important; }
                    .fa-panel input, .fa-panel textarea { font-size: 0.97rem; }
                    .fa-panel .fa-panel-header { padding: 8px 7px; }
                }
                @media (max-width:390px) {
                    .fa-panel { border-radius: 4.5vw; width: 100vw !important; }
                }
            `}</style>

            {!open && (
                <button
                    type="button"
                    className="fa-btn"
                    aria-label="Open Vital AI Assistant"
                    style={s.btn}
                    onClick={()=> setOpen(true)}
                >
                    <span aria-hidden="true" style={{fontSize:22}}>🧠</span>
                </button>
            )}

            {open && (
                <div style={s.panelWrap}>
                    <div className="fa-panel fa-panel-enter fa-panel-enter-active" style={s.panel}>
                        <div style={s.header}>
                            <h4 style={s.title}>VitalSwap AI Assistant 💬</h4>
                            <button type="button" style={s.close} aria-label="Close assistant" onClick={()=> setOpen(false)}>
                                ×
                            </button>
                        </div>
                        <div ref={chatRef} style={s.chat}>
                            {messages.map((m,idx)=> (
                                <div key={idx} style={s.row}>
                                    <div style={m.role === 'user' ? s.bubbleUser : s.bubbleAi}>{m.text}</div>
                                </div>
                            ))}
                        </div>
                        <div style={s.inputBar}>
                            {listening ? (
                                <button type="button" style={s.mic} aria-label="Stop listening" onClick={stopListening}>
                                    ■
                                </button>
                            ) : (
                                <button type="button" style={s.mic} aria-label="Start voice input" onClick={startListening}>
                                    🎙️
                                </button>
                            )}
                            <input
                                style={s.input}
                                value={input}
                                onChange={(e)=> setInput(e.target.value)}
                                placeholder="Type your question…"
                                onKeyDown={(e)=>{ if(e.key==='Enter') handleUserSend() }}
                            />
                            <button type="button" style={s.send} onClick={()=> handleUserSend()} aria-label="Send message">📤</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

    return portalTarget ? createPortal(ui, portalTarget) : null
}


