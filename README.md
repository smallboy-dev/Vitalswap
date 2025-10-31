# VitalSwap – Transparent FX Fees (React + Vite)

A modern, mobile-friendly single-page app for transparent currency swap fees, built with React 18 and Vite 5. The app now features a responsive floating AI assistant with multilingual voice, a live exchange rate chart, smart notifications, a first‑time guided tour, subtle AI tip bubbles, and a professional referrals carousel — all with dark mode and robust fallbacks.

---

## What’s New (Changelog)

- Live Exchange Rate Chart: 7‑day USD→NGN trend (curved SVG, hover tooltip, responsive)
- Floating AI Assistant upgrades:
  - Live FX and Fees via `VITE_EXCHANGE_API` and `VITE_FEE_API` with JSON fallbacks
  - Conversational flow for fees (prompts Customer/Business and summarizes)
  - Multilingual replies (English, Pidgin, Yoruba, Igbo, Hausa), voice output + voice input
  - Fully responsive layout; mock APIs removed; history chips removed
- Fees Section: centered Customer/Business toggle, dark mode styling, polished tables
- Calculator: live rate + fee integration, clearer errors, amount can be cleared, animated results
- Live Rates card: only USD↔NGN pairs, better formatting, refresh button, loading/error states
- Smart Notifications: header bell shows a “1” badge on rate changes; clicking scrolls to rates
- Guided Tour (Onboarding): first‑time, branded glass card with arrow, auto‑scroll to targets, keyboard nav
- AI Tip Bubbles: subtle, glassy rotating tips; auto‑hide; cooldown (10 min) and daily cap (3); post‑onboarding
- Referrals: responsive carousel with autoplay, swipe, pause‑on‑hover; centered, professional card design
- Global: dark mode coverage, animations, `.env` driven endpoints, IntersectionObserver fallback, favicon `f.png`

---

## Features

- Fully responsive, professional design
- Animated page sections and cards (IntersectionObserver, CSS transitions)
- Sticky, animated header with theme toggle and dark mode support
- Live exchange rates and fee breakdowns using external API endpoints (with offline/backup fallbacks)
- Categorized, toggleable fee tables (Customer / Business)
- Calculator for real-time rate and fee conversion
- Floating Assistant: Conversational AI that fetches and announces rates/fees/referral info (with multilingual support)
- Smart notifications: header bell badge on rate updates, deep‑link scroll to rates
- First‑time guided tour that points to key features (assistant, rates, fees/calculator, theme)
- AI tip bubbles that show occasionally with cooldown and daily caps
- No hardcoded API URLs — configure with `.env` for easy deployment anywhere

---

## Demo Overview

- Animations: Sections, cards, and results animate in as you scroll.
- Dark Mode: Click the theme toggle in the header. The UI, fees, and chat adapt for night.
- Floating Assistant: Tap the bottom-right AI icon for smart, voiced support on any device.
- Smart Bell: When the rates change, the bell shows “1”; click to jump to Live Rates.
- Guided Tour: First visit shows a 5‑step tour with an arrow to each feature; Esc/Enter/←/→ supported.

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended for Vite 5)
- npm 9+ (bundled with Node)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```
Visit the Local URL printed by Vite (typically `http://localhost:5173`).

### Building for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Environment Setup

All API endpoints are configured in your `.env` at the project root:

```env
VITE_FEE_API=https://your-api.com/fee
VITE_EXCHANGE_API=https://your-api.com/exchange
```

After changing `.env`, always restart the dev server.

---

## Static Fallbacks

If an API is unreachable, the app automatically falls back to local JSON files:

- `public/assets/fees-fallback.json` — For fee breakdowns (example provided)
- `public/assets/rates-fallback.json` — For exchange rates

These ensure demo/offline resilience and enable mock/test data.

---

## Project Structure

