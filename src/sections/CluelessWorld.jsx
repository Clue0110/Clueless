import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Clueless from '../components/Clueless'
import SpeechBubble from '../components/SpeechBubble'
import CluelessPitch from './CluelessPitch'
import { useIsMobile } from '../hooks/useIsMobile'
import { WELCOME, TOUR, PITCH_INVITE } from '../data/cluelessTour'
import { FiGithub, FiLinkedin, FiMail, FiArrowLeft, FiArrowRight } from 'react-icons/fi'

// Clueless mode takes over the whole site: no sections, no scroll-spy — just
// the cat. It welcomes you, then physically walks across the screen from
// station to station, narrating Sai's profile, and ends by offering to match
// against a pasted job description (CluelessPitch).
//
// On a phone the vertical budget won't fit a card, a floating speech bubble, the
// cat and the controls at once, so the dialogue moves inside the card and only
// the welcome (which has no card yet) keeps a floating bubble.

// Where the cat sits for each tour stop — alternating sides so every advance is
// a visible walk. The narrow bounds keep the speech bubble on-screen at phone
// widths, where the cat is only ~90px from either edge at 18%/76%.
const positionFor = (i, narrow) => (i % 2 === 0 ? (narrow ? 34 : 18) : narrow ? 66 : 76)

export default function CluelessWorld() {
  const { theme } = useMode()
  const isMobile = useIsMobile()

  // stage: enter → welcome → tour → invite → pitch
  const [stage, setStage] = useState('enter')
  const [step, setStep] = useState(0)
  const [welcomeLine, setWelcomeLine] = useState(0)
  const [welcomeDone, setWelcomeDone] = useState(false)

  // Cat locomotion
  const [catX, setCatX] = useState(50)
  const [walking, setWalking] = useState(true) // walks in on mount
  const [facing, setFacing] = useState('right')
  const [walkDur, setWalkDur] = useState(1.6)

  const station = stage === 'tour' ? TOUR[step] : null
  const side = catX < 50 ? 'left' : 'right'

  const walkTo = (x) => {
    if (x === catX) return
    setFacing(x >= catX ? 'right' : 'left')
    setWalkDur(Math.max(0.8, Math.abs(x - catX) * 0.028))
    setWalking(true)
    setCatX(x)
  }

  const goToStep = (i) => {
    if (stage === 'tour' && i === step) return
    setStep(i)
    setStage('tour')
    walkTo(positionFor(i, isMobile))
  }

  const next = () => {
    if (step < TOUR.length - 1) goToStep(step + 1)
    else {
      setStage('invite')
      walkTo(50)
    }
  }
  const back = () => step > 0 && goToStep(step - 1)

  // On a phone the floating bubble would land on top of the card, so the card
  // carries the line instead. The welcome has no card, so it keeps the bubble.
  const inlineSay = isMobile
  const hasBubble =
    !walking && (stage === 'welcome' ? !welcomeDone : !inlineSay && (stage === 'tour' || stage === 'invite'))

  // The cat should never be caught looking bored: every resting state here is a
  // smiling one, and 'idle' is only the fallback.
  const pose = walking
    ? 'walk'
    : stage === 'welcome'
      ? welcomeDone
        ? 'happy'
        : 'wave'
      : stage === 'invite'
        ? 'celebrate'
        : station?.pose || 'happy'

  // ── Pitch stage is a normal scrollable page ──────────────────────────
  if (stage === 'pitch') {
    return (
      <div className="pt-14 min-h-[100svh]">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 pt-10">
          <button
            onClick={() => {
              setStage('invite')
              setWalking(false)
            }}
            className={`flex min-h-11 items-center gap-2 py-2 text-sm ${theme.muted} hover:opacity-70 ${theme.font}`}
          >
            <FiArrowLeft /> back to the tour
          </button>
        </div>
        <CluelessPitch />
      </div>
    )
  }

  return (
    <div className="relative h-[100svh] overflow-hidden flex flex-col">
      {/* ── Card / dialogue area (sits opposite the cat on desktop) ── */}
      <div
        className={`absolute inset-x-0 top-24 bottom-[10.5rem] md:top-20 md:bottom-60 flex items-center justify-center px-3 sm:px-4 md:px-16 ${
          stage === 'tour' ? (side === 'left' ? 'md:justify-end' : 'md:justify-start') : ''
        }`}
      >
        <AnimatePresence mode="wait">
          {stage === 'welcome' && welcomeDone && (
            <WelcomePanel
              key="welcome-actions"
              onStart={() => goToStep(0)}
              onSkip={() => setStage('pitch')}
            />
          )}

          {stage === 'tour' && !walking && station && (
            <StationCard key={station.id} station={station} say={inlineSay ? station.say : null} />
          )}

          {stage === 'invite' && !walking && (
            <InvitePanel
              key="invite"
              say={inlineSay ? `${PITCH_INVITE.say} ${PITCH_INVITE.question}` : null}
              onYes={() => setStage('pitch')}
              onReplay={() => goToStep(0)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Floor ── */}
      <div className={`absolute bottom-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent`} />

      {/* ── The cat (walks along the floor) ── */}
      <motion.div
        className="absolute bottom-24 z-20"
        initial={{ left: '-12%' }}
        animate={{ left: `${catX}%` }}
        transition={{ duration: walkDur, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          setWalking(false)
          setFacing(catX > 50 ? 'left' : 'right') // face the card when seated
          if (stage === 'enter') setStage('welcome')
        }}
        style={{ x: '-50%' }}
      >
        {/* Speech bubble above the cat. Only mounted when it has a line — it's a
            fixed 320px box centred on the cat, so an empty one still hung off
            the screen edge at the phone walk positions. */}
        {hasBubble && (
          <div
            className={`absolute bottom-full mb-2 w-[min(320px,86vw)] left-1/2 -translate-x-1/2 md:translate-x-0 ${
              side === 'left' ? 'md:left-[-16px] md:right-auto' : 'md:left-auto md:right-[-16px]'
            }`}
          >
            <AnimatePresence mode="wait">
              {stage === 'welcome' && (
                <SpeechBubble
                  key={`w${welcomeLine}`}
                  text={WELCOME.lines[welcomeLine]}
                  onDone={() => {
                    setTimeout(() => {
                      if (welcomeLine < WELCOME.lines.length - 1) setWelcomeLine(welcomeLine + 1)
                      else setWelcomeDone(true)
                    }, 1100)
                  }}
                />
              )}
              {stage === 'tour' && station && (
                <SpeechBubble key={`s${station.id}`} text={station.say} />
              )}
              {stage === 'invite' && (
                <SpeechBubble key="invite-say" text={`${PITCH_INVITE.say} ${PITCH_INVITE.question}`} />
              )}
            </AnimatePresence>
          </div>
        )}

        <Clueless pose={pose} size={isMobile ? 40 : 56} label={false} facing={facing} />
      </motion.div>

      {/* ── Tour controls ── */}
      {stage === 'tour' && (
        <div className="absolute bottom-3 md:bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-1 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <ControlBtn onClick={back} disabled={step === 0 || walking} aria="previous stop">
              <FiArrowLeft />
            </ControlBtn>

            <div className="flex items-center">
              {TOUR.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => !walking && goToStep(i)}
                  aria-label={s.title}
                  className="flex h-11 w-7 items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      i === step ? `w-6 ${theme.accentBg}` : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>

            <ControlBtn onClick={next} disabled={walking} aria="next stop" primary>
              {step === TOUR.length - 1 ? '✨' : <FiArrowRight />}
            </ControlBtn>
          </div>
          <button
            onClick={() => {
              setStage('invite')
              walkTo(50)
            }}
            className={`flex min-h-11 items-center px-3 text-xs underline ${theme.muted} hover:opacity-70 ${theme.font}`}
          >
            skip to the job-match magic
          </button>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────

function ControlBtn({ children, onClick, disabled, aria, primary }) {
  const { theme } = useMode()
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={aria}
      className={`flex h-11 w-11 items-center justify-center rounded-full border text-lg transition disabled:opacity-30 ${
        primary
          ? `${theme.accentBg} ${theme.accentHover} border-transparent text-white`
          : `${theme.card} ${theme.border} ${theme.text}`
      }`}
    >
      {children}
    </motion.button>
  )
}

function Panel({ children, wide = false }) {
  const { theme } = useMode()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={`w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} max-h-full overflow-y-auto rounded-3xl border p-4 sm:p-6 md:p-8 ${theme.card} ${theme.border} glow-clueless`}
    >
      {children}
    </motion.div>
  )
}

function WelcomePanel({ onStart, onSkip }) {
  const { theme } = useMode()
  return (
    <Panel>
      <h1 className={`text-2xl md:text-4xl font-bold ${theme.gradientText} ${theme.font}`}>
        welcome to sai's corner of the internet
      </h1>
      <p className={`mt-3 ${theme.muted} ${theme.font}`}>
        guided by clueless, the only cat with a working knowledge of kafka.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className={`min-h-11 rounded-2xl px-5 py-3 text-sm font-semibold text-white ${theme.accentBg} ${theme.accentHover} ${theme.font}`}
        >
          {WELCOME.startLabel}
        </motion.button>
        <button onClick={onSkip} className={`min-h-11 px-1 text-sm underline ${theme.muted} hover:opacity-70 ${theme.font}`}>
          {WELCOME.skipLabel}
        </button>
      </div>
    </Panel>
  )
}

function InvitePanel({ onYes, onReplay, say }) {
  const { theme } = useMode()
  return (
    <Panel>
      {say && (
        <div className="mb-4">
          <SpeechBubble text={say} />
        </div>
      )}
      <h2 className={`text-xl md:text-3xl font-bold ${theme.gradientText} ${theme.font}`}>
        the job-match magic ✨
      </h2>
      <p className={`mt-3 ${theme.muted} ${theme.font}`}>
        paste any job description and i'll read it, score the fit honestly, and walk you through exactly
        why sai matches — using only his real experience. no making stuff up. i'm a very honest cat.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onYes}
          className={`min-h-11 rounded-2xl px-5 py-3 text-sm font-semibold text-white ${theme.accentBg} ${theme.accentHover} ${theme.font}`}
        >
          {PITCH_INVITE.yesLabel}
        </motion.button>
        <button onClick={onReplay} className={`min-h-11 px-1 text-sm underline ${theme.muted} hover:opacity-70 ${theme.font}`}>
          replay the tour
        </button>
      </div>
    </Panel>
  )
}

// ── Station cards ───────────────────────────────────────────────────────────

function StationCard({ station, say }) {
  const { theme } = useMode()
  const { card } = station
  return (
    <Panel wide={card.type === 'projects'}>
      <div className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${theme.accent} ${theme.font}`}>
        {station.title}
      </div>

      {say && (
        <div className="mb-4">
          <SpeechBubble key={station.id} text={say} />
        </div>
      )}

      {card.type === 'profile' && (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className={`h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-full border-2 ${theme.accentBorder}`}>
            <img
              src={`${import.meta.env.BASE_URL}ProfileImage.jpeg`}
              alt={card.name}
              className="h-full w-full object-cover"
              style={{ transform: 'scale(1.25)' }}
            />
          </div>
          <div>
            <div className={`text-xl font-bold ${theme.text} ${theme.font}`}>{card.name}</div>
            <div className={`text-sm ${theme.accent} ${theme.font}`}>{card.location}</div>
            <p className={`mt-2 text-sm ${theme.muted} ${theme.font}`}>{card.blurb}</p>
          </div>
        </div>
      )}

      {card.type === 'facts' && (
        <>
          <div className={`text-lg font-bold ${theme.text} ${theme.font}`}>{card.heading}</div>
          <ul className="mt-3 space-y-2.5">
            {card.facts.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className={`flex gap-2.5 text-sm ${theme.text} ${theme.font}`}
              >
                <span className={theme.accent}>🐾</span>
                <span>{f}</span>
              </motion.li>
            ))}
          </ul>
        </>
      )}

      {card.type === 'projects' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {card.projects.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.link || undefined}
              target={p.link ? '_blank' : undefined}
              rel={p.link ? 'noreferrer' : undefined}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className={`rounded-2xl border p-4 ${theme.border} ${p.link ? 'hover:border-amber-500/50 cursor-pointer' : ''} transition`}
            >
              <div className={`font-bold ${theme.text} ${theme.font}`}>
                {p.emoji} {p.title}
              </div>
              <p className={`mt-1 text-xs leading-relaxed ${theme.muted} ${theme.font} line-clamp-3`}>{p.blurb}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className={`rounded-full border px-2 py-0.5 text-[10px] ${theme.tagBg} ${theme.tagText} ${theme.tagBorder}`}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {card.type === 'education' && (
        <div className="space-y-4">
          {card.schools.map((s, i) => (
            <motion.div
              key={s.school}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.15 }}
            >
              <div className={`font-bold ${theme.text} ${theme.font}`}>{s.school}</div>
              <div className={`text-sm ${theme.accent} ${theme.font}`}>
                {s.degree} · {s.period} · GPA {s.gpa}
              </div>
              <p className={`mt-1 text-xs ${theme.muted} ${theme.font}`}>{s.note}</p>
            </motion.div>
          ))}
        </div>
      )}

      {card.type === 'contact' && (
        <div className="flex flex-col items-start gap-3">
          {[
            { icon: <FiMail />, label: card.email, href: `mailto:${card.email}` },
            { icon: <FiLinkedin />, label: 'linkedin', href: card.linkedin },
            { icon: <FiGithub />, label: 'github', href: card.github },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm ${theme.border} ${theme.text} ${theme.font} hover:border-amber-500/50 transition`}
            >
              <span className={theme.accent}>{l.icon}</span>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </Panel>
  )
}
