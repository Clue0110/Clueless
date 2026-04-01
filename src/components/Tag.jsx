import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'

export default function Tag({ label }) {
  const { theme } = useMode()
  return (
    <motion.span
      whileHover={{ scale: 1.1 }}
      className={`inline-block px-3 py-1 text-xs rounded-full border ${theme.tagBg} ${theme.tagText} ${theme.tagBorder} ${theme.font} transition-colors duration-500`}
    >
      {label}
    </motion.span>
  )
}
