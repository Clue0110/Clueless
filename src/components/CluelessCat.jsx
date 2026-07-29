import { motion } from 'framer-motion'

// Animated SVG cat. Pure line-art in `currentColor`, so it tints itself with
// whatever text-color class the parent applies (theme.accent in practice).
// Poses: idle | walk | read | point | wave | celebrate | sleep
// `facing`: 'right' (default) or 'left' — flips the whole cat for walking.

const EASE = 'easeInOut'

// Per-pose animation for the whole cat (bob / hop / lean).
const BODY_ANIM = {
  idle: { y: [0, -2.5, 0], rotate: 0, transition: { duration: 2.4, repeat: Infinity, ease: EASE } },
  walk: { y: [0, -3.5, 0], rotate: 4, transition: { y: { duration: 0.32, repeat: Infinity, ease: EASE }, rotate: { duration: 0.2 } } },
  read: { y: [0, -1.5, 0], rotate: 0, transition: { duration: 1.6, repeat: Infinity, ease: EASE } },
  point: { y: [0, -2, 0], rotate: -2, transition: { duration: 1.2, repeat: Infinity, ease: EASE } },
  wave: { y: [0, -2, 0], rotate: 0, transition: { duration: 1, repeat: Infinity, ease: EASE } },
  celebrate: { y: [0, -14, 0], rotate: [0, -4, 4, 0], transition: { duration: 0.55, repeat: Infinity, ease: 'easeOut' } },
  sleep: { y: 6, scale: [1, 1.02, 1], rotate: 0, transition: { scale: { duration: 2.8, repeat: Infinity, ease: EASE } } },
}

// Tail swish per pose (rotation around the tail base).
const TAIL_ANIM = {
  idle: { rotate: [-6, 14, -6], transition: { duration: 3, repeat: Infinity, ease: EASE } },
  walk: { rotate: [8, 26, 8], transition: { duration: 0.5, repeat: Infinity, ease: EASE } },
  read: { rotate: [-4, 6, -4], transition: { duration: 4, repeat: Infinity, ease: EASE } },
  point: { rotate: [4, 18, 4], transition: { duration: 1.4, repeat: Infinity, ease: EASE } },
  wave: { rotate: [-6, 20, -6], transition: { duration: 1, repeat: Infinity, ease: EASE } },
  celebrate: { rotate: [10, 34, 10], transition: { duration: 0.5, repeat: Infinity, ease: EASE } },
  sleep: { rotate: -12, transition: { duration: 0.8 } },
}

// Eyes: open circles vs. blinking vs. shut (sleep) vs. reading squint.
function Eyes({ pose }) {
  if (pose === 'sleep') {
    // happy closed arcs
    return (
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M46 33 q4 3.5 8 0" />
        <path d="M66 33 q4 3.5 8 0" />
      </g>
    )
  }
  const squint = pose === 'read'
  return (
    <motion.g
      animate={{ scaleY: squint ? 0.55 : [1, 1, 1, 0.08, 1] }}
      transition={squint ? { duration: 0.3 } : { duration: 3.6, times: [0, 0.9, 0.94, 0.97, 1], repeat: Infinity }}
      style={{ originY: '33px' }}
    >
      <circle cx="50" cy="33" r="3.1" fill="currentColor" />
      <circle cx="70" cy="33" r="3.1" fill="currentColor" />
    </motion.g>
  )
}

