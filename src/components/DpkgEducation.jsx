import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { education } from '../data/content'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// gpa "3.9 / 4.0" → version "3.9"
const version = (gpa) => gpa.split('/')[0].trim()

// Ticks up to 65% and stalls there — degree still installing, ETA deliberately vague
function InstallBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setPct((p) => (p >= 65 ? p : p + 1)), 30)
    return () => clearInterval(id)
  }, [])
  const filled = Math.round((pct / 100) * 22)
  return (
    <div className="pl-6 text-gray-500">
      Unpacking… <span className="text-green-400">{'█'.repeat(filled)}</span>
      {'░'.repeat(22 - filled)} {pct}% <span className="text-gray-600">(ETA: when it's done)</span>
    </div>
  )
}

function Pkg({ edu }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-1 pb-4">
      {/* dpkg row: status  name  version  description */}
      <div className="flex flex-wrap items-baseline gap-x-3 leading-6">
        <span className={edu.inProgress ? 'text-yellow-400' : 'text-green-400'}>
          {edu.inProgress ? 'iU' : 'ii'}
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="min-h-8 text-cyan-400 underline decoration-dotted underline-offset-4 transition-colors hover:text-cyan-300"
        >
          {edu.pkg}
        </button>
        <span className="text-amber-300">{version(edu.gpa)}</span>
        <span className="text-gray-400">
          {edu.degree} <span className="text-gray-600">—</span> {edu.school}
        </span>
      </div>

      {edu.inProgress && <InstallBar />}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="show"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-1 pl-6 pt-1">
              <div className="text-gray-500">
                <span className="text-green-400">❯</span>{' '}
                <span className="text-gray-200">apt show {edu.pkg}</span>
              </div>
              <div className="text-gray-400">
                <span className="text-gray-600">Maintainer:</span> {edu.school} &lt;{edu.location}&gt;
              </div>
              <div className="text-gray-400">
                <span className="text-gray-600">Version:</span> {edu.gpa.replace(/\s/g, '')} GPA
              </div>
              <div className="text-gray-400 break-words">
                <span className="text-gray-600">Depends:</span>{' '}
                {edu.courses.map((c, i) => (
                  <span key={c}>
                    <span className="text-cyan-400/80">{slug(c)}</span>
                    {i < edu.courses.length - 1 && <span className="text-gray-600">, </span>}
                  </span>
                ))}
              </div>
              {edu.honors.length > 0 && (
                <div className="text-gray-400">
                  <span className="text-gray-600">Tags:</span>{' '}
                  {edu.honors.map((h, i) => (
                    <span key={h}>
                      <span className="text-amber-300/90">{slug(h)}</span>
                      {i < edu.honors.length - 1 && <span className="text-gray-600">, </span>}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-gray-400">
                <span className="text-gray-600">Description:</span>{' '}
                <span className="text-green-300/80">{edu.highlight.dev}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DpkgEducation() {
  const [ref, inView] = useInView({ threshold: 0.05 })
  const [revealed, setRevealed] = useState(0)
  // command + header + one step per package + trailing prompt
  const total = education.length + 3

  useEffect(() => {
    if (!inView) return
    if (revealed >= total) return

    let cumulative = 0
    const timers = []
    for (let i = 0; i < total; i++) {
      cumulative += i === 0 ? 300 : 140
      timers.push(setTimeout(() => setRevealed(i + 1), cumulative))
    }
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden border border-[#21262d] shadow-2xl"
      style={{ background: '#0d1117' }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d]"
        style={{ background: '#161b22' }}
      >
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-gray-500 font-mono">akilesh@clueless ~ dpkg</span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-xs sm:text-sm leading-6 min-h-[240px]">
        {revealed > 0 && (
          <div className="mb-3">
            <span className="text-green-400">❯</span>{' '}
            <span className="text-gray-200">dpkg -l | grep education</span>
          </div>
        )}

        {revealed > 1 && (
          <div className="mb-3 text-gray-600 overflow-x-auto whitespace-pre">
            <div>Desired=Unknown/Install/Remove | Status=Installed/Unpacked</div>
            <div>{'||/ Name          Version   Description'}</div>
          </div>
        )}

        {education.map((edu, i) => (
          revealed > i + 2 && <Pkg key={edu.pkg} edu={edu} />
        ))}

        {revealed >= total && (
          <div className="inline-flex items-center gap-1">
            <span className="text-green-400">❯</span>
            <span className="w-2 h-4 bg-green-400 animate-pulse inline-block" />
          </div>
        )}
      </div>
    </div>
  )
}
