// OpenAI adapter — openai SDK.
import OpenAI from 'openai'

// Defaults are stable, widely-available IDs; override via env to use a newer
// model (e.g. a gpt-5 variant) without touching code.
const MODELS = {
  pitch: process.env.LLM_PITCH_MODEL || 'gpt-4o',
  chat: process.env.LLM_CHAT_MODEL || 'gpt-4o-mini',
}

function client() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')
  return new OpenAI({ apiKey })
}

export async function generateJSON({ system, prompt, schema }) {
  const c = client()
  const res = await c.chat.completions.create({
    model: MODELS.pitch,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt },
    ],
    // OpenAI strict structured outputs. The shared pitch schema is authored
    // strict-compatible (additionalProperties:false + required on every object).
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'response', schema, strict: true },
    },
  })
  return JSON.parse(res.choices[0].message.content)
}

export async function* streamText({ system, messages }) {
  const c = client()
  const stream = await c.chat.completions.create({
    model: MODELS.chat,
    messages: [{ role: 'system', content: system }, ...messages],
    stream: true,
  })
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content
    if (text) yield text
  }
}
