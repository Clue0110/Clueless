import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import ModeToggle from './ModeToggle'

const NAV_ITEMS = [
  { label: 'About',      devLabel: 'about',      href: '#about' },
  { label: 'Experience', devLabel: 'experience', href: '#experience' },
  { label: 'Projects',   devLabel: 'projects',   href: '#projects' },
  { label: 'Education',  devLabel: 'education',  href: '#education' },
  { label: 'Contact',    devLabel: 'contact',    href: '#contact' },
]

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'education', 'contact']

export default function Navbar() {
  const { isRecruiter, isClueless, theme } = useMode()
  const [activeSection, setActiveSection] = useState('hero')
  const [navVisible, setNavVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lastY, setLastY] = useState(0)

  // ── Active section via IntersectionObserver ──────────────────────────
  useEffect(() => {
    const observers = []
    const sectionVisibility = {}

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          sectionVisibility[id] = entry.intersectionRatio
          const best = Object.entries(sectionVisibility).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ['hero', 0],
          )
          setActiveSection(best[0])
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-80px 0px -20% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // ── Hide on scroll down, show on scroll up ───────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setNavVisible(y < lastY || y < 100)
      setLastY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  const accentBg = isRecruiter ? 'rgba(124,58,237,0.15)' : isClueless ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)'
  const accentDot = isRecruiter ? '#7c3aed' : isClueless ? '#f59e0b' : '#22c55e'

  return (
    <motion.div
      initial={{ y: -120 }}
      animate={{ y: navVisible ? 0 : -120 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 ${theme.font}`}
    >
      {/* ── Pill glass navbar ── */}
      <nav
        className="flex items-center justify-between gap-4 px-5 py-2.5 w-full max-w-3xl rounded-full border border-white/10 transition-colors duration-700"
        style={{
          backgroundColor: 'rgba(14,14,22,0.65)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        {/* Logo */}
        <motion.a
          href="#hero"
          whileHover={{ scale: 1.05 }}
          className={`flex min-h-11 items-center text-base font-bold ${theme.accent} whitespace-nowrap transition-colors duration-500`}
        >
          {'clueless'}
        </motion.a>

        {/* Desktop links (hidden in clueless mode — the cat drives navigation) */}
        <div className={`hidden ${isClueless ? '' : 'md:flex'} items-center gap-1`}>
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.replace('#', '')
            const isActive = activeSection === sectionId
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
                  isActive ? theme.text : theme.muted
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: accentBg }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {isRecruiter ? item.label : item.devLabel}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: accentDot }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            )
          })}
        </div>

        {/* Right: mode toggle + mobile burger */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`${isClueless ? 'hidden' : 'md:hidden'} ${theme.muted} flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/5 transition-colors`}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobileOpen
                ? <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></>
                : <><line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="11" x2="17" y2="11" /><line x1="3" y1="16" x2="17" y2="16" /></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && !isClueless && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-4 right-4 rounded-2xl border border-white/10 overflow-hidden"
            style={{
              backgroundColor: 'rgba(10,10,18,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col p-3 gap-1">
              {NAV_ITEMS.map((item) => {
                const sectionId = item.href.replace('#', '')
                const isActive = activeSection === sectionId
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-11 items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors duration-200 ${
                      isActive
                        ? isRecruiter
                          ? 'bg-violet-500/15 text-violet-300'
                          : 'bg-green-500/15 text-green-300'
                        : `${theme.muted} hover:bg-white/5`
                    }`}
                  >
                    {isRecruiter ? item.label : item.devLabel}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentDot }} />
                    )}
                  </a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
