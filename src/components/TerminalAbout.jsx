import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'

// ── Syntax colours ──────────────────────────────────────────────────────────
const K = ({ c }) => <span className="text-violet-300">"{c}"</span>      // json key
const S = ({ c }) => <span className="text-amber-300">"{c}"</span>       // string val
const N = ({ c }) => <span className="text-blue-400">{c}</span>          // number val
const P = ({ c }) => <span className="text-green-400">{c}</span>         // prompt $
const Cm = ({ c }) => <span className="text-gray-500 italic">{c}</span>  // comment
const B = ({ c }) => <span className="text-gray-300">{c}</span>          // brace / bracket

// ── Terminal lines definition ───────────────────────────────────────────────
// Each entry: { node: JSX, delay(ms after prev line) }
const LINES = [
  { delay: 300,  node: <><P c="❯" /> <span className="text-gray-200">whoami</span></> },
  { delay: 180,  node: <Cm c="// hey, i'm akilesh — i write code that moves cars &amp; secures the web" /> },
  { delay: 70,   node: <Cm c="// nyu cs · 4+ yrs shipped · currently @ tesla" /> },
  { delay: 70,   node: <Cm c="// when i'm not shipping, i'm probably breaking something fun" /> },
  { delay: 220,  node: null }, // blank
  { delay: 300,  node: <><P c="❯" /> <span className="text-gray-200">cat highlights.json</span></> },
  { delay: 80,   node: <B c="{" /> },
  // years of experience
  { delay: 70,   node: <><span className="text-gray-500">{'  '}</span><K c="years_experience" /><span className="text-gray-400"> : </span><S c="4+ years of experience" /><span className="text-gray-500">,</span></> },
  // companies
  { delay: 70,   node: <><span className="text-gray-500">{'  '}</span><K c="companies" /><span className="text-gray-400">       : </span><B c="[" /><S c="Tesla" /><span className="text-gray-500">, </span><S c="Citrix" /><span className="text-gray-500">, </span><S c="NYU IT" /><span className="text-gray-500">, </span><S c="Samsung" /><span className="text-gray-500">, </span><S c="Virtusa" /><B c="]" /><span className="text-gray-500">,</span></> },
  // dau
  { delay: 70,   node: <><span className="text-gray-500">{'  '}</span><K c="daily_active_users" /><span className="text-gray-400">: </span><S c="3.5M+" /><span className="text-gray-500">,</span></> },
  // features shipped
  { delay: 70,   node: <><span className="text-gray-500">{'  '}</span><K c="features_shipped" /><span className="text-gray-400">  : </span><N c="27" /><span className="text-gray-500">,</span></> },
  { delay: 70,   node: <><span className="text-gray-500">{'  '}</span><K c="highlights" /><span className="text-gray-400">       : </span><B c="[" /></> },
  { delay: 70,   node: <><span className="text-gray-500">{'    '}</span><S c="supercharging wait-time forecasts" /><span className="text-gray-500">,</span></> },
  { delay: 70,   node: <><span className="text-gray-500">{'    '}</span><S c="robotaxi surge pricing engine" /><span className="text-gray-500">,</span></> },
  { delay: 70,   node: <><span className="text-gray-500">{'    '}</span><S c="WAF recommendation microservice" /><span className="text-gray-500">,</span></> },
  { delay: 70,   node: <><span className="text-gray-500">{'    '}</span><S c="robotaxi payments kafka pipeline" /><span className="text-gray-500">,</span></> },
  { delay: 70,   node: <><span className="text-gray-500">{'    '}</span><S c="and many more..." /></> },
  { delay: 60,   node: <><span className="text-gray-500">{'  '}</span><B c="]" /></> },
  { delay: 60,   node: <B c="}" /> },
  { delay: 220,  node: null }, // blank
  { delay: 400,  node: <span className="inline-flex items-center gap-1"><P c="❯" /> <span className="w-2 h-4 bg-green-400 animate-pulse inline-block" /></span> },
]

export default function TerminalAbout() {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (revealed >= LINES.length) return

    let cumulative = 0
    const timers = LINES.map((line, i) => {
      cumulative += line.delay
      return setTimeout(() => setRevealed(i + 1), cumulative)
    })

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
        <span className="ml-3 text-xs text-gray-500 font-mono">akilesh@clueless ~ zsh</span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-sm leading-6 min-h-[380px]">
        {LINES.slice(0, revealed).map((line, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap"
            style={{ minHeight: '1.5rem' }}
          >
            {line.node ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}
