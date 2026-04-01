import { useState } from 'react'
import { motion } from 'framer-motion'
import { scaleIn } from '../utils/animations'

// ── Sparkline SVG ──────────────────────────────────────────────────────────
function Sparkline() {
  const points = [0, 12, 8, 18, 14, 22, 20, 28, 25, 32, 30, 38]
  const w = '100%', h = 52
  const numW = 120
  const max = Math.max(...points)
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * numW},${h - (p / max) * h}`)
  const d = 'M ' + coords.join(' L ')
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${numW} ${h}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${numW},${h} L 0,${h} Z`} fill="url(#sparkFill)" />
      <path d={d} fill="none" stroke="url(#sparkGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].split(',')[0]} cy={coords[coords.length - 1].split(',')[1]} r="3" fill="#a78bfa" />
    </svg>
  )
}

// ── Company brand colours (shown on hover) ────────────────────────────────
const COMPANIES = [
  { name: 'Tesla',   color: '#e31937' },
  { name: 'Citrix',  color: '#00a1e0' },
  { name: 'NYU',     color: '#57068c' },
  { name: 'Samsung', color: '#1428a0' },
  { name: 'Virtusa', color: '#e63312' },
]

function CompanyTag({ name, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-xs font-semibold px-2 py-0.5 rounded-md border cursor-default transition-all duration-300"
      style={{
        borderColor: hovered ? color : 'rgba(255,255,255,0.1)',
        color: hovered ? color : '#94a3b8',
        background: hovered ? `${color}18` : 'transparent',
      }}
    >
      {name}
    </span>
  )
}

// ── Individual cards ──────────────────────────────────────────────────────
function ExperienceCard() {
  return (
    <motion.div
      variants={scaleIn}
      custom={0}
      className="relative p-5 rounded-xl border border-[#1e1e2e] bg-[#12121a] glass cursor-default overflow-hidden transition-all duration-300 hover:border-violet-500/30 flex flex-col justify-between"
    >
      {/* Top: full-width sparkline */}
      <div className="w-full mb-4">
        <Sparkline />
      </div>
      {/* Bottom: number + label */}
      <div>
        <div className="text-3xl font-black text-violet-400 font-sans leading-none mb-1">4.2+</div>
        <div className="text-[11px] text-slate-400 font-sans">Years Professional Experience</div>
      </div>
    </motion.div>
  )
}

function CompaniesCard() {
  return (
    <motion.div
      variants={scaleIn}
      custom={1}
      className="p-5 rounded-xl border border-[#1e1e2e] bg-[#12121a] glass cursor-default transition-all duration-300 hover:border-violet-500/30"
    >
      <div className="text-3xl font-black text-violet-400 font-sans mb-1">5</div>
      <div className="text-[11px] text-slate-400 font-sans mb-3">Companies</div>
      <div className="flex flex-wrap gap-1.5">
        {COMPANIES.map(c => <CompanyTag key={c.name} {...c} />)}
      </div>
      <div className="text-[10px] text-slate-600 font-sans mt-3">Fortune 500 · Startups · Academic R&amp;D</div>
    </motion.div>
  )
}

function DAUCard() {
  return (
    <motion.div
      variants={scaleIn}
      custom={2}
      className="relative p-5 rounded-xl border border-[#1e1e2e] bg-[#12121a] glass cursor-default transition-all duration-300 hover:border-violet-500/30 overflow-hidden"
    >
      {/* Live pulse dot */}
      <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>

      <div className="text-3xl font-black text-violet-400 font-sans mb-1">3.5M+</div>
      <div className="text-[11px] text-slate-400 font-sans mb-2">Daily Active Users</div>
      <div className="text-[10px] text-slate-500 font-sans leading-relaxed">
        ≈ Population of Madrid<br />
        Live systems still serving traffic
      </div>
    </motion.div>
  )
}

function FeaturesCard() {
  return (
    <motion.div
      variants={scaleIn}
      custom={3}
      className="p-5 rounded-xl border border-[#1e1e2e] bg-[#12121a] glass cursor-default transition-all duration-300 hover:border-violet-500/30"
    >
      <div className="text-3xl font-black text-violet-400 font-sans mb-1">27+</div>
      <div className="text-[11px] text-slate-400 font-sans mb-2">Production Features Shipped</div>
      <div className="text-[10px] text-slate-500 font-sans leading-relaxed">
        Incl. Supercharging wait-time forecasts, Robotaxi surge pricing, WAF recommendation engine, and more
      </div>
    </motion.div>
  )
}

// ── Exported grid ─────────────────────────────────────────────────────────
export default function RecruiterStatPills() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <ExperienceCard />
      <CompaniesCard />
      <DAUCard />
      <FeaturesCard />
    </div>
  )
}
