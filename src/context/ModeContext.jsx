import { createContext, useContext, useState, useEffect } from 'react'

const ModeContext = createContext()

export const MODES = {
  RECRUITER: 'recruiter',
  DEV: 'developer',
  CLUELESS: 'clueless',
}

// Cycle order for the toggle.
const ORDER = [MODES.RECRUITER, MODES.DEV, MODES.CLUELESS]

// Tailwind class-name tokens per mode. Components interpolate these rather than
// hardcoding colors, so adding a mode here makes the whole UI react to it.
const THEMES = {
  [MODES.RECRUITER]: {
    bg: 'bg-[#0a0a0f]',
    card: 'bg-[#12121a]',
    border: 'border-[#1e1e2e]',
    accent: 'text-violet-500',
    accentBg: 'bg-violet-500',
    accentBorder: 'border-violet-500',
    accentHover: 'hover:bg-violet-600',
    accentGlow: 'glow-recruiter',
    gradientText: 'gradient-text-recruiter',
    text: 'text-slate-200',
    muted: 'text-slate-400',
    tagBg: 'bg-violet-500/10',
    tagText: 'text-violet-300',
    tagBorder: 'border-violet-500/20',
    ring: 'ring-violet-500/30',
    font: 'font-sans',
  },
  [MODES.DEV]: {
    bg: 'bg-[#0d1117]',
    card: 'bg-[#161b22]',
    border: 'border-[#21262d]',
    accent: 'text-green-500',
    accentBg: 'bg-green-500',
    accentBorder: 'border-green-500',
    accentHover: 'hover:bg-green-600',
    accentGlow: 'glow-dev',
    gradientText: 'gradient-text-dev',
    text: 'text-gray-200',
    muted: 'text-gray-400',
    tagBg: 'bg-green-500/10',
    tagText: 'text-green-300',
    tagBorder: 'border-green-500/20',
    ring: 'ring-green-500/30',
    font: 'font-mono',
  },
  // Clueless — the pet's own playful, warm amber persona.
  [MODES.CLUELESS]: {
    bg: 'bg-[#100a04]',
    card: 'bg-[#1b1206]',
    border: 'border-[#2a1c0c]',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500',
    accentBorder: 'border-amber-500',
    accentHover: 'hover:bg-amber-600',
    accentGlow: 'glow-clueless',
    gradientText: 'gradient-text-clueless',
    text: 'text-amber-50',
    muted: 'text-amber-200/60',
    tagBg: 'bg-amber-500/10',
    tagText: 'text-amber-300',
    tagBorder: 'border-amber-500/20',
    ring: 'ring-amber-500/30',
    font: 'font-mono',
  },
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-mode')
      if (saved && ORDER.includes(saved)) return saved
    }
    return MODES.RECRUITER
  })
  const [showResume, setShowResume] = useState(false)
  // The chat window is opened by tapping the roaming pet (CluelessPet), so the
  // open state lives here where both components can reach it.
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    localStorage.setItem('portfolio-mode', mode)
  }, [mode])

  const toggleMode = () => setMode((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length])

  const isRecruiter = mode === MODES.RECRUITER
  const isDev = mode === MODES.DEV
  const isClueless = mode === MODES.CLUELESS

  const theme = THEMES[mode] || THEMES[MODES.RECRUITER]

  return (
    <ModeContext.Provider
      value={{ mode, setMode, toggleMode, isRecruiter, isDev, isClueless, theme, showResume, setShowResume, showChat, setShowChat }}
    >
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}
