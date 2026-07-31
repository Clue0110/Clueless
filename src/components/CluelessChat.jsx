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

// The window is opened by tapping the roaming pet (CluelessPet) — there is no
// launcher button here anymore, just the chat window itself.
export default function CluelessChat() {
  const { theme, mode, showChat: open, setShowChat } = useMode()
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`mb-3 flex h-[min(28rem,70svh)] w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-2xl ${theme.card} ${theme.border}`}
          >
            <div className={`flex items-center justify-between border-b px-4 py-3 ${theme.border}`}>
              <div className="flex items-center gap-2">
                <Clueless pose="happy" size={16} label={false} />
                <span className={`font-semibold ${theme.text}`}>Clueless</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                aria-label="Close chat"
                className={`-mr-1 flex h-10 w-10 items-center justify-center rounded-full ${theme.muted} hover:opacity-70`}
              >
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
                className={`min-w-0 flex-1 rounded-xl border bg-transparent px-3 py-2.5 text-base sm:text-sm outline-none ${theme.border} ${theme.text} focus:ring-2 ${theme.ring}`}
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                aria-label="Send"
                className={`h-11 w-11 shrink-0 rounded-xl text-sm font-semibold text-white disabled:opacity-40 ${theme.accentBg} ${theme.accentHover}`}
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
