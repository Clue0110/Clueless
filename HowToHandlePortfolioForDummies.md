# How To Handle Portfolio For Dummies

## Repo Structure

```
CluelessV2/
├── index.html                  # HTML entry point (meta tags, fonts, #root mount)
├── package.json                # Dependencies and build/deploy scripts
├── vite.config.js              # Build config (chunk splitting for three.js, framer-motion)
├── tailwind.config.js          # Custom Tailwind theme (recruiter/dev color palettes)
├── postcss.config.js           # PostCSS config (autoprefixer)
│
├── public/                     # Static assets — served as-is, no processing
│   ├── CNAME                   # Custom domain: clueless.nyc
│   ├── favicon.svg             # Browser tab icon
│   ├── ProfileImage.jpeg       # Profile photo used in Hero section
│   ├── resume.pdf              # ← DEFAULT RESUME (what the site links to)
│   └── resume/                 # Versioned resume archive
│       ├── v0/resume.pdf       # https://clueless.nyc/resume/v0/resume.pdf
│       ├── v1/resume.pdf       # https://clueless.nyc/resume/v1/resume.pdf
│       ├── v2/resume.pdf
│       ├── v3/resume.pdf
│       ├── v4/resume.pdf
│       ├── v5/resume.pdf
│       ├── v6/resume.pdf
│       ├── v7/resume.pdf
│       ├── v8/resume.pdf
│       └── v9/resume.pdf
│
└── src/
    ├── main.jsx                # React root — mounts App into #root
    ├── App.jsx                 # App shell — assembles all sections + providers
    ├── index.css               # Global styles (glassmorphism, scrollbar, grain, glow)
    │
    ├── context/
    │   └── ModeContext.jsx     # Global state: recruiter/dev mode, theme, showResume flag
    │
    ├── data/                   # ← ALL CONTENT LIVES HERE
    │   ├── content.js          # Portfolio content (experience, projects, education, bio)
    │   └── resume.js           # Resume modal content (formatted like a PDF)
    │
    ├── hooks/
    │   ├── useInView.js        # IntersectionObserver hook for scroll animations
    │   └── useIsMobile.js      # Responsive breakpoint hook (768px)
    │
    ├── utils/
    │   └── animations.js       # Reusable Framer Motion animation presets
    │
    ├── components/
    │   ├── Navbar.jsx          # Fixed nav bar with active section tracking + mode toggle
    │   ├── Section.jsx         # Reusable page section wrapper with title
    │   ├── ModeToggle.jsx      # Button to switch recruiter ↔ developer mode
    │   ├── AnimatedText.jsx    # Letter-by-letter text animation
    │   ├── Tag.jsx             # Small pill tag (used for tech stacks, courses)
    │   ├── TiltCard.jsx        # 3D tilt effect card on hover
    │   ├── TerminalAbout.jsx   # Terminal-style about section (dev mode only)
    │   ├── RecruiterStatPills.jsx  # Stats grid (recruiter mode only)
    │   ├── ParticleField.jsx   # Canvas floating particle background
    │   ├── Beams.jsx           # Three.js 3D beam shader (hero background)
    │   └── Beams.css           # Styles for Beams component
    │
    ├── sections/               # Page sections rendered in order in App.jsx
    │   ├── Hero.jsx            # Landing — name, tagline, CTA buttons, social links
    │   ├── About.jsx           # Bio (recruiter) or Terminal (dev)
    │   ├── Experience.jsx      # Work history timeline
    │   ├── Projects.jsx        # Project cards grid
    │   ├── Education.jsx       # Education cards
    │   └── Contact.jsx         # Email + social links CTA
    │
    └── pages/
        └── ResumePage.jsx      # Full-screen resume modal overlay
```

---

## How to Update the Resume

### 1. Replace the Default PDF (what the site uses)

Just drop your new PDF into `public/` and name it `resume.pdf`. Overwrite the existing file.

```
public/resume.pdf   ← replace this file
```

The site will automatically serve the new version. No code changes needed.

**Live link:** https://clueless.nyc/resume.pdf
**Download button in Resume modal:** also points here, downloads as `Resume_Venigalla.pdf`

---

### 2. Update the Resume Modal Content (the rendered in-page view)

The Resume modal (`ResumePage.jsx`) renders content from:

```
src/data/resume.js
```

Edit this file to update:
- Header / contact info
- Experience bullets
- Projects
- Skills (organized by category)
- Education

This is separate from the PDF — it's a React-rendered version of your resume inside the site.

**Where it's rendered:** `src/pages/ResumePage.jsx`

---

### 3. Update the Main Portfolio Sections

The cards on the portfolio pages (Experience timeline, Project cards, Education cards) pull from:

```
src/data/content.js
```

Every text field has two variants — one for recruiter mode, one for developer mode:

```js
// Example structure
experience[0].bullets.recruiter   // what recruiters see
experience[0].bullets.dev         // what devs see
```

Edit both variants when updating job bullets, project descriptions, etc.

---

## Versioned Resume Links

You have 10 version slots (`v0`–`v9`) for sharing specific resume versions with different people.

### How to use a version slot

1. Put your PDF in the desired version folder:
   ```
   public/resume/v3/resume.pdf
   ```
2. Deploy the site (see below)
3. Share the link:
   ```
   https://clueless.nyc/resume/v3/resume.pdf
   ```

### All version links

| Slot | Shareable Link |
|------|---------------|
| v0 | https://clueless.nyc/resume/v0/resume.pdf |
| v1 | https://clueless.nyc/resume/v1/resume.pdf |
| v2 | https://clueless.nyc/resume/v2/resume.pdf |
| v3 | https://clueless.nyc/resume/v3/resume.pdf |
| v4 | https://clueless.nyc/resume/v4/resume.pdf |
| v5 | https://clueless.nyc/resume/v5/resume.pdf |
| v6 | https://clueless.nyc/resume/v6/resume.pdf |
| v7 | https://clueless.nyc/resume/v7/resume.pdf |
| v8 | https://clueless.nyc/resume/v8/resume.pdf |
| v9 | https://clueless.nyc/resume/v9/resume.pdf |

> The default resume button on the site always points to `https://clueless.nyc/resume.pdf` — the version links are just for your convenience when sharing with specific people.

---

## How to Deploy

```bash
npm run build     # builds the site
npm run deploy    # pushes to GitHub Pages (gh-pages branch)
```

The site is live at **https://clueless.nyc** via the custom domain in `public/CNAME`.
