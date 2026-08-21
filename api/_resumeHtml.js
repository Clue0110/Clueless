// Renders resume data (the resume.js shape) to a self-contained HTML document
// that mirrors src/pages/ResumePage.jsx — Computer Modern serif, small-caps
// headings, thin rules, bold dates flush right. resume-pdf.js prints it to PDF
// with headless Chromium, so what downloads is exactly what the preview shows.

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Escape first, then turn **…** markers into real <b> — same rule as the
// site's <Bullet> component.
const rich = (s = '') => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')

const bullets = (items = []) =>
  `<ul>${items.map((b) => `<li><span class="dot">•</span><span>${rich(b)}</span></li>`).join('')}</ul>`

export function buildResumeHtml(data) {
  const { header = {}, experience = [], projects = [], skills = [], education = [] } = data

  const contact = [
    header.phone && esc(header.phone),
    header.email && `<a href="mailto:${esc(header.email)}">${esc(header.email)}</a>`,
    header.linkedin && `<a href="${esc(header.linkedin)}">${esc(header.linkedinLabel || header.linkedin)}</a>`,
    header.github && `<a href="${esc(header.github)}">${esc(header.githubLabel || header.github)}</a>`,
    header.website && `<a href="${esc(header.website)}">${esc(header.websiteLabel || header.website)}</a>`,
  ]
    .filter(Boolean)
    .join('<span class="sep">|</span>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/computer-modern@0.1.2/cmu-serif.css">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { color-scheme: light only; }
  body {
    font-family: "CMU Serif", "Computer Modern", Georgia, "Times New Roman", serif;
    background: #fff; color: #000; font-size: 12.5px; line-height: 1.45;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  a { color: #000; text-decoration: underline; text-underline-offset: 2px; }
  .center { text-align: center; }
  h1 { font-size: 30px; font-weight: 500; font-variant: small-caps; letter-spacing: 0.04em; line-height: 1.15; }
  .subline { font-size: 12.5px; margin-top: 2px; }
  .contact { font-size: 11.5px; margin-top: 3px; }
  .sep { color: #6b7280; margin: 0 7px; }
  h2 {
    font-size: 15px; font-weight: 500; font-variant: small-caps; letter-spacing: 0.02em;
    border-bottom: 1px solid #000; padding-bottom: 2px; margin: 14px 0 6px;
  }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .title { font-size: 13.5px; font-weight: 700; }
  .period { font-size: 12px; font-weight: 700; white-space: nowrap; }
  .meta { font-size: 12.5px; font-style: italic; margin-bottom: 2px; }
  .meta b { font-style: italic; }
  .meta .desc { color: #1f2937; }
  .job + .job { margin-top: 10px; }
  .proj + .proj { margin-top: 8px; }
  ul { list-style: none; margin-left: 14px; }
  li { display: flex; gap: 7px; font-size: 12px; line-height: 1.5; }
  .dot { user-select: none; }
  .edu + .edu { margin-top: 4px; }
  .edu .left { font-size: 12.5px; }
</style>
</head>
<body>
  <div class="center">
    <h1>${esc(header.name || '')}</h1>
    <div class="subline">${esc(header.location || '')}<span class="sep">|</span>${esc(header.tagline || '')}</div>
    <div class="contact">${contact}</div>
  </div>

  <h2>Experience</h2>
  ${experience
    .map(
      (job) => `<div class="job">
        <div class="row"><span class="title">${esc(job.title)}</span><span class="period">${esc(job.period)}</span></div>
        <div class="meta"><b>${esc(job.company)}</b><span class="sep">|</span><span class="desc">${esc(job.description || '')}</span></div>
        ${bullets(job.bullets)}
      </div>`,
    )
    .join('')}

  <h2>Projects</h2>
  ${projects
    .map(
      (proj) => `<div class="proj">
        <div class="row">
          <span><span class="title" style="font-size:12.5px">${esc(proj.title)}</span><span class="sep">|</span><i style="color:#1f2937">${esc(proj.tech || '')}</i></span>
          ${proj.link ? `<a class="period" href="${esc(proj.link)}">Link</a>` : ''}
        </div>
        ${bullets(proj.bullets)}
      </div>`,
    )
    .join('')}

  <h2>Technical Skills</h2>
  ${bullets(skills.map((g) => `**${g.category}**: ${(g.items || []).join(', ')}`))}

  <h2>Education</h2>
  ${education
    .map(
      (edu) => `<div class="edu row">
        <span class="left"><b>${esc(edu.school)}</b><span class="sep">|</span><i style="color:#1f2937">${esc(edu.degree)}</i><span class="sep">|</span>GPA: ${esc(edu.gpa)}</span>
        <span class="period">${esc(edu.period)}</span>
      </div>`,
    )
    .join('')}
</body>
</html>`
}
