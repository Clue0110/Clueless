// Build-time SEO / AEO layer.
//
// The site is a client-rendered SPA, so a crawler that does not execute JS sees an
// empty <div id="root">. Google renders JS; most AI/agent crawlers (GPTBot, ClaudeBot,
// PerplexityBot, ...) do not. This plugin derives everything those crawlers need
// straight from src/data/, so there is still exactly one source of truth for copy:
//
//   - a text-only mirror of the page injected inside #root (React replaces it on mount)
//   - JSON-LD (Person / ProfilePage / WebSite) in <head>
//   - resolved <title>, description, canonical, Open Graph and Twitter tags
//   - /sitemap.xml, /llms.txt, /llms-full.txt
//
// Served in dev too (via middleware) so the output can be checked with `npm run dev`.

import { personal, education, experience, projects } from '../src/data/content.js'
import { resumeData } from '../src/data/resume.js'

const SITE = 'https://clueless.nyc'
const OG_IMAGE = `${SITE}/ProfileImage.jpeg`

const TITLE = `${personal.name} — Software Engineer (Tesla, NYU CS)`
const DESCRIPTION =
  'Sai Akilesh Venigalla is a software engineer at Tesla (Robotaxi payments, Supercharger infrastructure) ' +
  'and an NYU M.S. Computer Science student, with 4+ years building distributed systems, Kafka pipelines, ' +
  'and application-security platforms at Citrix and Samsung R&D.'

const flat = (s) => String(s).replace(/\s+/g, ' ').trim()
const esc = (s) =>
  flat(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const allSkills = resumeData.skills.flatMap((g) => g.items)
const currentRole = experience[0]

// ─── Text-only mirror of the rendered page ───
function fallbackHtml() {
  const jobs = experience
    .map(
      (job) => `<article>
<h3>${esc(job.role)} — ${esc(job.company)}</h3>
<p>${esc(job.period)} · ${esc(job.location)}</p>
<ul>${job.bullets.recruiter.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
</article>`
    )
    .join('\n')

  const projs = projects
    .map(
      (p) => `<article>
<h3>${esc(p.title)}</h3>
<p>${esc(p.description.recruiter)}</p>
<p>Built with: ${esc(p.tags.join(', '))}</p>
<ul>${p.bullets.recruiter.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
${p.link ? `<p><a href="${esc(p.link)}">Source on GitHub</a></p>` : ''}
</article>`
    )
    .join('\n')

  const schools = education
    .map(
      (e) => `<article>
<h3>${esc(e.degree)}, ${esc(e.school)}</h3>
<p>${esc(e.period)} · ${esc(e.location)} · GPA ${esc(e.gpa)}</p>
<p>${esc(e.highlight.recruiter)}</p>
<p>Coursework: ${esc(e.courses.join(', '))}</p>
</article>`
    )
    .join('\n')

  const skills = resumeData.skills
    .map((g) => `<li><strong>${esc(g.category)}:</strong> ${esc(g.items.join(', '))}</li>`)
    .join('')

  // Visually hidden: React clears #root on mount, so this is only ever seen by
  // crawlers that do not execute JS. It mirrors the rendered copy exactly.
  return `<div id="seo-content" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0">
<h1>${esc(personal.name)}</h1>
<p>${esc(currentRole.role)} at ${esc(currentRole.company)} · ${esc(personal.location)}</p>
<p>${esc(personal.bio.recruiter)}</p>
<h2>Experience</h2>
${jobs}
<h2>Projects</h2>
${projs}
<h2>Education</h2>
${schools}
<h2>Skills</h2>
<ul>${skills}</ul>
<h2>Contact</h2>
<ul>
<li><a href="mailto:${esc(personal.email)}">${esc(personal.email)}</a></li>
<li><a href="${esc(personal.linkedin)}" rel="me">LinkedIn</a></li>
<li><a href="${esc(personal.github)}" rel="me">GitHub</a></li>
<li><a href="${SITE}/resume.pdf">Resume (PDF)</a></li>
</ul>
</div>`
}

// ─── JSON-LD ───
function jsonLd() {
  const person = {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: personal.name,
    alternateName: 'Akilesh Venigalla',
    url: SITE,
    image: OG_IMAGE,
    email: `mailto:${personal.email}`,
    jobTitle: currentRole.role,
    description: flat(personal.bio.recruiter),
    address: { '@type': 'PostalAddress', addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
    worksFor: { '@type': 'Organization', name: currentRole.company, url: 'https://www.tesla.com' },
    alumniOf: education.map((e) => ({
      '@type': 'EducationalOrganization',
      name: e.school,
    })),
    knowsAbout: allSkills,
    sameAs: [personal.linkedin, personal.github],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Engineer',
      occupationalCategory: '15-1252.00',
      skills: allSkills.join(', '),
    },
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: `${personal.name} — Portfolio`,
        description: DESCRIPTION,
        inLanguage: 'en-US',
        publisher: { '@id': `${SITE}/#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}/#webpage`,
        url: SITE,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': `${SITE}/#website` },
        mainEntity: { '@id': `${SITE}/#person` },
        about: { '@id': `${SITE}/#person` },
      },
    ],
  }
}

