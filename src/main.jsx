import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const initTheme = ()=>{
  try{
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = stored || (prefersDark ? 'dark' : 'light')
    if(theme === 'dark' || theme === 'light'){
      document.documentElement.setAttribute('data-theme', theme)
    }
  }catch(_e){
    
  }
}

initTheme()

const initReveal = ()=>{
  try{
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(document.querySelectorAll('.reveal'))
    if(items.length === 0) return
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          const el = entry.target
          el.classList.add('in')
          io.unobserve(el)
        }
      })
    },{ rootMargin: '0px 0px -10% 0px', threshold: 0.12 })
    items.forEach((el,idx)=>{
      el.style.transitionDelay = `${Math.min(idx*60, 300)}ms`
      io.observe(el)
    })
  }catch(_e){
    // no-op
  }
}

window.requestAnimationFrame(()=> initReveal())

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

