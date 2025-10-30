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

// Animation reveal helper
function animateRevealAll() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const animateRows = [
    ...document.querySelectorAll('.hero, .fees-header, .fees-live, .calc, .rates, .referrals, .footer-top'),
    ...document.querySelectorAll('.fee-card, .fees-category-card, .calc-card, .rate-item, .ref-card'),
  ];
  let delayStep = 0;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries, obs)=>{
    entries.forEach((entry,i) => {
      if(entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        entry.target.classList.add('stagger-'+((delayStep%5)+1));
        obs.unobserve(entry.target);
        delayStep++;
      }
    })
  }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px'}) : null;
  animateRows.forEach((el, i) => {
    if(io) io.observe(el);
    else {
      el.classList.add('animate-in');
    }
  });
}

window.requestAnimationFrame(()=>{
  animateRevealAll();
});

// Safety net: ensure reveal content becomes visible even if IO/timing fails
setTimeout(()=>{
  try{
    const items = Array.from(document.querySelectorAll('.reveal'))
    if(items.length){
      const anyIn = items.some(el=> el.classList.contains('in'))
      if(!anyIn){
        items.forEach(el=> el.classList.add('in'))
      }
    }
  }catch(_e){ /* no-op */ }
}, 1200)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

