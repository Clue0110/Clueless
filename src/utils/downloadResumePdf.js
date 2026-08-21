// Shared "download this resume as a PDF" flow: POST the resume data (the
// resume.js shape) to /api/resume-pdf, save the returned bytes. The rendering
// happens server-side at a fixed desktop-Letter viewport, so the PDF looks
// identical whether the request came from a phone or a desktop.
export async function downloadResumePdf(data, { filename = 'Resume_Venigalla.pdf', fallbackHref = '/resume.pdf' } = {}) {
  try {
    const res = await fetch('/api/resume-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    })
    if (!res.ok || !res.headers.get('content-type')?.includes('pdf')) throw new Error('render failed')
    const url = URL.createObjectURL(await res.blob())
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    // Delay revocation — iOS Safari starts the save asynchronously.
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
    return true
  } catch {
    // API unavailable (static hosting / plain vite dev): open the static PDF.
    window.open(fallbackHref, '_blank', 'noopener')
    return false
  }
}
