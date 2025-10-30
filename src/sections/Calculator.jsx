import React, { useMemo, useState, useEffect, useRef } from 'react'

export default function Calculator(){
    const [amount, setAmount] = useState(1000)
    const [from, setFrom] = useState('USD')
    const [to, setTo] = useState('NGN')
    const [feeLoading, setFeeLoading] = useState(false)
    const [feeError, setFeeError] = useState(null)
    const [apiFees, setApiFees] = useState({ usdPayout24h: null, ngnWalletFunding: null })
    const [liveRate, setLiveRate] = useState(null) // Stores the actual rate: 'from' to 'to'
    const processingFeeUSD = 2
    const swapFeeRate = 0.005 // 0.5%
    const rates = {
        'USD_NGN': 1480,
        'NGN_USD': 1/1500,
        'USD_USD': 1,
        'NGN_NGN': 1,
    }

    const { netTo, swapFee, procFee, rate } = useMemo(()=>{
        const key = `${from}_${to}`
        // Use liveRate if it was successfully fetched, otherwise use the hardcoded fallback rate
        const r = (liveRate && Number.isFinite(liveRate) ? liveRate : (rates[key] ?? 0))
        const sFee = amount * swapFeeRate
        // Use API-driven processing fees when available
        const usdFee = (apiFees.usdPayout24h ?? processingFeeUSD)
        const ngnFee = (apiFees.ngnWalletFunding ?? 0)
        const pFee = from === 'USD' ? usdFee : from === 'NGN' ? ngnFee : 0
        
        // Calculation
        const gross = amount * r
        const totalFeesTo = (sFee + pFee) * r
        const nTo = Math.max(0, gross - totalFeesTo)
        
        return { netTo: nTo, swapFee: sFee, procFee: pFee, rate: r }
    }, [amount, from, to, apiFees, liveRate])

    const resultRefs = useRef([])
    
    useEffect(() => {
        if (resultRefs.current.length > 0) {
            resultRefs.current.forEach(el => {
                if (el) {
                    el.classList.remove('result-animate')
                    // Trigger reflow
                    void el.offsetWidth
                    el.classList.add('result-animate')
                }
            })
        }
    }, [netTo, swapFee, procFee, rate])

    const fmt = (v, code)=>{
        if(code==='USD') return `$${v.toLocaleString(undefined,{maximumFractionDigits:2})}`
        if(code==='NGN') return `₦${v.toLocaleString(undefined,{maximumFractionDigits:0})}`
        return v.toLocaleString()
    }

    async function handleCalculate(){
        setLiveRate(null) 
        setApiFees({ usdPayout24h: null, ngnWalletFunding: null })
        setFeeLoading(true)
        setFeeError(null)

        try{
            const EXCHANGE_API_BASE = 'https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/exchange'
            const FEE_API = import.meta.env.VITE_FEE_API 
            
            
            if (from !== to) {
                const apiFrom = 'USD'
                const apiTo = 'NGN'
                
                const rateUrl = `${EXCHANGE_API_BASE}?from=${apiFrom}&to=${apiTo}`

                try{
                    const rateRes = await fetch(rateUrl, { headers: { 'Accept':'application/json' } })
                    if(!rateRes.ok){
                        throw new Error(`Exchange API error ${rateRes.status} (${rateUrl})`)
                    }
                    const rateData = await rateRes.json()
                    
                    let newRate = null
                    if(typeof rateData?.rate === 'number'){
                        const usdToNgnRate = rateData.rate 
                        
                    
                        if (from === 'USD' && to === 'NGN') {
                            newRate = usdToNgnRate 
                        } else if (from === 'NGN' && to === 'USD') {
                            newRate = 1 / usdToNgnRate 
                        } else {
                            // Fallback to local rates for any other combination
                            const key = `${from}_${to}`
                            newRate = rates[key] ?? null
                            if (!newRate) throw new Error(`API does not support ${from} to ${to} and no default rate exists.`)
                        }
                        
                        if (newRate) {
                            setLiveRate(newRate)
                        } else {
                            throw new Error(`Invalid exchange rate calculated from API response.`)
                        }
                    } else {
                        throw new Error(`Invalid exchange rate response (${rateUrl})`)
                    }
                }catch(rateErr){
                    console.error(rateErr)
                    setFeeError(typeof rateErr?.message === 'string' ? rateErr.message : 'Failed to fetch live exchange rate.')
                    // Don't return, allow optional fee fetching to proceed
                }
            } else {
                 // For same-currency swap (USD_USD, NGN_NGN), the rate is 1.
                 setLiveRate(1)
            }

            // Fees are optional for calculation; failures shouldn't block the demo
            if(FEE_API){
                try{
                    const feeRes = await fetch(FEE_API, { headers: { 'Accept':'application/json' } })
                    if(feeRes.ok){
                        const feeData = await feeRes.json()
                        const parseMoney = (s)=>{
                            if(typeof s !== 'string') return null
                            const num = parseFloat(s.replace(/[^0-9.]/g,'') || '0')
                            return Number.isFinite(num) ? num : null
                        }
                        const usd24 = feeData?.Customer?.Payout?.find(x=>x.Service==='USD Payout - 24hours')?.Fee
                        const ngnFund = feeData?.Customer?.['NG Virtual Bank Account']?.find(x=>x.Service==='NGN Wallet Funding')?.Fee
                        setApiFees({ usdPayout24h: parseMoney(usd24), ngnWalletFunding: parseMoney(ngnFund) })
                    }else{
                        console.warn('Fee API error', feeRes.status)
                    }
                }catch(feeErr){
                    console.warn('Fee API fetch failed:', feeErr)
                }
            }
        }catch(err){
            console.error(err)
            // Only set a general error if no specific one was set during rate fetch
            if (!feeError) setFeeError('Unexpected error. Please try again.')
        }finally{
            setFeeLoading(false)
        }
    }

    return (
        <section className="calc">
            <div className="calc-container">
                <div className="calc-header reveal">
                    <h2 className="calc-title">Calculate Your Fees</h2>
                    <p className="calc-subtitle">Get instant estimates for your currency swap</p>
                </div>
                <div className="calc-card reveal">
                    <div className="calc-row">
                        <div className="calc-field">
                            <label htmlFor="amount">Amount</label>
                            <input id="amount" className="calc-input" type="number" value={amount} min={0} step={0.01} onChange={(e)=>setAmount(parseFloat(e.target.value))} />
                        </div>
                        <div className="calc-field">
                            <label htmlFor="from">From</label>
                        <select id="from" className="calc-select" value={from} onChange={(e)=>setFrom(e.target.value)}>
                            <option value="USD">USD</option>
                            <option value="NGN">NGN</option>
                        </select>
                        </div>
                        <div className="calc-field">
                            <label htmlFor="to">To</label>
                        <select id="to" className="calc-select" value={to} onChange={(e)=>setTo(e.target.value)}>
                            <option value="USD">USD</option>
                            <option value="NGN">NGN</option>
                        </select>
                        </div>
                    </div>
                    <div className="calc-actions">
                        <button className="calc-btn" type="button" onClick={handleCalculate} disabled={feeLoading}>
                            {feeLoading ? 'Calculating...' : 'Calculate Fee'}
                        </button>
                    </div>
                    <div className="calc-results">
                        <div className="result-block">
                            <div className="result-value result-animate" ref={el => resultRefs.current[0] = el}>{fmt(netTo, to)}</div>
                            <div className="result-label">You'll receive</div>
                        </div>
                        <div className="result-block">
                            <div className="result-value result-animate" ref={el => resultRefs.current[1] = el}>{fmt(swapFee, from)}</div>
                            <div className="result-label">Swap fee</div>
                        </div>
                        <div className="result-block">
                            <div className="result-value result-animate" ref={el => resultRefs.current[2] = el}>{fmt(procFee, from)}</div>
                            <div className="result-label">Processing fee</div>
                        </div>
                        <div className="result-block">
                            <div className="result-value result-animate" 
                                 ref={el => resultRefs.current[3] = el}>
                                {rate ? rate.toLocaleString(undefined, {maximumFractionDigits: 4}) : '—'}
                            </div>
                            <div className="result-label">Exchange rate</div>
                        </div>
                    </div>
                    {feeLoading && (<div style={{marginTop:16}}>Fetching latest rates and fees…</div>)}
                    {feeError && (<div style={{marginTop:16,color:'#b91c1c'}}>{feeError}</div>)}
                </div>
            </div>
        </section>
    )
}