// POST /api/contact — sends the visitor's message to the site owner via Resend,
// with an optional one-line Clueless summary. Rate-limited.
import { Resend } from 'resend'
import { getProvider } from './_llm/index.js'
import { personal } from '../src/data/content.js'
import { rateLimit } from './_ratelimit.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort one-line TL;DR of the message. Never blocks the send.
async function summarize(name, message) {
  try {
    const provider = await getProvider()
    let out = ''
    for await (const chunk of provider.streamText({
      system:
        'You summarize inbound portfolio contact messages for the site owner. Reply with ONE short sentence: who this is and what they want. No preamble, no greeting.',
      messages: [{ role: 'user', content: `From: ${name}\n\n${message}` }],
    })) {
      out += chunk
    }
    return out.trim().slice(0, 300) || null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { success } = await rateLimit(req, { name: 'contact', max: 5, window: '1 d' })
  if (!success) {
    res.status(429).json({ error: "That's a lot of messages — try again tomorrow!" })
    return
  }

  const { name, email, message } = req.body || {}
  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Please add your name.' })
    return
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    res.status(400).json({ error: 'Please add a valid email.' })
    return
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    res.status(400).json({ error: 'Add a message (at least a sentence).' })
    return
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'The contact form isn\'t configured yet.', detail: 'RESEND_API_KEY is not set' })
    return
  }

  const to = process.env.CONTACT_TO_EMAIL || personal.email
  const from = process.env.CONTACT_FROM_EMAIL || 'Clueless <onboarding@resend.dev>'
  const cleanName = name.trim().slice(0, 120)
  const cleanEmail = email.trim().slice(0, 200)
  const cleanMsg = message.trim().slice(0, 5000)

  const summary = await summarize(cleanName, cleanMsg)

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: cleanEmail,
      subject: `Portfolio contact from ${cleanName}`,
      text: [
        summary ? `TL;DR: ${summary}` : null,
        summary ? '' : null,
        `Name:  ${cleanName}`,
        `Email: ${cleanEmail}`,
        '',
        cleanMsg,
      ]
        .filter((l) => l !== null)
        .join('\n'),
    })
    if (error) throw new Error(error.message || 'Resend send failed')
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed:', err)
    res.status(500).json({
      error: 'Your message could not be sent. Please try again.',
      detail: String(err?.message || err).slice(0, 300), // dev diagnostic; remove before production
    })
  }
}
