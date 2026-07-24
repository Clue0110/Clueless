# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at http://localhost:5173 (hot reload)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run deploy    # build + push to gh-pages branch (manual deploy)
```

There is no linter, test runner, or type-checker configured — the project is plain JSX (no TypeScript despite `@types/react` being present).

## Deployment

Two deploy paths, both to GitHub Pages serving the custom domain **clueless.nyc** (set in `public/CNAME`):

- **Automatic** — `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
- **Manual** — `npm run deploy` pushes `dist/` to the `gh-pages` branch.

## Architecture

Single-page React portfolio. The organizing idea is a **dual-mode system**: every piece of UI and copy has a *Recruiter* variant (👔, violet, Inter font, polished metrics-driven language) and a *Developer* variant (🧑‍💻, green, JetBrains Mono, casual first-person). Mode is global state, persisted to `localStorage`.

### Mode + theming (the core pattern)

`src/context/ModeContext.jsx` is the source of truth. `useMode()` exposes:
- `mode`, `isRecruiter`, `isDev`, `toggleMode`
- `theme` — an object of **Tailwind class-name strings** (`theme.bg`, `theme.accent`, `theme.card`, `theme.font`, etc.) that swap wholesale between the two modes
- `showResume` / `setShowResume` — controls the resume modal overlay

Components style themselves by interpolating `theme.*` tokens into `className` rather than hardcoding colors. When adding UI, follow this: pull tokens from `useMode()` so the component reacts to mode switches automatically. `App.jsx` also toggles a top-level `mode-recruiter` / `mode-dev` class that CSS in `src/index.css` hooks into (glassmorphism, glow, grain overlay, gradient text).

Note: `tailwind.config.js` defines `recruiter.*` / `dev.*` color palettes, but most components use the arbitrary-value hex classes from `theme` tokens instead. Both coexist.

### Content is data, not markup

**All portfolio copy lives in `src/data/`** — do not hardcode text in components:
- `content.js` — Hero/About/Experience/Projects/Education/Contact. Text fields are objects with `.recruiter` and `.dev` variants (e.g. `experience[0].bullets.recruiter` vs `.dev`). **Edit both variants** when changing copy.
- `resume.js` — content for the in-page resume modal (`src/pages/ResumePage.jsx`), a React-rendered resume separate from the PDF.

`Info.yaml` is a standalone structured résumé data dump; it is **not** imported by the app.

### Structure

- `src/sections/` — the page sections, rendered in fixed order in `App.jsx`: Hero → About → Experience → Projects → Education → Contact.
- `src/components/` — reusable pieces. Some are mode-specific: `TerminalAbout` (dev About), `RecruiterStatPills` (recruiter About). `Beams.jsx` is a Three.js shader hero background; `ParticleField.jsx` is a Canvas particle layer.
- `src/hooks/` — `useInView` (IntersectionObserver scroll animations), `useIsMobile` (768px breakpoint).
- `src/utils/animations.js` — shared Framer Motion variant presets.

### Resume PDFs

Live PDFs served from `public/`:
- `public/resume.pdf` — the default the site links to (download button → `clueless.nyc/resume.pdf`). Replace this file to update; no code change needed.
- `public/resume/v0`–`v9/resume.pdf` — versioned slots for sharing specific versions (`clueless.nyc/resume/vN/resume.pdf`).

## Stack

React 19, Vite 6, Tailwind CSS 3, Framer Motion 11, Three.js (`@react-three/fiber` + `drei`), react-icons. `vite.config.js` manually chunks `three` and `framer-motion` into separate vendor bundles.