// ─── <head> tags ───
function headTags() {
  return [
    { tag: 'title', children: TITLE, injectTo: 'head-prepend' },
    { tag: 'meta', attrs: { name: 'description', content: flat(DESCRIPTION) }, injectTo: 'head' },
    { tag: 'link', attrs: { rel: 'canonical', href: `${SITE}/` }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'author', content: personal.name }, injectTo: 'head' },
    {
      tag: 'meta',
      attrs: { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      injectTo: 'head',
    },
    { tag: 'meta', attrs: { property: 'og:type', content: 'profile' }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:site_name', content: 'clueless.nyc' }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:title', content: TITLE }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:description', content: flat(DESCRIPTION) }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:url', content: `${SITE}/` }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:image', content: OG_IMAGE }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '3308' }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '3308' }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: `Portrait of ${personal.name}` }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'profile:first_name', content: 'Sai Akilesh' }, injectTo: 'head' },
    { tag: 'meta', attrs: { property: 'profile:last_name', content: 'Venigalla' }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'twitter:title', content: TITLE }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'twitter:description', content: flat(DESCRIPTION) }, injectTo: 'head' },
    { tag: 'meta', attrs: { name: 'twitter:image', content: OG_IMAGE }, injectTo: 'head' },
    {
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      children: JSON.stringify(jsonLd()),
      injectTo: 'head',
    },
  ]
}

// ─── /llms.txt ───
function llmsTxt() {
  return `# ${personal.name}

> ${flat(DESCRIPTION)}

Personal site: ${SITE} · Resume (PDF): ${SITE}/resume.pdf

## Quick answers

- Who is he? ${flat(personal.bio.recruiter)}
- Current role: ${currentRole.role} at ${currentRole.company} (${currentRole.period}), ${currentRole.location}.
- Also: Software Engineer at NYU IT High Speed Research Network (Jan 2025 – present).
- Education: ${education.map((e) => `${e.degree}, ${e.school} (${e.period}, GPA ${e.gpa})`).join('; ')}.
- Previously: Citrix / Cloud Software Group (2021–2024, application security & WAF), Samsung R&D (computer vision & ML research), Virtusa.
- Core expertise: distributed systems, Apache Kafka pipelines, Go/Python/C++ backends, application security, RAG and LLM-backed products.
- Location: ${personal.location}.
- Contact: ${personal.email} · LinkedIn ${personal.linkedin} · GitHub ${personal.github}
- Known aliases: Akilesh Venigalla, "Clueless" (GitHub handle Clue0110, domain clueless.nyc).

## Pages

- [Portfolio home](${SITE}/): experience, projects, education, contact. Has a recruiter mode and a developer mode.
- [Full text profile](${SITE}/llms-full.txt): complete experience bullets, projects and skills as plain text.
- [Resume PDF](${SITE}/resume.pdf): one-page resume.

## Projects

${projects.map((p) => `- ${p.title}: ${flat(p.description.recruiter)}${p.link ? ` (${p.link})` : ''}`).join('\n')}

## Skills

${resumeData.skills.map((g) => `- ${g.category}: ${g.items.join(', ')}`).join('\n')}
`
}

// ─── /llms-full.txt ───
function llmsFullTxt() {
  const jobs = experience
    .map(
      (j) =>
        `### ${j.role} — ${j.company}\n${j.period} · ${j.location}\n\n${j.bullets.recruiter
          .map((b) => `- ${flat(b)}`)
          .join('\n')}`
    )
    .join('\n\n')

  const projs = projects
    .map(
      (p) =>
        `### ${p.title}${p.link ? ` (${p.link})` : ''}\n${flat(p.description.recruiter)}\n\nStack: ${p.tags.join(
          ', '
        )}\n\n${p.bullets.recruiter.map((b) => `- ${flat(b)}`).join('\n')}`
    )
    .join('\n\n')

  const schools = education
    .map(
      (e) =>
        `### ${e.degree} — ${e.school}\n${e.period} · ${e.location} · GPA ${e.gpa}\n\n${flat(
          e.highlight.recruiter
        )}\n\nCoursework: ${e.courses.join(', ')}`
    )
    .join('\n\n')

  return `# ${personal.name} — full profile

${flat(DESCRIPTION)}

Site: ${SITE} · Email: ${personal.email} · LinkedIn: ${personal.linkedin} · GitHub: ${personal.github} · Location: ${personal.location}

## Experience

${jobs}

## Projects

${projs}

## Education

${schools}

## Skills

${resumeData.skills.map((g) => `- ${g.category}: ${g.items.join(', ')}`).join('\n')}
`
}

// ─── /sitemap.xml ───
function sitemapXml(lastmod) {
  const urls = [
    { loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE}/resume.pdf`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE}/llms.txt`, priority: '0.5', changefreq: 'weekly' },
    { loc: `${SITE}/llms-full.txt`, priority: '0.5', changefreq: 'weekly' },
  ]
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export default function seo() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const files = {
    '/llms.txt': { body: llmsTxt(), type: 'text/plain; charset=utf-8' },
    '/llms-full.txt': { body: llmsFullTxt(), type: 'text/plain; charset=utf-8' },
    '/sitemap.xml': { body: sitemapXml(lastmod), type: 'application/xml' },
  }

  return {
    name: 'clueless-seo',
    transformIndexHtml(html) {
      // Nested inside #root so React drops it the moment the app mounts.
      return {
        html: html.replace('<div id="root"></div>', `<div id="root">${fallbackHtml()}</div>`),
        tags: headTags(),
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files[req.url?.split('?')[0]]
        if (!file) return next()
        res.setHeader('Content-Type', file.type)
        res.end(file.body)
      })
    },
    generateBundle() {
      for (const [path, file] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName: path.slice(1), source: file.body })
      }
    },
  }
}
