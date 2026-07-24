// POST /api/pitch — given a job description, Clueless generates a JD-tailored
// pitch (grounded strictly in the portfolio knowledge base) plus a walkthrough
// script that the frontend animates.
import { getProvider } from './_llm/index.js'
import { buildKnowledgeBase, RESUME_VERSIONS, voiceFor } from './_kb.js'
import { rateLimit } from './_ratelimit.js'

// Strict-compatible schema (additionalProperties:false + required everywhere)
// so it works unchanged across Gemini, Claude, and OpenAI structured outputs.
const PITCH_SCHEMA = {
  type: 'object',
  properties: {
    matchSummary: {
      type: 'object',
      properties: {
        score: { type: 'integer', description: 'Honest fit score, 0-100' },
        verdict: { type: 'string', description: 'Short label, e.g. "Strong match"' },
        oneLiner: { type: 'string', description: 'One-sentence hook' },
      },
      required: ['score', 'verdict', 'oneLiner'],
      additionalProperties: false,
    },
    tailoredResume: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        highlights: { type: 'array', items: { type: 'string' } },
        matchedSkills: { type: 'array', items: { type: 'string' } },
        relevantProjects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              why: { type: 'string', description: 'Why it matters for THIS role' },
            },
            required: ['title', 'why'],
            additionalProperties: false,
          },
        },
        education: { type: 'string' },
      },
      required: ['summary', 'highlights', 'matchedSkills', 'relevantProjects', 'education'],
      additionalProperties: false,
    },
    walkthrough: {
      type: 'array',
      description: 'Ordered tour, 4-6 beats. Start with wave, end with celebrate.',
      items: {
        type: 'object',
        properties: {
          anchor: {
            type: 'string',
            enum: ['summary', 'highlights', 'matchedSkills', 'relevantProjects', 'education'],
          },
          pose: { type: 'string', enum: ['wave', 'point', 'read', 'idle', 'celebrate'] },
          line: { type: 'string', description: 'What Clueless says, 1-2 sentences' },
        },
        required: ['anchor', 'pose', 'line'],
        additionalProperties: false,
      },
    },
    recommendedResumeVersion: { type: 'string' },
  },
  required: ['matchSummary', 'tailoredResume', 'walkthrough', 'recommendedResumeVersion'],
  additionalProperties: false,
}

function buildSystemPrompt(kb, mode) {
  return `You are "Clueless", the friendly, quietly-confident digital-pet mascot on Sai Akilesh Venigalla's portfolio site. Given a job description, you make the case for why Sai is a great fit — using ONLY the facts in the knowledge base below.

HARD RULES:
- NEVER invent experience, skills, employers, dates, or metrics that are not in the knowledge base. If the JD wants something Sai lacks, do not fake it — omit it, or honestly frame the closest real strength.
- Select and re-angle the MOST relevant real experience toward THIS specific job. Don't dump everything.
- Prefer concrete metrics that appear in the knowledge base.

VOICE: ${voiceFor(mode)}

OUTPUT (enforced by the response schema):
- matchSummary: an honest score 0-100, a short verdict label, and a one-line hook.
- tailoredResume.highlights: 3-5 bullets re-angled from the knowledge base, most relevant to the JD.
- tailoredResume.matchedSkills: skills the JD asks for that Sai genuinely has.
- tailoredResume.relevantProjects: the 1-3 knowledge-base projects that fit, each with a one-line "why it matters for this role".
- walkthrough: a 4-6 beat guided tour. Each beat picks one anchor, a pose, and a spoken line (1-2 sentences) arguing the fit like a proud pet showing off its human. Open with a "wave" beat; close with a "celebrate" beat; use "point" while making a case.
- recommendedResumeVersion: one of [${RESUME_VERSIONS.join(', ')}]. They are near-identical; use "v0" unless you have a specific reason.

KNOWLEDGE BASE:
${kb}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { success } = await rateLimit(req, { name: 'pitch', max: 10, window: '1 d' })
  if (!success) {
    res.status(429).json({ error: "Clueless needs a nap — you've hit today's limit. Try again later." })
    return
  }

  const { jobDescription, mode } = req.body || {}
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    res.status(400).json({ error: 'Paste a job description first (a few sentences at least).' })
    return
  }

  const kb = buildKnowledgeBase()
  const system = buildSystemPrompt(kb, mode)
  const prompt = `JOB DESCRIPTION:\n${jobDescription.slice(0, 8000)}`

  try {
    const provider = await getProvider()
    const pitch = await provider.generateJSON({ system, prompt, schema: PITCH_SCHEMA })
    if (!RESUME_VERSIONS.includes(pitch.recommendedResumeVersion)) {
      pitch.recommendedResumeVersion = 'v0'
    }
    res.status(200).json(pitch)
  } catch (err) {
    console.error('[pitch] generation failed:', err)
    res.status(500).json({ error: 'Clueless got stuck generating the pitch. Give it another try.' })
  }
}
