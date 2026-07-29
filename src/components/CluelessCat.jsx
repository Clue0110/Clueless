import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

// Pixel-art cat sprite. Each pose is a set of hand-drawn 24×16 pixel frames
// cycled on a timer (classic sprite animation), rendered as crisp SVG rects.
// Poses: idle | walk | read | point | wave | celebrate | sleep
// `facing`: 'right' (default) or 'left' — flips the sprite horizontally.

const PALETTE = {
  X: '#54350d', // outline
  B: '#f4a933', // orange fur
  D: '#c97b16', // dark fur (stripes + tail)
  W: '#fdeed3', // cream (muzzle, paws)
  P: '#f2a0b5', // pink (inner ear, blush)
  E: '#241511', // eyes
  N: '#e8618c', // nose
}

// ── Frames (24 cols × 16 rows, '.' = transparent) ──────────────────────────

const SIT_A = [
  '......XX........XX......',
  '.....XBBX......XBBX.....',
  '.....XBPBX....XBPBX.....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBBBBDBBBBDBBBBX....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBEEBBBBBBBBEEBX....',
  '....XBEEBBWWWWBBEEBX....',
  '....XBPBBWWNNWWBBPBX....',
  '.....XBBBWWWWWWBBBX.....',
  '.....XBBBBBBBBBBBBX...DD',
  '....XBBDBBBBBBDBBBBX..DD',
  '....XBBDBBBBBBDBBBBX.DD.',
  '....XBWWBBBBBBBBWWBX.DD.',
  '....XBWWBBBBBBBBWWBXDD..',
  '.....XXXXXXXXXXXXXX.....',
]

// Tail swished one step
const SIT_B = [
  '......XX........XX......',
  '.....XBBX......XBBX.....',
  '.....XBPBX....XBPBX.....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBBBBDBBBBDBBBBX....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBEEBBBBBBBBEEBX....',
  '....XBEEBBWWWWBBEEBX....',
  '....XBPBBWWNNWWBBPBX....',
  '.....XBBBWWWWWWBBBX...DD',
  '.....XBBBBBBBBBBBBX..DD.',
  '....XBBDBBBBBBDBBBBX.DD.',
  '....XBBDBBBBBBDBBBBXDD..',
  '....XBWWBBBBBBBBWWBXDD..',
  '....XBWWBBBBBBBBWWBXD...',
  '.....XXXXXXXXXXXXXX.....',
]

// Eyes closed (also used as the calm "reading" face)
const SIT_BLINK = SIT_A.map((row, i) =>
  i === 6 ? '....XBBBBBBBBBBBBBBX....' : row,
)

// Right arm extended sideways, tail tucked to the left
const POINT = [
  '......XX........XX......',
  '.....XBBX......XBBX.....',
  '.....XBPBX....XBPBX.....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBBBBDBBBBDBBBBX....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBEEBBBBBBBBEEBX....',
  '....XBEEBBWWWWBBEEBX....',
  '....XBPBBWWNNWWBBPBX....',
  '.....XBBBWWWWWWBBBX.....',
  '.....XBBBBBBBBBBBBBBBWW.',
  '....XBBDBBBBBBDBBBBX....',
  '....XBBDBBBBBBDBBBBX....',
  '..DDXBWWBBBBBBBBWWBX....',
  '.DD.XBWWBBBBBBBBWWBX....',
  '.....XXXXXXXXXXXXXX.....',
]

// Right arm raised, two frames of waving
const WAVE_1 = [
  '......XX........XX......',
  '.....XBBX......XBBX.....',
  '.....XBPBX....XBPBX.....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBBBBDBBBBDBBBBX....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBEEBBBBBBBBEEBXWW..',
  '....XBEEBBWWWWBBEEBXBB..',
  '....XBPBBWWNNWWBBPBXBB..',
  '.....XBBBWWWWWWBBBXBB...',
  '.....XBBBBBBBBBBBBX.....',
  '....XBBDBBBBBBDBBBBX....',
  '....XBBDBBBBBBDBBBBX....',
  '..DDXBWWBBBBBBBBWWBX....',
  '.DD.XBWWBBBBBBBBWWBX....',
  '.....XXXXXXXXXXXXXX.....',
]

