// Knowledge base for Clueless — the single source of grounding truth.
// Built from the same portfolio data the site renders, so the pet can never
// contradict the site or invent experience that isn't here.
import { personal, education, experience, projects } from '../src/data/content.js'
import { resumeData } from '../src/data/resume.js'

// Serialize the portfolio into a compact, factual text block. We use the
// recruiter-variant copy because it's the most metric-dense and literal —
// tone/voice is applied later in each endpoint's system prompt, not here.
export function buildKnowledgeBase() {
  const lines = []

  lines.push(`# Candidate: ${personal.name}`)
  lines.push(`Location: ${personal.location}`)
  lines.push(`Links: ${personal.github} | ${personal.linkedin} | ${personal.website}`)
  lines.push(`Summary: ${personal.bio.recruiter}`)
  lines.push('')

  lines.push('# Work Experience')
  for (const job of experience) {
    lines.push(`## ${job.role} — ${job.company} (${job.period}, ${job.location})`)
    for (const bullet of job.bullets.recruiter) lines.push(`- ${bullet}`)
    lines.push('')
  }

  lines.push('# Projects')
  for (const p of projects) {
    lines.push(`## ${p.title} — ${p.tags.join(', ')}${p.link ? ` (${p.link})` : ''}`)
    lines.push(p.description.recruiter)
    for (const bullet of p.bullets.recruiter) lines.push(`- ${bullet}`)
    lines.push('')
  }

  lines.push('# Skills')
  for (const group of resumeData.skills) {
    lines.push(`- ${group.category}: ${group.items.join(', ')}`)
  }
  lines.push('')

  lines.push('# Education')
  for (const e of education) {
    lines.push(`## ${e.degree} — ${e.school} (${e.period}, GPA ${e.gpa})`)
    if (e.honors?.length) lines.push(`Honors: ${e.honors.join(', ')}`)
    lines.push(`Relevant coursework: ${e.courses.join(', ')}`)
    if (e.highlight?.recruiter) lines.push(e.highlight.recruiter)
    lines.push('')
  }

  return lines.join('\n').trim()
}

// The versioned resume PDFs available for the pet to recommend (public/resume/vN).
export const RESUME_VERSIONS = ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9']
