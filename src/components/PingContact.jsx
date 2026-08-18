import { useState } from 'react'
import { motion } from 'framer-motion'
import { personal } from '../data/content'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const inputCls =
  'w-full min-w-0 bg-transparent font-mono text-xs sm:text-sm text-green-300 placeholder-gray-600 outline-none border-b border-dashed border-[#30363d] focus:border-green-400 transition-colors py-1'

function Flag({ flag, children }) {
  return (
    <label className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="w-28 shrink-0 text-cyan-400">{flag}</span>
      {children}
    </label>
  )
}

export default function PingContact() {
  const [form, setForm] = useState({ name: '', email: '', key: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | pinging | sent | error
  const [lines, setLines] = useState([])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const push = (...ls) => setLines((prev) => [...prev, ...ls])

  async function submit(e) {
    e.preventDefault()
    if (status === 'pinging') return

    if (!form.name.trim() || !EMAIL_RE.test(form.email.trim()) || form.message.trim().length < 10) {
      setLines([
        { text: 'ping: bad packet — need --name, a valid --from, and a --payload of at least a sentence', cls: 'text-red-400' },
      ])
      setStatus('error')
      return
    }

    setStatus('pinging')
    setLines([
      { text: `PING sai (${personal.email}) from ${form.email.trim()}: 56 data bytes`, cls: 'text-gray-300' },
    ])

    const t0 = performance.now()
    try {
      const [res] = await Promise.all([
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim(),
            key: form.key.trim(),
            mode: 'dev',
          }),
        }),
        delay(1400), // let the ping feel like a ping
      ])
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.detail ? `${data.error} — ${data.detail}` : data.error || 'send failed')
      }

      const ms = Math.round(performance.now() - t0)
      push(
        {
          text: `64 bytes from sai.local: icmp_seq=0 key=${form.key.trim() || 'none'} time=${ms}ms`,
          cls: 'text-gray-300',
        },
        { text: '', cls: '' },
        { text: `--- ${personal.email} ping statistics ---`, cls: 'text-gray-500' },
        { text: '1 packet transmitted, 1 packet received, 0.0% packet loss', cls: 'text-gray-300' },
        { text: 'round-trip (you → sai → you) min/avg/max ≈ 1 day', cls: 'text-gray-300' },
        { text: 'ping successful ✓ — expect a pong within 24h', cls: 'text-green-400' },
      )
      setStatus('sent')
    } catch (err) {
      push(
        { text: 'Request timeout for icmp_seq 0', cls: 'text-red-400' },
        { text: `ping: ${err.message}`, cls: 'text-red-400' },
        { text: `fallback route: email ${personal.email} directly`, cls: 'text-gray-500' },
      )
      setStatus('error')
    }
  }

  return (
    <div
      className="mb-8 rounded-xl overflow-hidden border border-[#21262d] text-left shadow-2xl"
      style={{ background: '#0d1117' }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-[#21262d]"
        style={{ background: '#161b22' }}
      >
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-gray-500 font-mono">akilesh@clueless ~ ping</span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-xs sm:text-sm leading-6">
        {status !== 'sent' && (
          <form onSubmit={submit} className="space-y-3">
            <div>
              <span className="text-green-400">❯</span>{' '}
              <span className="text-gray-200">ping sai</span>{' '}
              <span className="text-gray-600">\</span>
            </div>
            <div className="space-y-2 pl-4 sm:pl-6">
              <Flag flag="--name">
                <input value={form.name} onChange={set('name')} placeholder="who's pinging?" className={inputCls} />
              </Flag>
              <Flag flag="--from">
                <input
                  value={form.email}
                  onChange={set('email')}
                  type="email"
                  placeholder="your@email.com"
                  className={inputCls}
                />
              </Flag>
              <Flag flag="--key">
                <input value={form.key} onChange={set('key')} placeholder="secret key (optional → subject line)" className={inputCls} />
              </Flag>
              <Flag flag="--payload">
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={3}
                  placeholder="56 bytes of whatever's on your mind"
                  className={`${inputCls} resize-y`}
                />
              </Flag>
            </div>
            <button
              type="submit"
              disabled={status === 'pinging'}
              className="min-h-10 rounded-lg border border-green-400/40 px-4 py-1.5 text-green-400 transition-colors hover:bg-green-400/10 disabled:opacity-40"
            >
              {status === 'pinging' ? 'pinging…' : '↵ send ping'}
            </button>
          </form>
        )}

        {lines.length > 0 && (
          <div className={status !== 'sent' ? 'mt-4' : ''}>
            {lines.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 }}
                className={`leading-6 ${l.cls}`}
              >
                {l.text || ' '}
              </motion.div>
            ))}
          </div>
        )}

        {status === 'sent' && (
          <div className="mt-2 inline-flex items-center gap-1">
            <span className="text-green-400">❯</span>
            <span className="w-2 h-4 bg-green-400 animate-pulse inline-block" />
          </div>
        )}
      </div>
    </div>
  )
}
