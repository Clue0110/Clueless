// Gemini adapter — Google Gen AI SDK (@google/genai).
import { GoogleGenAI } from '@google/genai'

// Model IDs are env-overridable so you're never locked to a string that shifts.
// Defaults are stable, known-good IDs; set LLM_PITCH_MODEL / LLM_CHAT_MODEL to
// move to a newer generation (e.g. a gemini-3 model) without a code change.
const MODELS = {
  pitch: process.env.LLM_PITCH_MODEL || 'gemini-2.5-pro',
  chat: process.env.LLM_CHAT_MODEL || 'gemini-2.5-flash',
}

function client() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
  return new GoogleGenAI({ apiKey })
}

export async function generateJSON({ system, prompt, schema }) {
  const ai = client()
  const res = await ai.models.generateContent({
    model: MODELS.pitch,
    contents: prompt,
    config: {
      systemInstruction: system,
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  })
  return JSON.parse(res.text)
}

export async function* streamText({ system, messages }) {
  const ai = client()
  // Gemini uses role "model" for the assistant and "parts" for content.
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const stream = await ai.models.generateContentStream({
    model: MODELS.chat,
    contents,
    config: { systemInstruction: system },
  })
  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text
  }
}
