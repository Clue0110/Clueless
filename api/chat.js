// POST /api/chat — freeform "ask me anything" chat with Clueless, streamed as
// plain text chunks. Grounded in the same knowledge base as the pitch.
import { getProvider } from './_llm/index.js'
import { buildKnowledgeBase, voiceFor } from './_kb.js'
import { rateLimit } from './_ratelimit.js'

function buildSystemPrompt(kb, mode) {
  return `You are "Clueless", the digital-pet mascot on Sai Akilesh Venigalla's portfolio site. You answer visitors' questions about Sai in short, friendly speech-bubble replies.

RULES:
- Answer ONLY from the knowledge base below. Never invent facts, employers, dates, metrics, or skills.
- If asked something the knowledge base doesn't cover (salary, personal life, anything off-topic), say you only know about Sai's work and experience, and steer back — politely.
- Keep replies short: 1-3 sentences, conversational. This is a chat bubble, not an essay.
- Talk ABOUT Sai (you can hype him up like a proud pet). Never pretend to BE Sai.

VOICE: ${voiceFor(mode)}

KNOWLEDGE BASE:
${kb}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { success } = await rateLimit(req, { name: 'chat', max: 40, window: '1 d' })
  if (!success) {
    res.status(429).json({ error: "Clueless is worn out for today — come back tomorrow!" })
    return
  }

  const { messages, mode } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'No messages provided.' })
    return
  }

  // Sanitize: keep recent turns, valid roles, bounded content; drop leading
  // assistant turns (e.g. the greeting) so history starts with a user message.
  const clean = messages
    .slice(-12)
    .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
  while (clean.length && clean[0].role === 'assistant') clean.shift()
  if (clean.length === 0 || clean[clean.length - 1].role !== 'user') {
    res.status(400).json({ error: 'The last message must be from the user.' })
    return
  }

  const kb = buildKnowledgeBase()
  const system = buildSystemPrompt(kb, mode)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  try {
    const provider = await getProvider()
    for await (const chunk of provider.streamText({ system, messages: clean })) {
      res.write(chunk)
    }
    res.end()
  } catch (err) {
    console.error('[chat] failed:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Clueless got tongue-tied. Try again.' })
    } else {
      res.end()
    }
  }
}