const WAVE_2 = [
  '......XX........XX......',
  '.....XBBX......XBBX.....',
  '.....XBPBX....XBPBX.....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBBBBDBBBBDBBBBX....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBEEBBBBBBBBEEBX....',
  '....XBEEBBWWWWBBEEBX.WW.',
  '....XBPBBWWNNWWBBPBXBB..',
  '.....XBBBWWWWWWBBBXBB...',
  '.....XBBBBBBBBBBBBX.....',
  '....XBBDBBBBBBDBBBBX....',
  '....XBBDBBBBBBDBBBBX....',
  '..DDXBWWBBBBBBBBWWBX....',
  '.DD.XBWWBBBBBBBBWWBX....',
  '.....XXXXXXXXXXXXXX.....',
]

// Both paws up, open mouth — two frames
const CHEER_1 = [
  '......XX........XX......',
  '.....XBBX......XBBX.....',
  '.....XBPBX....XBPBX.....',
  '....XBBBBBBBBBBBBBBX....',
  '....XBBBBDBBBBDBBBBX....',
  '....XBBBBBBBBBBBBBBX....',
  '..WWXBEEBBBBBBBBEEBXWW..',
  '..BBXBEEBBWWWWBBEEBXBB..',
  '..BBXBPBBWWNNWWBBPBXBB..',
  '...BBXBBBWWEEWWBBBXBB...',
  '.....XBBBBBBBBBBBBX...DD',
  '....XBBDBBBBBBDBBBBX..DD',
  '....XBBDBBBBBBDBBBBX.DD.',
  '....XBWWBBBBBBBBWWBX.DD.',
  '....XBWWBBBBBBBBWWBXDD..',
  '.....XXXXXXXXXXXXXX.....',
]

const CHEER_2 = [
  '......XX........XX......',
  '.....XBBX......XBBX.....',
  '.....XBPBX....XBPBX.....',
  '....XBBBBBBBBBBBBBBX....',
  '.WW.XBBBBDBBBBDBBBBXWW..',
  '..BBXBBBBBBBBBBBBBBXBB..',
  '..BBXBEEBBBBBBBBEEBXBB..',
  '...BXBEEBBWWWWBBEEBXB...',
  '....XBPBBWWNNWWBBPBX....',
  '.....XBBBWWEEWWBBBX.....',
  '.....XBBBBBBBBBBBBX..DD.',
  '....XBBDBBBBBBDBBBBX.DD.',
  '....XBBDBBBBBBDBBBBXDD..',
  '....XBWWBBBBBBBBWWBXDD..',
  '....XBWWBBBBBBBBWWBXD...',
  '.....XXXXXXXXXXXXXX.....',
]

// Side view, trotting right — legs alternate between frames
const WALK_1 = [
  '........................',
  '........................',
  '.......XX....XX.........',
  '......XBBX..XBBX........',
  '......XBPBXXBPBX........',
  '.....XBBBBBBBBBBX.......',
  '.....XBBDBBDBBBBX.......',
  'DD...XBBBBBBBEEBX.......',
  '.DD..XBBBBBBBBBWWX......',
  '..DDXBBBBBBBBBBBBX......',
  '..XXBBDBBBDBBBBBBX......',
  '..XBBBBBBBBBBBBBBX......',
  '..XBBBBBBBBBBBBBBX......',
  '...XBBX......XBBX.......',
  '...XWWX......XWWX.......',
  '........................',
]

const WALK_2 = [
  '........................',
  '........................',
  '.......XX....XX.........',
  '......XBBX..XBBX........',
  '......XBPBXXBPBX........',
  '.....XBBBBBBBBBBX.......',
  '.....XBBDBBDBBBBX.......',
  '.DD..XBBBBBBBEEBX.......',
  '..DD.XBBBBBBBBBWWX......',
  '...DXBBBBBBBBBBBBX......',
  '..XXBBDBBBDBBBBBBX......',
  '..XBBBBBBBBBBBBBBX......',
  '..XBBBBBBBBBBBBBBX......',
  '.....XBBX......XBBX.....',
  '.....XWWX......XWWX.....',
  '........................',
]

