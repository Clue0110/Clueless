import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PALETTE, POSES, COLS, ROWS } from './cluelessSprites'

// Animated pixel-art cat. The art itself lives in cluelessSprites.js; this just
// cycles a pose's frames on a timer and adds the whole-body motion (bob, hop,
// lean) that the frames don't cover.
//
// Poses: idle | happy | walk | wave | point | read | celebrate | wink | curious
//        | love | sleep | bored | laptop | sneeze | play | dizzy | held
//        | groom | eat | box
// `facing`: 'right' (default) or 'left' — flips the sprite horizontally.

// Whole-body motion per pose. The frames carry the expression; this carries the
// energy, so anything meant to feel welcoming gets a visible bounce.
const BODY_ANIM = {
  idle: { y: [0, -1.5, 0], transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
  happy: { y: [0, -5, 0], transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } },
  walk: { y: [0, -2, 0], rotate: [-1.5, 1.5, -1.5], transition: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' } },
  wave: { y: [0, -3, 0], transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } },
  point: { x: [0, 2, 0], transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
  read: { y: [0, -1, 0], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } },
  celebrate: { y: [0, -12, 0], transition: { duration: 0.5, repeat: Infinity, ease: 'easeOut' } },
  wink: { y: [0, -2, 0], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  curious: { rotate: [-4, 4, -4], transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } },
  love: { y: [0, -4, 0], scale: [1, 1.04, 1], transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } },
  sleep: { y: 2, transition: { duration: 0.6 } },
  bored: { y: [0, -0.8, 0], transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } },
  laptop: { y: [0, -0.8, 0], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } },
  sneeze: { rotate: [0, -2, -3, 6, 0], y: [0, -1, -2, 3, 0], transition: { duration: 0.85, repeat: Infinity, ease: 'easeInOut' } },
  play: { y: [0, -4, 0], rotate: [0, 2, 0], transition: { duration: 0.36, repeat: Infinity, ease: 'easeOut' } },
  dizzy: { rotate: [-6, 6, -6], x: [-2, 2, -2], transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } },
  held: { rotate: [-4, 4, -4], transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
  groom: { rotate: [0, -2, 0], transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } },
  eat: { y: [0, -0.8, 0], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  // A box shouldn't bounce; the blink frames carry the life.
  box: { y: [0, -0.5, 0], transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } },
}

// Each frame's <rect> list is identical for the life of the page, so build it
// once per frame rather than per render — the walk cycle ticks every 150ms.
// Runs of the same colour collapse into one rect; the 0.02 overlap hides seams.
const rectCache = new Map()

function rectsFor(rows) {
  const cached = rectCache.get(rows)
  if (cached) return cached
  const out = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      if (ch === '.') {
        x++
        continue
      }
      let w = 1
      while (row[x + w] === ch) w++
      out.push(<rect key={`${x}-${y}`} x={x} y={y} width={w + 0.02} height={1.02} fill={PALETTE[ch]} />)
      x += w
    }
  })
  rectCache.set(rows, out)
  return out
}

// `tempo` stretches a pose's frame timing (>1 = slower) — a strolling cat
// needs slower legs than a sprinting one, same frames.
export default function CluelessCat({ pose = 'idle', size = 40, facing = 'right', tempo = 1 }) {
  const { frames, ms } = POSES[pose] || POSES.idle
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setTick(0)
    if (!ms || frames.length < 2) return
    const id = setInterval(() => setTick((t) => t + 1), ms * tempo)
    return () => clearInterval(id)
  }, [pose, tempo]) // eslint-disable-line react-hooks/exhaustive-deps

  const width = size * 2.3
  const height = width * (ROWS / COLS)

  const base = BODY_ANIM[pose] || BODY_ANIM.idle
  const bodyAnim =
    tempo !== 1 && base.transition?.duration
      ? { ...base, transition: { ...base.transition, duration: base.transition.duration * tempo } }
      : base

  return (
    <motion.div animate={bodyAnim} aria-hidden="true" className="relative">
      <svg
        viewBox={`0 0 ${COLS} ${ROWS}`}
        width={width}
        height={height}
        shapeRendering="crispEdges"
        style={{ transform: facing === 'left' ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated', overflow: 'visible' }}
      >
        {rectsFor(frames[tick % frames.length])}
      </svg>

      {pose === 'sleep' && (
        <motion.span
          className="absolute top-1/4 left-1/4 font-mono text-sm font-bold"
          style={{ color: '#8b95a5' }}
          animate={{ opacity: [0, 1, 0], y: [6, -6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        >
          z z
        </motion.span>
      )}
    </motion.div>
  )
}
