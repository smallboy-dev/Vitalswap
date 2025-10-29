import React from 'react'
import Header from './components/Header.jsx'
import Hero from './sections/Hero.jsx'
import Fees from './sections/Fees.jsx'
import Calculator from './sections/Calculator.jsx'
import Referrals from './sections/Referrals.jsx'
import Rates from './sections/Rates.jsx'
import Cta from './sections/Cta.jsx'
import Footer from './components/Footer.jsx'

export default function App(){
  return (
    <>
      <Header />
      <Hero />
      <Fees />
      <Calculator />
      <Referrals />
      <Rates />
      <Cta />
      <Footer />
    </>
  )
}

