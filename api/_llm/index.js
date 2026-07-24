// Provider factory — the ONLY place that knows which LLM vendor is active.
// Everything else (pitch.js, chat.js, the whole frontend) talks to the
// returned adapter's interface and never imports a vendor SDK directly.
//
// Swap providers by setting LLM_PROVIDER in the environment:
//   LLM_PROVIDER=gemini | claude | openai
// and the matching key: GEMINI_API_KEY | ANTHROPIC_API_KEY | OPENAI_API_KEY
//
// Every adapter exports the same two functions:
//   generateJSON({ system, prompt, schema })  -> Promise<object>   (structured, e.g. the pitch)
//   streamText({ system, messages })          -> AsyncIterable<string>  (chat)

const LOADERS = {
  gemini: () => import('./gemini.js'),
  claude: () => import('./claude.js'),
  openai: () => import('./openai.js'),
}

// Dynamic import so only the selected provider's SDK is loaded — you only need
// to `npm install` the one vendor you actually use.
export async function getProvider() {
  const name = (process.env.LLM_PROVIDER || 'gemini').toLowerCase()
  const load = LOADERS[name]
  if (!load) {
    throw new Error(
      `Unknown LLM_PROVIDER "${name}". Set it to one of: ${Object.keys(LOADERS).join(', ')}`
    )
  }
  return load()
}
