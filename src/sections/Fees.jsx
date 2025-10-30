import React, { useEffect, useMemo, useState } from 'react'


const FeeCardComponent = ({ categoryTitle, fees }) => {
    // Determine the color of the card based on the category title (optional, but good for design)
    const isPrimary = categoryTitle.toLowerCase().includes('transaction');

    if (!Array.isArray(fees) || fees.length === 0) return (
        <article className="fees-category fees-category-card fees-category-empty">
            <h5 className="fees-category-title">{categoryTitle}</h5>
            <div className="fee-table-empty">No entries.</div>
        </article>
    );

    return (
        <article className={`fees-category fees-category-card ${isPrimary ? 'fees-category-card--primary' : ''}`}>
            <h5 className="fees-category-title">{categoryTitle}</h5>
            <ul className="fee-list-dynamic">
                {fees.map((item, index) => (
                    <li key={index} className="fee-list-dynamic-item">
                        <span className="fee-list-dynamic-label">{item.Service}</span>
                        <span className="fee-list-dynamic-fee">{item.Fee}</span>
                        <span className="fee-list-dynamic-desc">{item.Description || '-'}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
};

export default function Fees(){
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [feeTab, setFeeTab] = useState('Customer') // 'Customer' or 'Business'

    const FEE_API = 'https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/fee'

    useEffect(()=>{
        let cancelled = false
        ;(async()=>{
            try{
                setLoading(true)
                const res = await fetch(FEE_API, { headers: { 'Accept':'application/json' } })
                if(!res.ok) throw new Error('Failed to fetch fees')
                const json = await res.json()
                if(!cancelled){
                    setData(json)
                    setError('')
                }
            }catch(e){
                if(!cancelled){
                    setError('Unable to load latest fees. Please try again later.')
                }
            }finally{
                if(!cancelled) setLoading(false)
            }
        })()
        return ()=>{ cancelled = true }
    },[])

    const customerCategories = useMemo(()=>{
        return data?.Customer ? Object.entries(data.Customer) : []
    },[data])

    const businessCategories = useMemo(()=>{
        return data?.Business ? Object.entries(data.Business) : []
    },[data])


    // NOTE: The old 'Table' component has been removed!

    return (
        <section id="fees" className="fees">
            <style>{`
                /* ================================================= */
                /* STYLES FROM ORIGINAL CODE (Kept and adjusted)     */
                /* ================================================= */
                .fees-title, .fees-live-title {
                    font-family: Gilroy, Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                    font-size: 2.35rem;
                    font-weight: 800;
                    color: #04396D;
                    margin: 0 0 0.45em 0;
                    text-align: left;
                }
                .fees-subtitle, .fees-live-subtitle {
                    margin: 8px 0 0 0;
                    color: #4B5563;
                    font-size: 1.15rem;
                    line-height: 1.6;
                    text-align: left;
                    font-weight: 400;
                }
                .fees-header, .fees-live-header {
                    margin: 0 0 32px 0;
                    text-align: left;
                }
                
                /* NOTE: Removed all old table styles */
                
                .fees-category-card {
                    margin-bottom: 32px;
                    padding: 16px;
                    background: #f7fafc;
                    border-radius: 10px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 2px 8px rgba(4,57,109,0.05);
                }
                
                @media (max-width: 767px) {
                    .fees-category-card { padding: 8px; }
                }
                .fee-table-empty {
                    padding: 18px 0;
                    text-align: center;
                    color: #888;
                }
                .fees-switch-wrap {
                    display: flex;
                    justify-content: center;
                    margin: 30px 0 30px 0;
                    width: 100%;
                }
                .fees-switch {
                    display: flex;
                    background: #f1f5f9;
                    border-radius: 999px;
                    box-shadow: 0 1px 6px rgba(4,57,109,0.06);
                    border: 1.5px solid #e5e7eb;
                    padding: 3px;
                    gap: 0;
                }
                .fees-switch-btn {
                    border: none;
                    background: transparent;
                    color: #04396D;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 999px;
                    min-width: 110px;
                    padding: 7px 0;
                    margin: 0 1px;
                    cursor: pointer;
                    position: relative;
                    z-index: 1;
                    transition: color .22s;
                }
                .fees-switch-btn.active,
                .fees-switch-btn:focus-visible {
                    background: #FFB806;
                    color: #04396D !important;
                    box-shadow: 0 2px 8px #ffe08244;
                }
                .fees-switch-btn:focus-visible {
                    outline: 2px solid #04396D;
                    outline-offset: 0.5px;
                }
                @media (max-width: 530px) {
                    .fees-switch-btn { min-width: 90px; font-size: 15px; }
                }
                .fees-live {
                    margin-top: 56px;
                    padding-left: 0;
                    padding-right: 0;
                }
                @media (max-width: 1023px) {
                    .fees-live { padding-left: 0; padding-right: 0; }
                }
                @media (max-width: 767px) {
                    .fees-live { margin-top: 32px; }
                    .fees-live { padding-left: 4vw; padding-right: 4vw; }
                }
                @media (max-width: 520px) {
                    .fees-live { padding-left: 2vw; padding-right: 2vw; }
                }
                .fees-switch-wrap {
                    width: 100%;
                    max-width: 100vw;
                }
                .fees-switch {
                    min-width: 0;
                    width: 100%;
                    gap: 0;
                }
                .fees-switch-btn {
                    flex: 1 1 50%;
                    min-width: 0;
                    padding: 8px 0;
                }
                @media (max-width: 530px) {
                    .fees-switch-btn { font-size: 14.5px; }
                }
                .fees-live-title {
                    font-size: 2rem;
                    word-break: break-word;
                }
                @media (max-width: 500px) {
                    .fees-live-title { font-size: 1.35rem; }
                    .fees-subtitle, .fees-live-subtitle { font-size: 1rem; }
                }
                
                @media (max-width: 530px) {
                    .fees-category-card { padding: 6px 2px; margin-bottom: 18px; }
                }
                /* DARK MODE STYLES (Unchanged) */
                :root[data-theme="dark"] .fees-live {
                    background: #0f172a;
                }
                :root[data-theme="dark"] .fees-live-title {
                    color: #e2e8f0;
                }
                :root[data-theme="dark"] .fees-live-subtitle {
                    color: #94a3b8;
                }
                :root[data-theme="dark"] .fees-switch {
                    background: #152041;
                    border-color: #22315c;
                }
                :root[data-theme="dark"] .fees-switch-btn {
                    color: #93c5fd;
                    background: transparent;
                }
                :root[data-theme="dark"] .fees-switch-btn.active,
                :root[data-theme="dark"] .fees-switch-btn:focus-visible {
                    background: #FFB806;
                    color: #04396D !important;
                    box-shadow: 0 2px 12px #1e1e1e33;
                }
                :root[data-theme="dark"] .fees-category-card {
                    background: #1e293b;
                    border-color: #23304f;
                    box-shadow: 0 2px 8px #202b44aa;
                }
                
                /* ================================================= */
                /* NEW STYLES FOR CARD/BULLET LAYOUT                 */
                /* ================================================= */
                .fees-live-grid {
                    display: grid;
                    /* Default to 1 column on smaller screens */
                    grid-template-columns: 1fr; 
                    gap: 24px;
                    margin-top: 20px;
                }
                @media (min-width: 900px) {
                    /* 2 columns on larger screens for better use of space */
                    .fees-live-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                .fees-category-card {
                    display: flex;
                    flex-direction: column;
                    padding: 24px; /* Make it a bit bigger than the default 16px */
                }
                .fees-category-card--primary {
                    /* Optional: Style a specific card type differently */
                    background: #fff8e1; /* Lighter yellow background */
                    border-color: #ffe082;
                }
                :root[data-theme="dark"] .fees-category-card--primary {
                    background: #23315c;
                    border-color: #3b507f;
                }

                .fees-category-title {
                    font-size: 1.5rem; /* Larger title */
                    font-weight: 700;
                    color: #04396D;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e5e7eb;
                    text-align: left;
                }
                :root[data-theme="dark"] .fees-category-title {
                    color: #cbeafe;
                    border-bottom-color: #22315c;
                }

                .fee-list-dynamic {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .fee-list-dynamic-item {
                    display: grid;
                    /* Three columns: Service, Fee, Description */
                    grid-template-columns: 1fr auto; 
                    grid-template-areas: "label fee" "desc desc";
                    align-items: center;
                    padding-bottom: 10px;
                    border-bottom: 1px dashed #e5e7eb;
                }
                .fee-list-dynamic-item:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                :root[data-theme="dark"] .fee-list-dynamic-item {
                    border-bottom-color: #2e3b5e;
                }

                .fee-list-dynamic-label {
                    grid-area: label;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #04396D;
                }
                :root[data-theme="dark"] .fee-list-dynamic-label {
                    color: #e2e8f0;
                }

                .fee-list-dynamic-fee {
                    grid-area: fee;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #FFB806; /* Highlighting the fee in yellow */
                    white-space: nowrap;
                    margin-left: 15px;
                }

                .fee-list-dynamic-desc {
                    grid-area: desc;
                    font-size: 0.95rem;
                    color: #6b7280;
                    margin-top: 4px;
                }
                :root[data-theme="dark"] .fee-list-dynamic-desc {
                    color: #94a3b8;
                }
                /* Mobile optimization for very small screens */
                @media (max-width: 450px) {
                    .fee-list-dynamic-item {
                        grid-template-columns: 1fr;
                        grid-template-areas: "label" "fee" "desc";
                    }
                    .fee-list-dynamic-fee {
                        grid-area: fee;
                        text-align: left;
                        margin-top: 4px;
                        margin-left: 0;
                    }
                }
            `}</style>
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
                
                {/* Modified this to us cards */}
                <div className="fees-live reveal">
                    <header className="fees-live-header">
                        <h2 className="fees-live-title">Current Service & Transaction Fees</h2>
                        <p className="fees-live-subtitle">See up-to-date service and transaction fees for your swaps. All values are refreshed live from our servers.</p>
                        
                        <div className="fees-switch-wrap">
                            <div className="fees-switch" role="tablist" aria-label="Fee Group Tabs">
                                <button
                                    type="button"
                                    className={`fees-switch-btn${feeTab==='Customer'?' active':''}`}
                                    aria-selected={feeTab==='Customer'}
                                    tabIndex={feeTab==='Customer' ? 0 : -1}
                                    role="tab"
                                    onClick={()=>setFeeTab('Customer')}
                                >
                                    Customer
                                </button>
                                <button
                                    type="button"
                                    className={`fees-switch-btn${feeTab==='Business'?' active':''}`}
                                    aria-selected={feeTab==='Business'}
                                    tabIndex={feeTab==='Business' ? 0 : -1}
                                    role="tab"
                                    onClick={()=>setFeeTab('Business')}
                                >
                                    Business
                                </button>
                            </div>
                        </div>
                    </header>

                    {loading && (
                        <div className="fees-live-state" role="status">Loading latest fees…</div>
                    )}
                    {!loading && error && (
                        <div className="fees-live-state fees-live-state--error" role="alert">{error}</div>
                    )}

                    {!loading && !error && data && (
                        <div className="fees-live-grid fees-live-styled">
                            {feeTab==='Customer' && customerCategories.map(([category, rows])=> (
                                <FeeCardComponent 
                                    key={category} 
                                    categoryTitle={category} 
                                    fees={rows} 
                                />
                            ))}
                            {feeTab==='Business' && businessCategories.map(([category, rows])=> (
                                <FeeCardComponent 
                                    key={category} 
                                    categoryTitle={category} 
                                    fees={rows} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}