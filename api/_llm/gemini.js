// Gemini adapter — Google Gen AI SDK (@google/genai).
import { GoogleGenAI } from '@google/genai'

// Model IDs are env-overridable so you're never locked to a string that shifts.
// The "-latest" aliases auto-track the current generation (avoids "model no
// longer available" breakage). Defaults are flash-tier so they work on the
// free API tier; if you enable billing, set LLM_PITCH_MODEL=gemini-pro-latest
// for a stronger pitch.
const MODELS = {
  pitch: process.env.LLM_PITCH_MODEL || 'gemini-flash-latest',
  chat: process.env.LLM_CHAT_MODEL || 'gemini-flash-lite-latest',
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
