# VitalSwap – Transparent FX Fees (React + Vite)

A lightweight, production-ready single-page site built with React 18 and Vite 5. It showcases transparent currency swap fees with a polished, professional UI, smooth page transitions, and dark mode support.

## Features

- Responsive, modern layout with semantic HTML
- Sticky header with scroll shadow and mobile navigation drawer
- Theme toggle with auto dark mode and manual override
- Professional motion system
  - Scroll-reveal animations via IntersectionObserver
  - Smooth hover/focus transitions across buttons, links, cards, and inputs
  - Animated calculator result values
  - Respects prefers-reduced-motion
- Sections: Hero, Fees, Calculator, Referrals, Rates, CTA, Footer
- Basic live rates poller scaffold (update endpoints as needed)
- Graceful asset fallbacks and error handling for images

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
    sections/
      Hero.jsx           # Intro section with illustration
      Fees.jsx           # Fee breakdown cards
      Calculator.jsx     # Fee calculator with animated results
      Referrals.jsx      # Referral cards and copy action
      Rates.jsx          # Live rates card with manual refresh
      Cta.jsx            # Call-to-action band
    App.jsx              # Page composition
    main.jsx             # App bootstrap, theme init, reveal init
    styles.css           # Global styles, transitions, themes
  vite.config.js         # Vite configuration
  package.json
```

## Transitions and Motion

- Scroll reveal: elements with class `reveal` fade/slide in when entering viewport. Initialized in `src/main.jsx`.
- Buttons, inputs, cards: consistent easing and hover/focus states.
- Calculator results: values pulse slightly on change (`.result-animate`).
- Reduced motion: all non-essential animations are disabled when users prefer reduced motion.

## Theming

- Auto-detects system theme on first load.
- Users can toggle theme via the header button; choice is stored in `localStorage` and applied to `document.documentElement` as `data-theme` (`light` or `dark`).
- Many styles adapt between light/dark using `[data-theme]` selectors.

## API Integration

This project ships with placeholders where you can wire in your real APIs.

- Rates endpoint placeholder in `src/sections/Rates.jsx`:
  - Update `endpoint` inside `fetchRate` or switch to an environment variable (see below).
- Calculator fees placeholder in `src/sections/Calculator.jsx`:
  - Update the `fetch('')/*Api*/` call in `handleCalculate` with your endpoint and adapt the parsing logic to your response shape.

### Using environment variables (recommended)

Vite exposes env vars prefixed with `VITE_` as `import.meta.env`. Create a `.env` (or `.env.local`) at the project root, for example:

```env
VITE_API_BASE_URL=https://api.example.com
```

Then in code:

```js
const endpoint = `${import.meta.env.VITE_API_BASE_URL}/rates`;
```

Remember to rebuild after changing environment variables.

## Accessibility

- Honors `prefers-reduced-motion` to limit animations
- Sufficient color contrast in both light and dark themes
- Focus styles on interactive controls
- Semantic markup and ARIA labels where appropriate

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
- Add/remove `reveal` classes to control which elements animate on scroll.
- Tweak easing and durations in `styles.css` (`cubic-bezier` curves used for a premium feel).

## License

MIT — Feel free to use and adapt for your own projects.
