import React, { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './sections/Hero.jsx'
import Fees from './sections/Fees.jsx'
import Calculator from './sections/Calculator.jsx'
import Referrals from './sections/Referrals.jsx'
import Rates from './sections/Rates.jsx'
import Cta from './sections/Cta.jsx'
import Footer from './components/Footer.jsx'
import RateChart from './sections/RateChart.jsx'
import FloatingAssistant from './components/FloatingAssistant.jsx'
import VideoHelpPage from './pages/VideoHelpPage.jsx'
import Onboarding from './components/Onboarding.jsx'
import TipBubble from './components/TipBubble.jsx'

export default function App(){
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return hash || '/'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      setRoute(hash || '/')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Render Video Help page
  if (route === '/video-help') {
    return (
      <>
        <Header />
        <VideoHelpPage />
        <FloatingAssistant />
        <TipBubble />
      </>
    )
  }

  // Render home page
  return (
    <>
      <Header />
      <Hero />
      <Fees />
      <Calculator />
      <Referrals />
      <Rates />
      <RateChart />
      <Cta />
      <Footer />
      <FloatingAssistant />
      <Onboarding />
      <TipBubble />
    </>
  )
}

