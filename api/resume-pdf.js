// POST /api/resume-pdf — renders resume data (the resume.js shape) to a real
// PDF with headless Chromium and streams it back as a download. Used by the
// resume preview's Download button, so the PDF always matches what's on
// screen — including the LLM-tailored resume from the Clueless pitch.
import { buildResumeHtml } from './_resumeHtml.js'
import { rateLimit } from './_ratelimit.js'

// On Vercel/AWS we use @sparticuz/chromium's Linux binary; locally (vercel
// dev on a laptop) we fall back to an installed Chrome.
const LOCAL_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
]

async function launchBrowser() {
  const puppeteer = (await import('puppeteer-core')).default
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import('@sparticuz/chromium')).default
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }
  const { existsSync } = await import('node:fs')
  const executablePath = LOCAL_CHROME.find((p) => existsSync(p))
  if (!executablePath) throw new Error('No local Chrome found for PDF rendering')
  return puppeteer.launch({ executablePath, headless: true })
}

// Bound the untrusted payload: plain object, sane depth, no huge strings.
function sanePayload(data) {
  return (
    data &&
    typeof data === 'object' &&
    JSON.stringify(data).length < 60_000 &&
    typeof data.header === 'object' &&
    Array.isArray(data.experience)
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { success } = await rateLimit(req, { name: 'resume-pdf', max: 20, window: '1 d' })
  if (!success) {
    res.status(429).json({ error: "The printer needs a nap — you've hit today's limit." })
    return
  }

  const { data } = req.body || {}
  if (!sanePayload(data)) {
    res.status(400).json({ error: 'Missing or malformed resume data.' })
    return
  }

  let browser
  try {
    browser = await launchBrowser()
    const page = await browser.newPage()
    // JS off: the document is static and parts of it are LLM-generated.
    await page.setJavaScriptEnabled(false)
    await page.setContent(buildResumeHtml(data), { waitUntil: 'networkidle0', timeout: 20_000 })
    await page.evaluateHandle('document.fonts.ready').catch(() => {})

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.45in', bottom: '0.5in', left: '0.55in', right: '0.55in' },
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="Resume_Venigalla.pdf"')
    res.status(200).send(Buffer.from(pdf))
  } catch (err) {
    console.error('[resume-pdf] render failed:', err)
    res.status(500).json({
      error: 'PDF rendering hit a snag. Try again in a moment.',
      detail: String(err?.message || err).slice(0, 300),
    })
  } finally {
    await browser?.close().catch(() => {})
  }
}