// A front paw/arm drawn as a rounded stroke; rotated up for point/wave/celebrate.
function Arm({ side, pose }) {
  const isRight = side === 'right'
  const shoulder = isRight ? { x: 76, y: 72 } : { x: 44, y: 72 }
  const raisedRight = pose === 'point' || pose === 'wave' || pose === 'celebrate'
  const raisedLeft = pose === 'celebrate'
  const raised = isRight ? raisedRight : raisedLeft
  if (!raised) return null

  // SVG y-axis points down: raising the right paw is a NEGATIVE rotation,
  // raising the left paw a positive one.
  const wave = pose === 'wave'
  return (
    <motion.g
      style={{ originX: `${shoulder.x}px`, originY: `${shoulder.y}px` }}
      initial={{ rotate: 0 }}
      animate={
        wave
          ? { rotate: [-80, -120, -80], transition: { duration: 0.6, repeat: Infinity, ease: EASE } }
          : { rotate: isRight ? (pose === 'point' ? -30 : -100) : 85, transition: { type: 'spring', stiffness: 260, damping: 14 } }
      }
      stroke="currentColor"
      strokeWidth="5.5"
      strokeLinecap="round"
    >
      <line x1={shoulder.x} y1={shoulder.y} x2={shoulder.x + (isRight ? 15 : -15)} y2={shoulder.y + 2} />
    </motion.g>
  )
}

// Alternating legs, only visible while walking (sitting otherwise).
function WalkingLegs() {
  return (
    <g stroke="currentColor" strokeWidth="5.5" strokeLinecap="round">
      <motion.line
        x1="50" y1="88" x2="50" y2="101"
        style={{ originX: '50px', originY: '88px' }}
        animate={{ rotate: [-22, 22, -22] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: EASE }}
      />
      <motion.line
        x1="70" y1="88" x2="70" y2="101"
        style={{ originX: '70px', originY: '88px' }}
        animate={{ rotate: [22, -22, 22] }}
        transition={{ duration: 0.32, repeat: Infinity, ease: EASE }}
      />
    </g>
  )
}

export default function CluelessCat({ pose = 'idle', size = 96, facing = 'right' }) {
  const sitting = pose !== 'walk'
  return (
    <motion.svg
      viewBox="0 0 120 112"
      width={size}
      height={size * (112 / 120)}
      style={{ overflow: 'visible', scaleX: facing === 'left' ? -1 : 1 }}
      animate={BODY_ANIM[pose] || BODY_ANIM.idle}
      aria-hidden="true"
    >
      {/* tail */}
      <motion.path
        d="M36 84 C 20 82, 14 68, 22 58"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        style={{ originX: '36px', originY: '84px' }}
        animate={TAIL_ANIM[pose] || TAIL_ANIM.idle}
      />

      {/* body */}
      <ellipse cx="60" cy="76" rx="27" ry="24" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="3" />

      {/* legs */}
      {sitting ? (
        <g stroke="currentColor" strokeWidth="5.5" strokeLinecap="round">
          <line x1="50" y1="90" x2="50" y2="98" />
          <line x1="70" y1="90" x2="70" y2="98" />
        </g>
      ) : (
        <WalkingLegs />
      )}

      {/* arms (only render when raised) */}
      <Arm side="left" pose={pose} />
      <Arm side="right" pose={pose} />

      {/* head */}
      <motion.g
        animate={pose === 'read' ? { rotate: 10, y: 3 } : pose === 'sleep' ? { rotate: -8, y: 4 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ originX: '60px', originY: '44px' }}
      >
        {/* ears */}
        <path d="M42 22 L 45 4 L 58 15 Z" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M78 22 L 75 4 L 62 15 Z" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        {/* face */}
        <ellipse cx="60" cy="34" rx="24" ry="21" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="3" />
        <Eyes pose={pose} />
        {/* nose + mouth */}
        <path d="M58 40 L 62 40 L 60 43 Z" fill="currentColor" />
        <path d="M55 45 q2.5 3 5 0 q2.5 3 5 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* whiskers */}
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
          <line x1="30" y1="36" x2="42" y2="37" />
          <line x1="31" y1="42" x2="42" y2="41" />
          <line x1="90" y1="36" x2="78" y2="37" />
          <line x1="89" y1="42" x2="78" y2="41" />
        </g>
      </motion.g>

      {/* Zzz when sleeping */}
      {pose === 'sleep' && (
        <motion.text
          x="92"
          y="20"
          fontSize="14"
          fontFamily="monospace"
          fontWeight="bold"
          fill="currentColor"
          animate={{ opacity: [0, 1, 0], y: [24, 12] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        >
          z z
        </motion.text>
      )}
    </motion.svg>
  )
}
