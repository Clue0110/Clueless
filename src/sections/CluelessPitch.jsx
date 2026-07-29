import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Clueless from '../components/Clueless'
import SpeechBubble from '../components/SpeechBubble'

const ANCHOR_ORDER = ['summary', 'highlights', 'matchedSkills', 'relevantProjects', 'education']
const ANCHOR_TITLES = {
  summary: 'Summary',
  highlights: 'Highlights',
  matchedSkills: 'Matched Skills',
  relevantProjects: 'Relevant Projects',
  education: 'Education',
}

export default function CluelessPitch() {
  const { theme, mode } = useMode()

  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pitch, setPitch] = useState(null)

  const [beat, setBeat] = useState(-1) // -1 idle, 0..n-1 touring, n ended
  const [playing, setPlaying] = useState(true)

  const anchorRefs = useRef({})
  const timerRef = useRef()

  const beats = pitch?.walkthrough ?? []
  const touring = pitch && beat >= 0 && beat < beats.length
  const ended = pitch && beat >= beats.length
  const current = touring ? beats[beat] : null
  const pose = loading ? 'read' : ended ? 'celebrate' : current?.pose || 'idle'

  // Scroll the active section into view as the tour advances.
  useEffect(() => {
    if (current) {
      anchorRefs.current[current.anchor]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [beat]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const scheduleAdvance = () => {
    clearTimeout(timerRef.current)
    if (!playing) return
    timerRef.current = setTimeout(() => setBeat((b) => b + 1), 1600)
  }

  async function run() {
    clearTimeout(timerRef.current)
    setError(null)
    setPitch(null)
    setBeat(-1)
    setLoading(true)
    try {
      const res = await fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, mode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ? `${data.error} — ${data.detail}` : data.error || 'Something went wrong.')
      setPitch(data)
      setPlaying(true)
      setBeat(0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    clearTimeout(timerRef.current)
    setPitch(null)
    setBeat(-1)
    setError(null)
  }

  const heading = 'the job-match magic ✨'

  return (
    <section id="pitch" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`gradient-text text-3xl md:text-4xl font-bold ${theme.font}`}
      >
        {heading}
      </motion.h2>
      <p className={`mt-3 max-w-2xl ${theme.muted} ${theme.font}`}>
        paste a job description below. i'll read it very carefully (i'm a cat, i read everything carefully),
        score the fit honestly, and walk you through why sai matches — using only his real experience.
      </p>

      {/* Input */}
      {!pitch && (
        <div className={`mt-8 rounded-2xl border p-5 ${theme.card} ${theme.border}`}>
          <div className="flex items-start gap-4">
            <div className="shrink-0 pt-1">
              <Clueless pose={loading ? 'read' : 'idle'} />
            </div>
            <div className="flex-1">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={7}
                placeholder="Paste the job description here…"
                className={`w-full resize-y rounded-xl border bg-transparent p-3 text-sm outline-none ${theme.border} ${theme.text} ${theme.font} focus:ring-2 ${theme.ring}`}
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={run}
                  disabled={loading || jd.trim().length < 20}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40 ${theme.accentBg} ${theme.accentHover}`}
                >
                  {loading ? 'clueless is reading…' : 'make the case!'}
                </button>
                {error && <span className="text-sm text-red-400">{error}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results + guided tour */}
      {pitch && (
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          {/* Tailored resume (the anchors the tour visits) */}
          <div className="space-y-4 order-2 md:order-1">
            <MatchHeader summary={pitch.matchSummary} />
            {ANCHOR_ORDER.map((key) => (
              <AnchorCard
                key={key}
                title={ANCHOR_TITLES[key]}
                active={current?.anchor === key}
                setRef={(el) => (anchorRefs.current[key] = el)}
              >
                <AnchorBody anchor={key} data={pitch.tailoredResume} />
              </AnchorCard>
            ))}
          </div>

          {/* Sticky Clueless companion */}
          <div className="order-1 md:order-2">
            <div className="md:sticky md:top-24 flex flex-col items-center gap-4">
              <div className="min-h-[84px] flex items-end">
                <AnimatePresence mode="wait">
                  {current && (
                    <SpeechBubble key={beat} text={current.line} onDone={scheduleAdvance} />
                  )}
                  {ended && (
                    <SpeechBubble
                      key="end"
                      text={"that's my case! grab sai's resume to take with you 👇"}
                    />
                  )}
                </AnimatePresence>
              </div>

              <Clueless pose={pose} size={40} />

              {/* Tour controls */}
              {touring && (
                <div className="flex items-center gap-2">
                  <TourBtn onClick={() => setPlaying((p) => !p)} label={playing ? '⏸' : '▶'} theme={theme} />
                  <TourBtn onClick={() => setBeat((b) => b + 1)} label="⏭" theme={theme} />
                  <span className={`text-xs ${theme.muted}`}>
                    {beat + 1} / {beats.length}
                  </span>
                </div>
              )}

              {ended && (
                <div className="flex flex-col items-center gap-2">
                  <a
                    href={`/resume/${pitch.recommendedResumeVersion}/resume.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${theme.accentBg} ${theme.accentHover}`}
                  >
                    Download the resume
                  </a>
                  <button onClick={() => setBeat(0)} className={`text-xs underline ${theme.muted}`}>
                    replay the tour
                  </button>
                </div>
              )}

              <button onClick={reset} className={`text-xs underline ${theme.muted}`}>
                try another job description
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function MatchHeader({ summary }) {
  const { theme, isDev } = useMode()
  return (
    <div className={`rounded-2xl border p-5 ${theme.card} ${theme.border}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className={`text-sm uppercase tracking-widest ${theme.muted}`}>
            {isDev ? 'verdict' : 'Match'}
          </div>
          <div className={`text-lg font-semibold ${theme.text}`}>{summary.verdict}</div>
        </div>
        <div className={`text-4xl font-bold ${theme.accent}`}>{summary.score}%</div>
      </div>
      <p className={`mt-2 ${theme.muted}`}>{summary.oneLiner}</p>
    </div>
  )
}

function AnchorCard({ title, active, setRef, children }) {
  const { theme } = useMode()
  return (
    <motion.div
      ref={setRef}
      animate={{ scale: active ? 1.01 : 1 }}
      className={`rounded-2xl border p-5 transition ${theme.card} ${
        active ? `ring-2 ${theme.ring} ${theme.accentBorder}` : theme.border
      }`}
    >
      <div className={`mb-2 text-sm font-semibold uppercase tracking-widest ${active ? theme.accent : theme.muted}`}>
        {title}
      </div>
      {children}
    </motion.div>
  )
}

function AnchorBody({ anchor, data }) {
  const { theme } = useMode()
  if (anchor === 'summary') return <p className={theme.text}>{data.summary}</p>
  if (anchor === 'education') return <p className={theme.text}>{data.education}</p>
  if (anchor === 'matchedSkills')
    return (
      <div className="flex flex-wrap gap-2">
        {data.matchedSkills.map((s) => (
          <span key={s} className={`rounded-full border px-3 py-1 text-xs ${theme.tagBg} ${theme.tagText} ${theme.tagBorder}`}>
            {s}
          </span>
        ))}
      </div>
    )
  if (anchor === 'highlights')
    return (
      <ul className="space-y-2">
        {data.highlights.map((h, i) => (
          <li key={i} className={`flex gap-2 ${theme.text}`}>
            <span className={theme.accent}>▹</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    )
  if (anchor === 'relevantProjects')
    return (
      <ul className="space-y-3">
        {data.relevantProjects.map((p, i) => (
          <li key={i}>
            <div className={`font-semibold ${theme.text}`}>{p.title}</div>
            <div className={theme.muted}>{p.why}</div>
          </li>
        ))}
      </ul>
    )
  return null
}

function TourBtn({ onClick, label, theme }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 w-8 rounded-lg border text-sm ${theme.card} ${theme.border} ${theme.text} hover:opacity-80`}
    >
      {label}
    </button>
  )
}
