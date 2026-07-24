import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'

const LABELS = {
  recruiter: '/recruiter',
  developer: '/developer',
  clueless: '/clueless',
}

export default function ModeToggle() {
  const { mode, toggleMode, theme } = useMode()

  return (
    <motion.button
      onClick={toggleMode}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-500 hover:opacity-80 ${theme.tagBorder} ${theme.tagBg} ${theme.tagText} ${theme.font}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {LABELS[mode]}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs opacity-50">⇄</span>
    </motion.button>
  )
}
