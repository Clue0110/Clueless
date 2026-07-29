import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Clueless from './Clueless'
import SpeechBubble from './SpeechBubble'

const GREETING = {
  recruiter: "Hi! I'm Clueless. Ask me anything about Sai's experience or projects.",
  developer: "yo — ask me anything about akilesh. his work, projects, whatever.",
  clueless: "hihi!! i'm clueless 🐾 ask me stuff about my human, sai!",
}

const PLACEHOLDER = {
  recruiter: 'Ask about Sai…',
  developer: 'ask me something…',
  clueless: 'ask me about sai!',
}

const LAUNCH_LABEL = {
  recruiter: 'Ask me anything',
  developer: 'ask me',
  clueless: 'talk to me!',
}

export default function CluelessChat() {
  const { theme, mode } = useMode()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([])
  const scrollRef = useRef(null)

  // Seed the greeting the first time it's opened.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: GREETING[mode] }])
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const q = input.trim()
    if (!q || busy) return
    const history = [...messages, { role: 'user', content: q }]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, mode }),
      })
      if (!res.ok || !res.body) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.detail ? `${e.error} — ${e.detail}` : e.error || 'Something went wrong.')
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages((m) => {
          const copy = m.slice()
          copy[copy.length - 1] = { role: 'assistant', content: acc }
          return copy
        })
      }
    } catch (e) {
      setMessages((m) => {
        const copy = m.slice()
        copy[copy.length - 1] = { role: 'assistant', content: `⚠️ ${e.message}` }
        return copy
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border shadow-2xl ${theme.card} ${theme.border}`}
          >
            <div className={`flex items-center justify-between border-b px-4 py-3 ${theme.border}`}>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm font-bold ${theme.accent}`}>( •ᴗ• )</span>
                <span className={`font-semibold ${theme.text}`}>Clueless</span>
              </div>
              <button onClick={() => setOpen(false)} className={`${theme.muted} hover:opacity-70`}>
                ✕
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'user' ? (
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm text-white ${theme.accentBg}`}>
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-[85%]">
                      <SpeechBubble
                        raw
                        tail={false}
                        caret={busy && i === messages.length - 1}
                        text={m.content || (busy ? '' : '…')}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={`flex items-center gap-2 border-t p-3 ${theme.border}`}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={PLACEHOLDER[mode]}
                className={`flex-1 rounded-xl border bg-transparent px-3 py-2 text-sm outline-none ${theme.border} ${theme.text} focus:ring-2 ${theme.ring}`}
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                className={`rounded-xl px-3 py-2 text-sm font-semibold text-white disabled:opacity-40 ${theme.accentBg} ${theme.accentHover}`}
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className={`ml-auto flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg ${theme.card} ${theme.border} hover:opacity-90`}
      >
        <Clueless pose={busy ? 'read' : open ? 'happy' : 'wave'} size={22} label={false} />
        {!open && <span className={`text-sm font-medium ${theme.text}`}>{LAUNCH_LABEL[mode]}</span>}
      </button>
    </div>
  )
}
