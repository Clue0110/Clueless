// Claude adapter — Anthropic SDK (@anthropic-ai/sdk).
import Anthropic from '@anthropic-ai/sdk'

const MODELS = {
  pitch: process.env.LLM_PITCH_MODEL || 'claude-opus-4-8',
  chat: process.env.LLM_CHAT_MODEL || 'claude-haiku-4-5',
}

function client() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
  return new Anthropic({ apiKey })
}

export async function generateJSON({ system, prompt, schema }) {
  const c = client()
  const res = await c.messages.create({
    model: MODELS.pitch,
    max_tokens: 8000,
    system,
    // Structured outputs — constrains the response to the JSON schema.
    output_config: { format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: prompt }],
  })
  const text = res.content.find((b) => b.type === 'text')?.text ?? ''
  return JSON.parse(text)
}

export async function* streamText({ system, messages }) {
  const c = client()
  const stream = c.messages.stream({
    model: MODELS.chat,
    max_tokens: 4000,
    system,
    messages,
  })
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}
