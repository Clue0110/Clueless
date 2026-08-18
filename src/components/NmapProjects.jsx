import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { projects } from '../data/content'

// Ports kept in ascending order so the scan output reads like real nmap
const PORTS = {
  WeaveAI: '4242/tcp',
  VibeTrader: '6379/tcp',
  WelcomeHome: '8080/tcp',
  Teddy: '31337/tcp',
}

// "WeaveAI" → "weave-ai"
function serviceName(title) {
  return title.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// Shared column layout for the header row and every service row
const GRID = 'grid grid-cols-[4.5rem_3rem_1fr] sm:grid-cols-[6rem_4rem_1fr] gap-x-2 sm:gap-x-4'

// One line of NSE-script-style output: gutter bar + content
function Nse({ bar = '|', pad = false, children }) {
  return (
    <div className="flex leading-6">
      <span className="w-7 shrink-0 select-none text-gray-600">{bar}</span>
      <span className={`min-w-0 ${pad ? 'pl-4' : ''}`}>{children}</span>
    </div>
  )
}

function ServiceRow({ project, index }) {
  const [open, setOpen] = useState(false)
  const service = serviceName(project.title)
  const version = project.tags.slice(0, 3).join('/').toLowerCase()

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${GRID} w-full min-h-8 rounded-sm px-1 -mx-1 text-left leading-6 transition-colors hover:bg-white/5`}
      >
        <span className="text-green-400">{PORTS[project.title] ?? `${8080 + index}/tcp`}</span>
        <span className="text-green-400">open</span>
        <span className="text-gray-200">
          {service}
          <span className="break-all text-gray-600">{'  '}{version}</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="fingerprint"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-0.5 py-1.5">
              <Nse><span className="text-violet-300">service-info:</span></Nse>
              <Nse pad><span className="text-gray-400">{project.description.dev}</span></Nse>
              <Nse><span className="text-violet-300">highlights:</span></Nse>
              {project.bullets.dev.map((bullet, i) => (
                <Nse key={i} pad>
                  <span className="flex gap-2">
                    <span className="shrink-0 select-none text-gray-600">-</span>
                    <span className="text-gray-300">{bullet}</span>
                  </span>
                </Nse>
              ))}
              <Nse>
                <span className="text-violet-300">stack: </span>
                <span className="text-amber-300">{project.tags.join(', ').toLowerCase()}</span>
              </Nse>
              <Nse bar="|_">
                <span className="text-violet-300">repo: </span>
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-green-400 underline decoration-green-400/40 transition-colors hover:text-green-300"
                  >
                    {project.link.replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-gray-500">private — ask me about it</span>
                )}
              </Nse>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function NmapProjects() {
  const [ref, inView] = useInView({ threshold: 0.05 })
  const [revealed, setRevealed] = useState(0)

  // Reveal order: command, 3 preamble lines, table header, one step per
  // project row, then the two footer lines and the trailing prompt.
  // Row delays are deliberately irregular so ports "land" like a real scan.
  const rowDelays = [450, 250, 550, 300]
  const delays = [
    300, 350, 200, 150, 400,
    ...projects.map((_, i) => rowDelays[i % rowDelays.length]),
    350, 150, 300,
  ]
  const total = delays.length

  useEffect(() => {
    if (!inView) return
    if (revealed >= total) return

    let cumulative = 0
    const timers = delays.map((delay, i) => {
      cumulative += delay
      return setTimeout(() => setRevealed(i + 1), cumulative)
    })
    return () => timers.forEach(clearTimeout)
  }, [inView])

  const show = (idx) => revealed > idx
  const rowsStart = 5

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
        <span className="ml-3 text-xs text-gray-500 font-mono">akilesh@clueless ~ nmap</span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-xs sm:text-sm leading-6 min-h-[380px]">
        {show(0) && (
          <div>
            <span className="text-green-400">❯</span>{' '}
            <span className="text-gray-200">nmap -sV --script side-quests clueless.nyc</span>
          </div>
        )}
        {show(1) && <div className="text-gray-500">Starting Nmap 7.95 ( https://nmap.org )</div>}
        {show(2) && (
          <div className="text-gray-400">
            Nmap scan report for <span className="text-gray-200">clueless.nyc</span> (100.64.13.37)
          </div>
        )}
        {show(3) && <div className="text-gray-500">Host is up (0.0042s latency).</div>}
        {show(4) && (
          <div className={`${GRID} mt-4 px-1 -mx-1 text-gray-500`}>
            <span>PORT</span>
            <span>STATE</span>
            <span>SERVICE{'  '}VERSION</span>
          </div>
        )}

        {projects.map((project, i) => (
          show(rowsStart + i) && (
            <ServiceRow key={project.title} project={project} index={i} />
          )
        ))}

        {show(rowsStart + projects.length) && (
          <div className="mt-4 text-gray-500">
            Service detection performed. All services handcrafted — no CVEs (probably).
          </div>
        )}
        {show(rowsStart + projects.length + 1) && (
          <div className="text-gray-400">
            Nmap done: 1 IP address (1 host up) — {projects.length} services fingerprinted in 3.14s
          </div>
        )}
        {show(rowsStart + projects.length + 2) && (
          <div className="mt-4 inline-flex items-center gap-1">
            <span className="text-green-400">❯</span>
            <span className="w-2 h-4 bg-green-400 animate-pulse inline-block" />
          </div>
        )}
      </div>
    </div>
  )
}
