import { createContext, useContext, useState, useEffect } from 'react'

const ModeContext = createContext()

export const MODES = {
  RECRUITER: 'recruiter',
  DEV: 'developer',
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio-mode') || MODES.RECRUITER
    }
    return MODES.RECRUITER
  })

  useEffect(() => {
    localStorage.setItem('portfolio-mode', mode)
  }, [mode])

  const toggleMode = () => {
    setMode(prev => prev === MODES.RECRUITER ? MODES.DEV : MODES.RECRUITER)
  }

  const isRecruiter = mode === MODES.RECRUITER
  const isDev = mode === MODES.DEV

  // Dynamic theme tokens
  const theme = isRecruiter
    ? {
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
      }
    : {
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
      }

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, isRecruiter, isDev, theme }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}
