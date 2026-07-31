import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import CluelessCat from './CluelessCat'
import { useIsMobile } from '../hooks/useIsMobile'

// The free-roaming desktop pet. Lives in a fixed overlay across all three
// modes and runs a little life of its own: wanders to random spots, naps,
// gets bored, hacks on a mini laptop, sneezes, and plays with its yarn ball.
//
// Interactions:
//  - single tap/click  → opens the Clueless chat (the RAG chatbot)
//  - double tap        → it loves it (heart eyes + floating hearts)
//  - drag              → pick it up and drop it anywhere
//  - drag it too much  → dizzy (X eyes) for ~5s before it recovers
//  - drag the yarn ball anywhere → the cat chases it and starts playing

const WALK_SPEED = 130 // px/s
const DIZZY_THRESHOLD = 2400 // accumulated drag px before it gets dizzy
const DIZZY_MS = 5000
const TOP_MARGIN = 100 // stay out from under the navbar
const EDGE = 10
const TOY_SIZE = 26

const rand = (a, b) => a + Math.random() * (b - a)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const vw = () => window.innerWidth
const vh = () => window.innerHeight

// Loosely weighted plan; wander shows up often so the pet keeps moving.
const BEHAVIOR_PLAN = ['wander', 'idle', 'wander', 'bored', 'wander', 'sleep', 'laptop', 'wander', 'sneeze', 'play', 'laptop']

// ── Yarn ball (pixel art, matches the cat's palette) ────────────────────────

const TOY_PIXELS = [
  '..XXXX..',
  '.XNNNNX.',
  'XNRNNRNX',
  'XNNRRNNX',
  'XNNRRNNX',
  'XNRNNRNX',
  '.XNNNNX.',
  '..XXXX..',
]

function YarnBall({ wiggle }) {
  return (
    <motion.svg
      viewBox="0 0 8 9"
      width={TOY_SIZE}
      height={TOY_SIZE * (9 / 8)}
      shapeRendering="crispEdges"
      animate={wiggle ? { x: [-3, 3, -3], rotate: [-14, 14, -14] } : { x: 0, rotate: 0 }}
      transition={wiggle ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
    >
      {TOY_PIXELS.map((row, y) =>
        [...row].map((c, x) =>
          c === '.' ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width="1.04" height="1.04" fill={c === 'X' ? '#4a2d0a' : c === 'R' ? '#c2417a' : '#f472b6'} />
          ),
        ),
      )}
      {/* loose strand */}
      <rect x="1" y="8" width="4" height="0.8" fill="#f472b6" />
    </motion.svg>
  )
}

// ── The pet ─────────────────────────────────────────────────────────────────

