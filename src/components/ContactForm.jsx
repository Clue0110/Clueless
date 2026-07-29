import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Clueless from './Clueless'

export default function ContactForm() {
  const { theme, mode, isRecruiter } = useMode()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const inputCls = `w-full rounded-xl border bg-transparent px-3 py-2.5 text-base sm:text-sm outline-none ${theme.border} ${theme.text} ${theme.font} focus:ring-2 ${theme.ring}`

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.detail ? `${data.error} — ${data.detail}` : data.error || 'Something went wrong.')
      }
      setStatus('sent')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-md mx-auto mb-8 rounded-2xl border p-6 text-center ${theme.card} ${theme.border}`}
      >
        <div className="mb-2 flex justify-center">
          <Clueless pose="celebrate" size={36} label={false} />
        </div>
        <p className={theme.text}>
          {isRecruiter ? 'Thanks! Your message is on its way to Sai.' : 'sent! sai will get back to you soon 🐾'}
        </p>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className={`max-w-md mx-auto mb-8 rounded-2xl border p-4 sm:p-5 text-left ${theme.card} ${theme.border}`}
    >
      <div className="grid gap-3">
        <input value={form.name} onChange={set('name')} placeholder={isRecruiter ? 'Your name' : 'your name'} className={inputCls} />
        <input
          value={form.email}
          onChange={set('email')}
          type="email"
          placeholder={isRecruiter ? 'Your email' : 'your email'}
          className={inputCls}
        />
        <textarea
          value={form.message}
          onChange={set('message')}
          rows={4}
          placeholder={isRecruiter ? 'Your message' : "what's up?"}
          className={`${inputCls} resize-y`}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === 'sending'}
            className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-40 ${theme.accentBg} ${theme.accentHover}`}
          >
            {status === 'sending' ? 'Sending…' : isRecruiter ? 'Send message' : 'send it'}
          </button>
          {error && <span className="min-w-0 break-words text-sm text-red-400">{error}</span>}
        </div>
      </div>
    </form>
  )
}