```text
root/
  public/
    assets/
      fees-fallback.json     # Fallback data for fees
      rates-fallback.json    # Fallback data for rates
  src/
    components/
      Header.jsx             # Sticky header, theme, nav, bell notification
      Footer.jsx             # Footer links and icons
      FloatingAssistant.jsx  # Responsive floating chat with voice + multilingual
      Onboarding.jsx         # First-time guided tour with arrow + auto-scroll
      TipBubble.jsx          # Subtle, rotating AI tip bubbles (cooldowns)
    sections/
      Hero.jsx               # Hero illustration
      Fees.jsx               # Fee breakdown + live tables with toggle
      Calculator.jsx         # Live calculator with animated results
      Referrals.jsx          # Carousel with autoplay/swipe/centered cards
      Rates.jsx              # Live rate card (USD↔NGN), errors/loading
      RateChart.jsx          # 7‑day curved trend chart with tooltip
      Cta.jsx                # Call-to-action/Join prompt
    App.jsx                  # Assembles all sections + global components
    main.jsx                 # App entry, bootstrap, theme/init + IO fallback
    styles.css               # Global/tokens/themes/animations
  vite.config.js
  .env
  package.json
```

---

## API Integration

- All live data pulls are environment‑driven so endpoints can be swapped for staging, hackathon, or production without code changes.
- Fees and rates are fetched in real-time, parsed, and displayed in both UI cards and the AI chat.
- If an endpoint is down/misconfigured, local fallback JSON is used for a seamless experience.

**Conversational Handler (AI Assistant):**
- Answers fee, rate, and referral questions; detects user intent; prompts for Customer/Business if unclear; and reads answers aloud using browser speech.
- Multilingual templates (English, Pidgin, Yoruba, Igbo, Hausa). Voice selection uses the best available system voice.
- Graceful fallbacks ensure uninterrupted demo even if endpoints fail.

---

## Live Exchange Rate Chart

- Curved SVG line/area, 7‑day USD→NGN trend with hover tooltip.
- Uses the latest live rate (or fallback JSON) and synthesizes recent history for a clean demo.
- Responsive width, subtle grid/axes, and branded colors.

---

## Guided Tour (Onboarding)

- First‑time only, glassmorphic card with animated zoom and directional arrow.
- Steps: Assistant → Live Rates → Fees & Calculator → Theme.
- Auto-scroll to targets; body click re‑scrolls; keyboard navigation (Esc/Enter/←/→).
- Mobile‑responsive card sizing and arrow behavior.

---

## AI Tip Bubbles

- Subtle, glassy tips shown bottom‑left, rotating every few seconds.
- Auto‑hide (10s mobile / 14s desktop); appear after onboarding.
- Frequency control: 10‑minute cooldown and max 3 times/day; session dismissal respected.

---

## Smart Notifications

- Header bell listens for rate changes; shows a small “1” badge when updates occur.
- Clicking the bell smooth‑scrolls to the Live Rates section and clears the badge.

---

## Animations and Motion

- Reveal on scroll for major cards/blocks (IntersectionObserver)
- Fade/slide‑in, pulse effects for calculator results
- All animations disabled if `prefers-reduced-motion` is set

---

## Theming

- Auto detects system theme on load
- One-click toggle for dark/light mode (stores selection)
- Fully themed sections, including floating Assistant, fees tables, and charts

---

## Accessibility

- Respects user motion preferences
- Keyboard navigation and focus indicators throughout
- Semantic ARIA labels for all major controls
- High contrast and color accessibility for all modes

---

## Deployment

- After `npm run build`, deploy the contents of `dist/` to any static host (Netlify, Vercel, CF Pages, S3, etc.).
- If deploying under a subdirectory, configure `base` in `vite.config.js`.

---

## License

MIT — Feel free to use and adapt for your own projects or hackathons!

---

## How We Integrated the Provided Endpoints

- The frontend uses the provided API endpoints to fetch live exchange rates and fee breakdowns, parsing and displaying them in real-time — and powering our conversational assistant.
- All API endpoints are configured in `.env` for secure, environment-based switching.
- When endpoints are unreachable, the application falls back to local static JSON so live questions and calculations always work.
- The AI assistant checks user intent, fetches or reads fallback data, and announces answers via both chat and voice for maximum clarity.
