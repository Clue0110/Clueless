import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'

// Two modes:
//  - typewriter (default): types `text` out char-by-char, calls onDone() when finished.
//    Used by the walkthrough to pace beat-to-beat.
//  - raw: renders `text` directly (for streaming chat, where the parent updates
//    `text` as chunks arrive). onDone is ignored.
export default function SpeechBubble({ text, onDone, speed = 20, raw = false, caret = true, tail = true }) {
  const { theme } = useMode()
  const [shown, setShown] = useState(raw ? text : '')
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (raw) {
      setShown(text)
      return
    }
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
  }, [text, speed, raw])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`relative rounded-2xl border px-4 py-3 text-sm ${theme.card} ${theme.border} ${theme.text}`}
    >
      {shown}
      {caret && <span className={`ml-0.5 inline-block w-1.5 animate-pulse ${theme.accent}`}>▍</span>}
      {tail && (
        <span
          className={`absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r ${theme.card} ${theme.border}`}
        />
      )}
    </motion.div>
  )
}
