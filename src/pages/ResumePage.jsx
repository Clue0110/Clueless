import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiDownload, FiMail, FiGlobe, FiExternalLink, FiPhone } from 'react-icons/fi'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { useMode } from '../context/ModeContext'
import { resumeData } from '../data/resume'
import 'computer-modern/cmu-serif.css'

// The document mimics the LaTeX (Jake's Resume) template the PDF is built
// from: Computer Modern serif, all-black ink, small-caps name, thin rules
// under section titles, bold dates flush right. Mode theming stays out of
// the page itself — only the chrome (top bar) follows the site theme.
const CMU = '"CMU Serif", "Computer Modern", Georgia, "Times New Roman", serif'

// By default this renders the static resumeData and closes via the mode
// context. The Clueless pitch reuses it with `data` = an LLM-tailored resume
// in the same shape, its own onClose, and the recommended PDF version.
export default function ResumePage({ data = resumeData, onClose = null, pdfHref = null, tailored = false }) {
  const { setShowResume, isRecruiter, theme } = useMode()
  const { header, experience, projects, skills, education } = data
  const close = onClose || (() => setShowResume(false))
  const pdf = pdfHref || `${import.meta.env.BASE_URL}resume.pdf`

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: 'rgba(5, 5, 10, 0.97)' }}
    >
      {/* ── Top bar ── */}
      <div className={`flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-6 py-2 border-b ${theme.border} ${theme.card} backdrop-blur`}>
        <motion.button
          onClick={close}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className={`flex min-h-11 items-center gap-2 pr-2 text-sm ${theme.muted} transition-colors ${theme.font} hover:${isRecruiter ? 'text-violet-400' : 'text-green-400'}`}
        >
          <FiArrowLeft size={16} />
          {isRecruiter ? 'Back' : 'back'}
        </motion.button>

        <span className={`text-xs ${theme.muted} ${theme.font} hidden sm:block`}>
          {tailored ? 'tailored for this role ✨' : isRecruiter ? 'Sai Akilesh Venigalla — Resume' : 'resume.tex'}
        </span>

        <div className="flex items-center gap-2">
          <motion.a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`flex min-h-11 items-center gap-2 px-3 sm:px-4 rounded-lg text-xs font-semibold ${theme.accent} border ${theme.border} transition-colors ${theme.font}`}
          >
            <FiExternalLink size={13} />
            {isRecruiter ? 'View PDF' : 'view'}
          </motion.a>
          <motion.a
            href={pdf}
            download="Resume_Venigalla.pdf"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`flex min-h-11 items-center gap-2 px-3 sm:px-4 rounded-lg text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} transition-colors ${theme.font}`}
          >
            <FiDownload size={13} />
            {isRecruiter ? 'Download PDF' : 'download'}
          </motion.a>
        </div>
      </div>

      {/* ── Scrollable area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center py-5 px-2 pb-16 sm:py-10 sm:px-4 sm:pb-20">

          {/* ── A4-ish document ── */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[820px] bg-white text-black shadow-2xl"
            style={{ fontFamily: CMU }}
          >
            <div className="px-4 pt-7 pb-9 sm:px-12 sm:pt-10 sm:pb-12">

              {/* ── Header ── */}
              <div className="text-center">
                <h1
                  className="text-[26px] sm:text-[34px] leading-tight text-black"
                  style={{ fontVariant: 'small-caps', letterSpacing: '0.04em', fontWeight: 500 }}
                >
                  {header.name}
                </h1>
                <p className="text-[12px] sm:text-[13px] text-black mt-0.5">
                  {header.location}
                  <span className="mx-2 text-gray-500">|</span>
                  {header.tagline}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 mt-1 text-[11px] sm:text-[12px] text-black">
                  {header.phone && (
                    <span className="flex items-center gap-1">
                      <FiPhone size={10} /> {header.phone}
                    </span>
                  )}
                  <a href={`mailto:${header.email}`} className="flex items-center gap-1 underline underline-offset-2 hover:text-gray-600">
                    <FiMail size={10} /> {header.email}
                  </a>
                  <a href={header.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline underline-offset-2 hover:text-gray-600">
                    <FiLinkedin size={10} /> {header.linkedinLabel}
                  </a>
                  <a href={header.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline underline-offset-2 hover:text-gray-600">
                    <FiGithub size={10} /> {header.githubLabel}
                  </a>
                  <a href={header.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline underline-offset-2 hover:text-gray-600">
                    <FiGlobe size={10} /> {header.websiteLabel}
                  </a>
                </div>
              </div>

              {/* ── Experience ── */}
              <ResumeSection title="Experience">
                {experience.map((job, i) => (
                  <div key={i} className={i > 0 ? 'mt-3.5' : ''}>
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-[13px] sm:text-[14px] font-bold text-black">{job.title}</span>
                      <span className="text-[11px] sm:text-[12.5px] font-bold text-black whitespace-nowrap">{job.period}</span>
                    </div>
                    <div className="text-[12px] sm:text-[13px] italic leading-snug mb-1">
                      <span className="font-bold text-black">{job.company}</span>
                      <span className="mx-1.5 text-gray-500 not-italic">|</span>
                      <span className="text-gray-800">{job.description}</span>
                    </div>
                    <ul className="ml-4 space-y-[2px]">
                      {job.bullets.map((bullet, j) => (
                        <Bullet key={j} text={bullet} />
                      ))}
                    </ul>
                  </div>
                ))}
              </ResumeSection>

              {/* ── Projects ── */}
              <ResumeSection title="Projects">
                {projects.map((proj, i) => (
                  <div key={i} className={i > 0 ? 'mt-3' : ''}>
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <span className="text-[12px] sm:text-[13px] leading-snug">
                        <span className="font-bold text-black">{proj.title}</span>
                        <span className="mx-1.5 text-gray-500">|</span>
                        <span className="italic text-gray-800">{proj.tech}</span>
                      </span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] sm:text-[12.5px] font-bold text-black underline underline-offset-2 whitespace-nowrap hover:text-gray-600"
                        >
                          Link
                        </a>
                      )}
                    </div>
                    <ul className="ml-4 space-y-[2px]">
                      {proj.bullets.map((bullet, j) => (
                        <Bullet key={j} text={bullet} />
                      ))}
                    </ul>
                  </div>
                ))}
              </ResumeSection>

              {/* ── Technical Skills ── */}
              <ResumeSection title="Technical Skills">
                <ul className="ml-4 space-y-[2px]">
                  {skills.map(({ category, items }, i) => (
                    <Bullet key={i} text={`**${category}**: ${items.join(', ')}`} />
                  ))}
                </ul>
              </ResumeSection>

              {/* ── Education ── */}
              <ResumeSection title="Education">
                {education.map((edu, i) => (
                  <div key={i} className={`flex justify-between items-baseline gap-2 ${i > 0 ? 'mt-1.5' : ''}`}>
                    <span className="text-[12px] sm:text-[13px] leading-snug">
                      <span className="font-bold text-black">{edu.school}</span>
                      <span className="mx-1.5 text-gray-500">|</span>
                      <span className="italic text-gray-800">{edu.degree}</span>
                      <span className="mx-1.5 text-gray-500">|</span>
                      <span className="text-black">GPA: {edu.gpa}</span>
                    </span>
                    <span className="text-[11px] sm:text-[12.5px] font-bold text-black whitespace-nowrap">{edu.period}</span>
                  </div>
                ))}
              </ResumeSection>

            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Section wrapper: LaTeX \section — title with a thin full-width rule ──
function ResumeSection({ title, children }) {
  return (
    <div className="mt-4 sm:mt-5">
      <h2
        className="text-[14px] sm:text-[16px] text-black pb-[2px] mb-1.5 border-b border-black"
        style={{ fontVariant: 'small-caps', fontWeight: 500, letterSpacing: '0.02em' }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

// ── Bullet with LaTeX-style ∙ marker; **text** renders bold black ──
function Bullet({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <li className="flex gap-2 text-[11.5px] sm:text-[12.5px] text-black leading-relaxed">
      <span className="select-none">•</span>
      <span>
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={i} className="font-bold text-black">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    </li>
  )
}
