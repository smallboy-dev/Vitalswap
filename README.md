# VitalSwap – Transparent FX Fees (React + Vite)

A modern, mobile-friendly single-page app for transparent currency swap fees, built with React 18 and Vite 5. Features animated page sections, live exchange rates and fee fetching, dark mode, a responsive floating AI assistant, and robust error/fallback handling.

---

## Features

- Fully responsive, professional design
- Animated page sections and cards (IntersectionObserver, CSS transitions)
- Sticky, animated header with theme toggle and dark mode support
- Live exchange rates and fee breakdowns, using external API endpoints (with offline/backup fallbacks)
- Categorized, toggleable fee tables (Customer / Business)
- Calculator for real-time rate and fee conversion
- Floating Assistant: Conversational AI powered interface that fetches and announces rates/fees/referral info
- Accessible (prefers-reduced-motion, ARIA, keyboard nav, high contrast)
- No hardcoded API URLs configure with `.env` for easy deployment anywhere

---

## Demo Overview

- **Animations:** All main sections, cards, and results animate in as you scroll.
- **Dark Mode:** Click the theme toggle in the header. The UI, fees, and chat adapt for night.
- **Floating Assistant:** Tap the bottom-right AI icon for smart, voiced support on any device.

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
      Header.jsx             # Sticky header, theme, and nav drawer
      Footer.jsx             # Footer links and icons
      FloatingAssistant.jsx  # Responsive floating chat with voice
    sections/
      Hero.jsx               # Hero illustration
      Fees.jsx               # Main fee breakdown + tables
      Calculator.jsx         # Live calculator
      Referrals.jsx          # Referral/Invite info and actions
      Rates.jsx              # Live rate card
      Cta.jsx                # Call-to-action/Join prompt
    App.jsx                  # Assembles all sections
    main.jsx                 # App entry, bootstrap, theme/init
    styles.css               # Global/tokens/themes/animations
  vite.config.js
  .env
  package.json
```

---

## API Integration

- All live data pulls are environment driven so that endpoints can be swapped for staging, hackathon, or production without code changes.
- Fees and rates are fetched in real-time, parsed, and displayed in both UI cards and the AI chat.
- If an endpoint is down/misconfigured, local fallback JSON is used for a seamless experience.

**Conversational Handler (AI Assistant):**
- Answers `fee`, `rate`, and `referral` questions, detects user intent, fetches info, prompts for Customer/Business type if unclear, and reads answers aloud using browser speech API.
- Fallback logic allows uninterrupted demo even if endpoints fail.

---

## Animations and Motion

- Reveal on scroll for major cards/blocks (IntersectionObserver)
- Fade/slide-in, pulse effects for calculator results
- All animations disabled if `prefers-reduced-motion` is set

---

## Theming

- Auto detects system theme on load
- One-click toggle for dark/light mode (stores selection)
- Fully themed sections, including floating Assistant and tables

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

- Our frontend uses the provided API endpoints to fetch live exchange rates and fee breakdowns, parsing and displaying them in real-time—and powering our conversational assistant.
- All API endpoints are configured in `.env` for secure, environment-based switching.
- When endpoints are unreachable, the application falls back to local static JSON so live questions and calculations always work.
- The AI assistant checks user intent, fetches or reads fallback data, and announces answers via both chat and voice for maximum clarity.

