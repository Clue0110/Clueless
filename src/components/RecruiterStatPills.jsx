import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

// The four at-a-glance stats at the top of recruiter mode. One shared card
// anatomy — count-up number, mono small-caps label, hairline, then one detail
// line with a little personality — so the row reads as a set, not four
// competing widgets.

// ── Count-up number ────────────────────────────────────────────────────────
function CountUp({ to, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setVal,
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
      <span className="text-violet-400">{suffix}</span>
    </span>
  )
}

// ── Sparkline (draws itself in on scroll) ──────────────────────────────────
function Sparkline() {
  const points = [0, 12, 8, 18, 14, 22, 20, 28, 25, 32, 30, 38]
  const w = 120
  const h = 34
  const max = Math.max(...points)
  const coords = points.map((p, i) => [(i / (points.length - 1)) * w, h - (p / max) * (h - 3)])
  const d = 'M ' + coords.map(([x, y]) => `${x},${y}`).join(' L ')
  const [lx, ly] = coords[coords.length - 1]

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w},${h} L 0,${h} Z`} fill="url(#sparkFill)" />
      <motion.path
        d={d}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx={lx}
        cy={ly}
        r="2.5"
        fill="#a78bfa"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.3 }}
      />
    </svg>
  )
}

// ── Company chips (brand color on hover) ───────────────────────────────────
const COMPANIES = [
  { name: 'Tesla', color: '#e31937' },
  { name: 'Citrix', color: '#00a1e0' },
  { name: 'NYU', color: '#8b5cf6' },
  { name: 'Samsung', color: '#4263eb' },
  { name: 'Virtusa', color: '#e63312' },
]

function CompanyChip({ name, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-default rounded-full border px-2 py-0.5 font-mono text-[10px] transition-all duration-300"
      style={{
        borderColor: hovered ? color : 'rgba(255,255,255,0.08)',
        color: hovered ? color : '#8b93a7',
        background: hovered ? `${color}14` : 'transparent',
      }}
    >
      {name}
    </span>
  )
}

// ── Shared card shell ──────────────────────────────────────────────────────
function StatCard({ index, number, label, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#1e1e2e] bg-[#12121a]/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30"
    >
      {/* hairline shimmer along the top edge on hover */}
      <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="text-[2rem] font-bold leading-none tracking-tight text-slate-100">{number}</div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="my-3.5 border-t border-white/5" />
      <div className="mt-auto">{children}</div>
    </motion.div>
  )
}

// ── Exported grid ──────────────────────────────────────────────────────────
export default function RecruiterStatPills() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
      <StatCard index={0} number={<CountUp to={4.2} decimals={1} suffix="+" />} label="Years of Experience">
        <Sparkline />
      </StatCard>

      <StatCard index={1} number={<CountUp to={5} />} label="Companies">
        <div className="flex flex-wrap gap-1.5">
          {COMPANIES.map((c) => (
            <CompanyChip key={c.name} {...c} />
          ))}
        </div>
      </StatCard>

      <StatCard index={2} number={<CountUp to={3.5} decimals={1} suffix="M+" />} label="Daily Active Users">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live systems, serving traffic now
        </div>
        <div className="mt-1.5 text-[11px] text-slate-600">≈ the population of Madrid</div>
      </StatCard>

      <StatCard index={3} number={<CountUp to={27} suffix="+" />} label="Features in Production">
        <div className="text-[11px] leading-relaxed text-slate-500">
          Supercharger wait-time forecasts · Robotaxi surge pricing · WAF security engine
        </div>
      </StatCard>
    </div>
  )
}
