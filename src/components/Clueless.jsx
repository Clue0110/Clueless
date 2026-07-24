import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'

// Pixel/emoji sprite. Each pose is a little text face; Framer Motion adds the
// life (bob, walk, celebrate hop). Color follows the active mode via theme.accent.
const FACES = {
  idle: '( •ᴗ• )',
  walk: '( •ᴗ• )ᕗ',
  read: '( •_• )',
  point: '( •ᴗ•)☞',
  wave: 'ヽ( •ᴗ• )ﾉ',
  celebrate: '\\( ^ᴗ^ )/',
}

const ANIM = {
  idle: { y: [0, -4, 0], rotate: 0, transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } },
  read: { y: [0, -1.5, 0], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  walk: { x: [-3, 3, -3], y: [0, -2, 0], transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } },
  point: { x: [0, 3, 0], transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } },
  wave: { rotate: [-6, 6, -6], transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } },
  celebrate: { y: [0, -10, 0], scale: [1, 1.08, 1], transition: { duration: 0.5, repeat: Infinity, ease: 'easeOut' } },
}

export default function Clueless({ pose = 'idle', size = 34, label = true }) {
  const { theme } = useMode()
  return (
    <div className="flex flex-col items-center select-none" aria-hidden="true">
      <motion.div
        className={`font-mono font-bold leading-none ${theme.accent}`}
        style={{ fontSize: size }}
        animate={ANIM[pose] || ANIM.idle}
      >
        {FACES[pose] || FACES.idle}
      </motion.div>
      {label && (
        <span className={`mt-1 font-mono text-[10px] tracking-widest uppercase ${theme.muted}`}>clueless</span>
      )}
    </div>
  )
}