export default function CluelessPet() {
  const { setShowChat, showChat } = useMode()
  const isMobile = useIsMobile()

  const catSize = isMobile ? 26 : 34
  const catW = catSize * 2.3
  const catH = catW * (24 / 32)

  const [pose, setPose] = useState('idle')
  const [facing, setFacing] = useState('left')
  const [emote, setEmote] = useState(null)
  const [hearts, setHearts] = useState([])
  const [toyWiggle, setToyWiggle] = useState(false)

  const boundsRef = useRef(null)
  const x = useMotionValue(typeof window !== 'undefined' ? Math.max(EDGE, vw() - catW - 100) : 0)
  const y = useMotionValue(typeof window !== 'undefined' ? Math.max(TOP_MARGIN, vh() - catH - 36) : 0)
  const toyX = useMotionValue(typeof window !== 'undefined' ? Math.max(EDGE, vw() * 0.18) : 0)
  const toyY = useMotionValue(typeof window !== 'undefined' ? Math.max(TOP_MARGIN, vh() - TOY_SIZE - 40) : 0)

  // Cancellation: every interruption bumps runId; behaviors check they still
  // own the current id after each await.
  const runId = useRef(0)
  const tweens = useRef([])
  const tapTimer = useRef(null)
  const dizzyAcc = useRef(0)
  const dizzyUntil = useRef(0)
  const chatRef = useRef(showChat)
  const lastBehavior = useRef(null)

  const alive = (id) => runId.current === id
  const cancel = () => {
    runId.current++
    tweens.current.forEach((t) => t.stop())
    tweens.current = []
  }

  const clampX = (v) => Math.min(Math.max(v, EDGE), vw() - catW - EDGE)
  const clampY = (v) => Math.min(Math.max(v, TOP_MARGIN), vh() - catH - EDGE)

  async function walkTo(id, tx, ty, speed = WALK_SPEED) {
    const dx = tx - x.get()
    const dy = ty - y.get()
    const dist = Math.hypot(dx, dy)
    if (dist < 6) return
    setFacing(dx >= 0 ? 'right' : 'left')
    setPose('walk')
    const dur = Math.max(0.5, dist / speed)
    const t1 = animate(x, tx, { duration: dur, ease: 'linear' })
    const t2 = animate(y, ty, { duration: dur, ease: 'easeInOut' })
    tweens.current = [t1, t2]
    await Promise.all([t1, t2]).catch(() => {})
  }

  // ── Behaviors ─────────────────────────────────────────────────────────────

  async function wanderB(id) {
    await walkTo(id, clampX(rand(0, vw())), clampY(rand(TOP_MARGIN, vh())))
    if (alive(id)) setPose('idle')
  }

  async function idleB(id) {
    setPose('idle')
    await wait(rand(2500, 4500))
  }

  async function boredB(id) {
    setPose('bored')
    await wait(rand(3500, 5500))
  }

  async function sleepB(id) {
    setPose('sleep')
    await wait(rand(6000, 10000))
    if (alive(id)) setPose('idle')
  }

  async function laptopB(id) {
    setPose('laptop')
    await wait(rand(5000, 8000))
    if (alive(id)) setPose('idle')
  }

  async function sneezeB(id) {
    setPose('sneeze')
    await wait(750)
    if (!alive(id)) return
    setEmote('achoo!')
    await wait(900)
    setEmote(null)
    if (alive(id)) setPose('idle')
  }

  async function playB(id) {
    // Walk up next to wherever the yarn ball is, then bat at it.
    const tx = toyX.get()
    const ty = toyY.get()
    const standLeft = tx > catW + 50
    const gx = clampX(standLeft ? tx - catW + 12 : tx + TOY_SIZE - 6)
    const gy = clampY(ty - catH + TOY_SIZE + 6)
    await walkTo(id, gx, gy)
    if (!alive(id)) return
    setFacing(standLeft ? 'right' : 'left')
    setPose('play')
    setToyWiggle(true)
    await wait(rand(3000, 5200))
    setToyWiggle(false)
    if (alive(id)) setPose('idle')
  }

  const BEHAVIORS = { wander: wanderB, idle: idleB, bored: boredB, sleep: sleepB, laptop: laptopB, sneeze: sneezeB, play: playB }

  const nextBehavior = () => {
    let b = BEHAVIOR_PLAN[Math.floor(Math.random() * BEHAVIOR_PLAN.length)]
    if (b === lastBehavior.current && b !== 'wander') b = 'wander'
    lastBehavior.current = b
    return b
  }

  function startLoop(delay = 0) {
    const id = ++runId.current
    ;(async () => {
      await wait(delay)
      while (alive(id)) {
        await BEHAVIORS[nextBehavior()](id)
        if (!alive(id)) return
        await wait(rand(700, 2200))
      }
    })()
  }

  // Chat companion spot: bottom-left corner, out of the chat window's way.
  function goSitByChat() {
    const id = ++runId.current
    ;(async () => {
      await walkTo(id, EDGE + 8, clampY(vh() - catH - 20))
      if (alive(id)) {
        setFacing('right')
        setPose('happy')
      }
    })()
  }

  // ── Interactions ──────────────────────────────────────────────────────────

  function doLove() {
    cancel()
    const id = ++runId.current
    setEmote(null)
    setPose('love')
    const now = Date.now()
    setHearts(Array.from({ length: 6 }, (_, i) => ({ id: now + i, dx: rand(-34, 34), delay: i * 0.09 })))
    setTimeout(() => setHearts([]), 2000)
    setTimeout(() => {
      if (!alive(id)) return
      chatRef.current ? goSitByChat() : startLoop(300)
    }, 2200)
  }

  function handleTap() {
    if (Date.now() < dizzyUntil.current) return // too dizzy to respond
    if (tapTimer.current) {
      clearTimeout(tapTimer.current)
      tapTimer.current = null
      doLove()
    } else {
      tapTimer.current = setTimeout(() => {
        tapTimer.current = null
        setShowChat(true)
      }, 300)
    }
  }

  function onDragStart() {
    cancel()
    setEmote(null)
    setToyWiggle(false)
    setPose('held')
  }

  function onDrag(e, info) {
    dizzyAcc.current += Math.hypot(info.delta.x, info.delta.y)
  }

  function onDragEnd() {
    if (dizzyAcc.current > DIZZY_THRESHOLD) {
      dizzyAcc.current = 0
      dizzyUntil.current = Date.now() + DIZZY_MS
      const id = ++runId.current
      setPose('dizzy')
      setEmote('@_@')
      setTimeout(() => {
        if (!alive(id)) return
        setEmote(null)
        setPose('happy')
        setTimeout(() => {
          if (!alive(id)) return
          chatRef.current ? goSitByChat() : startLoop(0)
        }, 900)
      }, DIZZY_MS)
    } else {
      setPose('idle')
      chatRef.current ? goSitByChat() : startLoop(1200)
    }
  }

  function onToyDragEnd() {
    // The cat can't resist a thrown yarn ball.
    if (Date.now() < dizzyUntil.current) return // unless it's dizzy
    cancel()
    const id = ++runId.current
    ;(async () => {
      await wait(300)
      if (!alive(id)) return
      await playB(id)
      if (!alive(id)) return
      chatRef.current ? goSitByChat() : startLoop(600)
    })()
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  // Chat open/close drives where the pet goes; on mount (chat closed) this is
  // also what kicks off the roaming loop.
  useEffect(() => {
    chatRef.current = showChat
    if (Date.now() < dizzyUntil.current) return // let it finish recovering
    if (showChat) {
      cancel()
      goSitByChat()
    } else {
      startLoop(1200)
    }
  }, [showChat]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Dizziness fades if you stop flinging the cat around.
    const decay = setInterval(() => {
      dizzyAcc.current *= 0.93
    }, 250)
    // Keep both sprites on-screen when the window shrinks.
    const onResize = () => {
      x.set(clampX(x.get()))
      y.set(clampY(y.get()))
      toyX.set(Math.min(Math.max(toyX.get(), EDGE), vw() - TOY_SIZE - EDGE))
      toyY.set(Math.min(Math.max(toyY.get(), TOP_MARGIN), vh() - TOY_SIZE - EDGE))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancel()
      clearInterval(decay)
      clearTimeout(tapTimer.current)
      window.removeEventListener('resize', onResize)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={boundsRef} className="fixed inset-0 z-40 pointer-events-none select-none" aria-hidden="true">
      {/* ── Yarn ball ── */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ x: toyX, y: toyY, touchAction: 'none' }}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={boundsRef}
        whileDrag={{ scale: 1.2 }}
        onDragStart={() => setToyWiggle(false)}
        onDragEnd={onToyDragEnd}
      >
        <YarnBall wiggle={toyWiggle} />
      </motion.div>

      {/* ── The cat ── */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ x, y, touchAction: 'none' }}
        drag
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={boundsRef}
        onTap={handleTap}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        {/* emote bubble */}
        {emote && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-xs font-bold text-amber-300 whitespace-nowrap"
          >
            {emote}
          </motion.div>
        )}

        {/* floating hearts on double-tap */}
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            className="absolute left-1/2 top-0 text-base"
            style={{ color: '#f472b6' }}
            initial={{ opacity: 0, y: 6, x: h.dx, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -46, scale: 1.15 }}
            transition={{ duration: 1.5, delay: h.delay, ease: 'easeOut' }}
          >
            ♥
          </motion.span>
        ))}

        <CluelessCat pose={pose} size={catSize} facing={facing} />
      </motion.div>
    </div>
  )
}