// Curled up on the floor, eyes shut — tail flicks between frames
const SLEEP_1 = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '....XX..XX..............',
  '...XBBXXBBX.............',
  '...XBPBBPBXXXXXXX.......',
  '..XBBBBBBBBBBBBBBXX.....',
  '..XBBBBBBDBBBDBBBBBX....',
  '..XBEEBBBBBBBBBBBBBX....',
  '..XBBWWBBBBBBBBBBDDX....',
  '...XBBBBBBBBBBBDDDX.....',
  '....XXXXXXXXXXXXXX......',
]

const SLEEP_2 = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '....XX..XX..............',
  '...XBBXXBBX.............',
  '...XBPBBPBXXXXXXX.......',
  '..XBBBBBBBBBBBBBBXX.....',
  '..XBBBBBBDBBBDBBBBBX....',
  '..XBEEBBBBBBBBBBBBBX....',
  '..XBBWWBBBBBBBBBBBDX....',
  '...XBBBBBBBBBBBDDDX.....',
  '....XXXXXXXXXXXXXX......',
]

// Frame sequence + speed per pose
const POSES = {
  idle: { frames: [SIT_A, SIT_A, SIT_B, SIT_B, SIT_A, SIT_BLINK], ms: 420 },
  walk: { frames: [WALK_1, WALK_2], ms: 170 },
  read: { frames: [SIT_BLINK], ms: 0 },
  point: { frames: [POINT], ms: 0 },
  wave: { frames: [WAVE_1, WAVE_2], ms: 260 },
  celebrate: { frames: [CHEER_1, CHEER_2], ms: 220 },
  sleep: { frames: [SLEEP_1, SLEEP_1, SLEEP_2], ms: 900 },
}

// Container motion per pose (frames handle the details; this adds life)
const BODY_ANIM = {
  idle: { y: [0, -1.5, 0], transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
  read: { y: [0, -1, 0], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } },
  point: { x: [0, 2, 0], transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
  wave: { y: 0 },
  walk: { y: 0 },
  celebrate: { y: [0, -12, 0], transition: { duration: 0.5, repeat: Infinity, ease: 'easeOut' } },
  sleep: { y: 0 },
}

const COLS = 24
const ROWS = 16

function Frame({ rows }) {
  const rects = useMemo(() => {
    const out = []
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const c = row[x]
        if (c !== '.') out.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.04" height="1.04" fill={PALETTE[c] || PALETTE.B} />)
      }
    })
    return out
  }, [rows])
  return <>{rects}</>
}

export default function CluelessCat({ pose = 'idle', size = 40, facing = 'right' }) {
  const { frames, ms } = POSES[pose] || POSES.idle
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setTick(0)
    if (!ms || frames.length < 2) return
    const id = setInterval(() => setTick((t) => t + 1), ms)
    return () => clearInterval(id)
  }, [pose]) // eslint-disable-line react-hooks/exhaustive-deps

  const rows = frames[tick % frames.length]
  const width = size * 2.6
  const height = width * (ROWS / COLS)

  return (
    <motion.div animate={BODY_ANIM[pose] || BODY_ANIM.idle} aria-hidden="true" className="relative">
      <svg
        viewBox={`0 0 ${COLS} ${ROWS}`}
        width={width}
        height={height}
        shapeRendering="crispEdges"
        style={{ transform: facing === 'left' ? 'scaleX(-1)' : undefined, imageRendering: 'pixelated' }}
      >
        <Frame rows={rows} />
      </svg>

      {pose === 'sleep' && (
        <motion.span
          className="absolute -top-3 right-0 font-mono text-sm font-bold"
          style={{ color: PALETTE.B }}
          animate={{ opacity: [0, 1, 0], y: [6, -6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        >
          z z
        </motion.span>
      )}
    </motion.div>
  )
}
