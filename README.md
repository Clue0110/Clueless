# CluelessV2 — Portfolio

Dual-mode portfolio (Recruiter / Developer) built with React + Vite + Tailwind + Framer Motion.

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Opens at **http://localhost:5173**. Hot-reload is enabled — edits show instantly.

---

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

---

## Deploy to GitHub Pages

### Option A: Automatic (GitHub Actions — recommended)

The workflow at `.github/workflows/deploy.yml` auto-deploys on every push to `main`.

1. Push this repo to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/Clue0110/CluelessV2.git
   git branch -M main
   git push -u origin main
   ```

2. In your GitHub repo, go to **Settings → Pages**:
   - **Source**: select **GitHub Actions**

3. Every push to `main` will now auto-build and deploy.

### Option B: Manual (`gh-pages` branch)

```bash
npm run deploy
```

Then in **Settings → Pages**, set source to `gh-pages` branch.

---

## Custom Domain (`clueless.nyc`)

1. The file `public/CNAME` already contains `clueless.nyc`.
2. In your DNS provider, add:
   - **A records** pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or a **CNAME record**: `www` → `clue0110.github.io`
3. In repo **Settings → Pages → Custom domain**, enter `clueless.nyc` and check **Enforce HTTPS**.

---

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root — wraps ModeProvider
├── index.css                # Global styles, glassmorphism, scrollbar, grain
├── context/
│   └── ModeContext.jsx      # Recruiter/Dev mode state + theme tokens
├── data/
│   └── content.js           # All portfolio content (dual-mode text)
├── utils/
│   └── animations.js        # Framer Motion variants
├── hooks/
│   └── useInView.js         # Intersection Observer hook
├── components/
│   ├── Navbar.jsx           # Fixed nav with mode toggle
│   ├── ModeToggle.jsx       # 👔 / 🧑‍💻 switcher
│   ├── Section.jsx          # Reusable section wrapper
│   ├── TiltCard.jsx         # 3D tilt-on-hover card
│   ├── Tag.jsx              # Tech tag pill
│   ├── ParticleField.jsx    # Canvas particle background
│   └── AnimatedText.jsx     # Per-letter animation
└── sections/
    ├── Hero.jsx             # Animated hero with gradient orbs
    ├── About.jsx            # Bio + stat pills
    ├── Experience.jsx       # Timeline with expand/collapse
    ├── Projects.jsx         # 3D tilt project cards
    ├── Education.jsx        # Education cards with courses
    └── Contact.jsx          # Email copy + social links
```

---

## Modes

| Feature | 👔 Recruiter | 🧑‍💻 Developer |
|---------|-------------|--------------|
| **Font** | Inter (sans-serif) | JetBrains Mono |
| **Accent** | Violet (`#7c3aed`) | Green (`#22c55e`) |
| **Tone** | Professional XYZ format | Casual, conversational |
| **Section titles** | Title Case | `> lowercase_` with blinking cursor |
| **Bullet style** | Action-Result-Impact with metrics | First-person narrative, casual |
| **Particles** | Violet | Green |

Toggle between modes using the button in the navbar. Preference is saved to `localStorage`.

---

## Tech Stack

- **React 18** + **Vite 6**
- **Tailwind CSS 3** (utility-first)
- **Framer Motion 11** (animations)
- **react-icons** (Feather icons)
- **Canvas API** (particle field)
