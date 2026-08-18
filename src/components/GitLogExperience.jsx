import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { experience } from '../data/content'

// FNV-1a over company+role → stable fake git short-hash, so each job keeps
// the same hash across renders and deploys (and near-identical roles like
// "software engineer 1"/"2" still get visibly different hashes)
function fakeHash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0').slice(0, 7)
}

// "Citrix (Cloud Software Group)" → "citrix", "NYU IT – High Speed…" → "nyu-it"
function commitScope(company) {
  return company
    .toLowerCase()
    .split(/[–(]/)[0]
    .trim()
    .replace(/[^a-z0-9&\s]/g, '')
    .replace(/\s+/g, '-')
}

function Commit({ job, isHead, isLast }) {
  const [open, setOpen] = useState(false)
  const hash = fakeHash(job.company + job.role)
  const scope = commitScope(job.company)

  return (
    <div className="relative pl-6 pb-5">
      {/* Graph node + edge down to the next commit */}
      <span className="absolute left-0 top-0 font-bold leading-6" style={{ color: job.color }}>*</span>
      {!isLast && (
        <span className="absolute left-[4px] top-5 bottom-0 w-px bg-[#30363d]" />
      )}

      <div className="space-y-1">
        <div className="leading-6">
          <span className="text-amber-300">{hash}</span>{' '}
          {isHead && (
            <span className="text-gray-500">
              (<span className="text-cyan-400">HEAD -&gt; </span>
              <span style={{ color: job.color }}>{scope}</span>){' '}
            </span>
          )}
          <span className="text-gray-200">
            feat(<span style={{ color: job.color }}>{scope}</span>): {job.role.toLowerCase()}
          </span>
        </div>

        <div className="leading-6 text-gray-500">
          Date: {job.period} · {job.location}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="block min-h-8 text-left leading-6 text-green-400 transition-colors hover:text-green-300"
        >
          {open
            ? <>❯ q <span className="text-gray-600"># close</span></>
            : <>❯ git show {hash}</>}
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="diff"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-1 pt-1">
                <div className="text-gray-500">diff --git a/{scope} b/{scope}</div>
                {job.bullets.dev.map((bullet, i) => (
                  <div key={i} className="flex gap-2 rounded-sm bg-green-500/[0.07] px-1.5 py-0.5">
                    <span className="shrink-0 select-none text-green-400">+</span>
                    <span className="leading-relaxed text-green-300/80">{bullet}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function GitLogExperience() {
  const [ref, inView] = useInView({ threshold: 0.05 })
  const [revealed, setRevealed] = useState(0)
  // command line + one step per commit + trailing prompt
  const total = experience.length + 2

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
        <span className="ml-3 text-xs text-gray-500 font-mono">akilesh@clueless ~/career git log</span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-xs sm:text-sm leading-6 min-h-[420px]">
        {revealed > 0 && (
          <div className="mb-4">
            <span className="text-green-400">❯</span>{' '}
            <span className="text-gray-200">git log --graph --all</span>
          </div>
        )}

        {experience.map((job, i) => (
          revealed > i + 1 && (
            <Commit
              key={job.company + job.role}
              job={job}
              isHead={i === 0}
              isLast={i === experience.length - 1}
            />
          )
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
