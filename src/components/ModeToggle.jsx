import { motion, AnimatePresence } from 'framer-motion'
import { useMode, MODES } from '../context/ModeContext'

export default function ModeToggle() {
  const { mode, toggleMode, isRecruiter, theme } = useMode()

  return (
    <motion.button
      onClick={toggleMode}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-500 ${
        isRecruiter
          ? 'border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20'
          : 'border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20'
      } ${theme.font}`}
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
          {isRecruiter ? '👔 Recruiter' : '🧑‍💻 Developer'}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs opacity-50">⇄</span>
    </motion.button>
  )
}
