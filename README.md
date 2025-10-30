# VitalSwap – Transparent FX Fees (React + Vite)

A lightweight, production-ready single-page site built with React 18 and Vite 5. It showcases transparent currency swap fees with a polished, professional UI, smooth page transitions, and dark mode support.

## Features

- Responsive, modern layout with semantic HTML
- Sticky header with scroll shadow and mobile navigation drawer
- Theme toggle with auto dark mode and manual override
- Professional motion system
  - **Global reveal and fade animations**: All major sections, cards, and blocks animate in with IntersectionObserver and staggered fade/slide transitions.
  - Animated calculator result values
  - Respects prefers-reduced-motion for accessibility
- **Sections:** Hero, Fees, Calculator, Referrals, Rates, CTA, Footer
- **Floating Assistant:** Mobile-friendly floating AI/chat assistant with responsive pop panel and dark mode support
- Live fee/rates tables with switch tabs (Customer/Business)
- All endpoints are environment-driven (no hardcoded API URLs), easily configured for hackathons or production
- Graceful asset fallbacks and error handling for images

## Demo Quick Guide

- **Page Animations:**
  - Scroll down—the hero, fee cards, calculator, rates, and other major blocks will gracefully fade/slide into view. Animations run only once as each element enters the viewport.
  - If your OS/browser prefers reduced motion, all effects are automatically disabled for accessibility.

- **Dark Mode:**
  - Click the theme toggle in the header. the entire UI—including Fee breakdowns, tables, cards, and the Floating Assistant—adapts backgrounds, borders, and text for a beautiful night mode.

- **Floating Assistant:**
  - Tap the bottom-right AI button to reveal the chat. Try on your phone or mobile emulator; the chat panel and controls scale and reflow for all mobile sizes.

## Tech Stack

- React 18
- Vite 5 (dev server and build)
- Vanilla CSS (no external UI framework)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended for Vite 5)
- npm 9+ (bundled with Node)

### Installation

```bash
npm install
```

### Development

Start the local dev server (with HMR):

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`).

### Build

Create an optimized production build in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
root/
  assets/                # Source assets (fonts, images)
  public/                # Static assets served as-is
  src/
    components/
      Header.jsx         # Sticky header, theme toggle, mobile menu
      Footer.jsx         # Footer with links and social icons
      FloatingAssistant.jsx # Responsive floating AI/chat assistant
    sections/
      Hero.jsx           # Intro section with illustration
      Fees.jsx           # Fee breakdown cards + live fee tables
      Calculator.jsx     # Fee calculator with animated results
      Referrals.jsx      # Referral cards and copy action
      Rates.jsx          # Live rates card with manual refresh
      Cta.jsx            # Call-to-action band
    App.jsx              # Page composition
    main.jsx             # App bootstrap, theme init, reveal init, motion
    styles.css           # Global styles, transitions, reveal utilities, themes
  vite.config.js         # Vite configuration
  package.json
```

## Animations, Transitions, and Motion

- **Scroll reveal:** Elements with `reveal` and `animate-in` classes fade-in/slide as they enter viewport, using IntersectionObserver and staggered delays.
- **Utilities:** Use `.animate-in`, `.animate-in-left`, `.animate-in-right`, etc. for explicit animations in your HTML/JS.
- **Buttons, inputs, cards:** Consistent easing and hover/focus states.
- **Calculator results:** Values pulse slightly on change (`.result-animate`).
- **Reduced motion:** All non-essential animations disabled when users prefer reduced motion.

## Theming

- Auto-detects system theme on first load.
- Users can toggle theme via the header button; choice is stored in `localStorage` and applied to `document.documentElement` as `data-theme` (`light` or `dark`).
- All main sections—including live fee tabs, tables, cards, and Floating Assistant—adapt their backgrounds, borders, text, and highlight colors for dark mode.

## API Integration

**Environment variables are used for all endpoints** (preferred for hackathons & production).

- Set VITE_FEE_API and VITE_EXCHANGE_API (and other endpoints as needed) in your `.env` file:

```env
VITE_FEE_API=https://your-api.com/fee
VITE_EXCHANGE_API=https://your-api.com/exchange
```

- Reference them in code as `import.meta.env.VITE_FEE_API` etc. No API is hardcoded anywhere—just update your .env and restart the dev server.

## Accessibility

- Honors `prefers-reduced-motion` to limit animations
- Sufficient color contrast in both light and dark themes
- Focus styles on interactive controls
- Semantic markup, ARIA labels, and keyboard navigation in complex widgets

## Deployment

This is a purely static site once built; you can deploy the `dist/` folder to any static hosting provider:

- GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, etc.

If deploying under a sub-path (e.g., `https://example.com/vitalswap/`), set `base` in `vite.config.js`:

```js
export default defineConfig({
  base: '/vitalswap/',
});
```

## Assets & Fonts

- Custom Gilroy fonts are included under `assets/fonts/` and loaded via `@font-face` in `styles.css`.
- Images and placeholders live in `assets/` and `public/assets/`. Components include `onError` fallbacks for robustness.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – preview `dist/` locally

## Customization Tips

- Colors, radii, and sizing variables are centralized at the top of `styles.css` under `:root`.
- Add/remove `reveal` or `animate-in` classes to control which elements animate on scroll.
- Tweak easing and durations in `styles.css` (`cubic-bezier` curves used for a premium feel).
- FloatingAssistant.jsx can be positioned, themed, or extended easily from within `src/components`.

## License

MIT — Feel free to use and adapt for your own projects.
