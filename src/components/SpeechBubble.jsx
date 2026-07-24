import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'

// Types out `text` character by character, then calls onDone(). Used to drive
// the walkthrough's beat-to-beat pacing (advance once the line finishes typing).
export default function SpeechBubble({ text, onDone, speed = 20 }) {
  const { theme } = useMode()
  const [shown, setShown] = useState('')
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    setShown('')
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        onDoneRef.current?.()
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`relative max-w-xs rounded-2xl border px-4 py-3 text-sm ${theme.card} ${theme.border} ${theme.text}`}
    >
      {shown}
      <span className={`ml-0.5 inline-block w-1.5 animate-pulse ${theme.accent}`}>▍</span>
      {/* little tail pointing down toward Clueless */}
      <span
        className={`absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r ${theme.card} ${theme.border}`}
      />
    </motion.div>
  )
}
