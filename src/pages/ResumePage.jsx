import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiDownload, FiMail, FiGlobe, FiExternalLink } from 'react-icons/fi'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { useMode } from '../context/ModeContext'
import { resumeData } from '../data/resume'

export default function ResumePage() {
  const { setShowResume, isRecruiter, theme } = useMode()
  const { header, experience, projects, skills, education } = resumeData
  const accentColor = isRecruiter ? '#7c3aed' : '#10b981'

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
      <div className={`flex-shrink-0 flex items-center justify-between px-6 py-3 border-b ${theme.border} ${theme.card} backdrop-blur`}>
        <motion.button
          onClick={() => setShowResume(false)}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 text-sm ${theme.muted} transition-colors ${theme.font} hover:${isRecruiter ? 'text-violet-400' : 'text-green-400'}`}
        >
          <FiArrowLeft size={16} />
          {isRecruiter ? 'Back' : 'back'}
        </motion.button>

        <span className={`text-xs ${theme.muted} ${theme.font} hidden sm:block`}>
          {isRecruiter ? 'Sai Akilesh Venigalla — Resume' : 'resume.tsx'}
        </span>

        <motion.a
          href={`${import.meta.env.BASE_URL}resume.pdf`}
          download="Resume_Venigalla.pdf"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white ${theme.accentBg} ${theme.accentHover} transition-colors ${theme.font}`}
        >
          <FiDownload size={13} />
          {isRecruiter ? 'Download PDF' : 'download'}
        </motion.a>
      </div>

      {/* ── Scrollable area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center py-10 px-4 pb-20">

          {/* ── A4-ish document ── */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[780px] bg-white shadow-2xl"
            style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
          >
            <div className="px-10 pt-9 pb-11">

              {/* ── Header ── */}
              <div className="text-center pb-3 border-b-2" style={{ borderColor: accentColor }}>
                <h1
                  className="text-3xl font-black tracking-widest uppercase text-gray-900"
                  style={{ letterSpacing: '0.12em' }}
                >
                  {header.name}
                </h1>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  {header.location}&nbsp;&nbsp;·&nbsp;&nbsp;{header.tagline}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-gray-600">
                  <a href={`mailto:${header.email}`} className="flex items-center gap-1 hover:text-gray-900 underline underline-offset-2">
                    <FiMail size={10} /> {header.email}
                  </a>
                  <a href={header.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900 underline underline-offset-2">
                    <FiLinkedin size={10} /> {header.linkedinLabel}
                  </a>
                  <a href={header.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900 underline underline-offset-2">
                    <FiGithub size={10} /> {header.githubLabel}
                  </a>
                  <a href={header.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900 underline underline-offset-2">
                    <FiGlobe size={10} /> {header.websiteLabel}
                  </a>
                </div>
              </div>

              {/* ── Experience ── */}
              <ResumeSection title="Experience" accentColor={accentColor}>
                {experience.map((job, i) => (
                  <div key={i} className={i > 0 ? 'mt-4' : ''}>
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-[13px] font-bold text-gray-900">{job.company}</span>
                      <span className="text-[11px] text-gray-500 whitespace-nowrap font-medium">{job.period}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[12px] font-semibold text-gray-700 italic">{job.title}</span>
                      <span className="text-gray-400 text-[11px]">|</span>
                      <span className="text-[11px] text-gray-500 italic">{job.description}</span>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-[3px]">
                      {job.bullets.map((bullet, j) => (
                        <li key={j} className="text-[11.5px] text-gray-700 leading-relaxed">
                          <BulletText text={bullet} accentColor={accentColor} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ResumeSection>

              {/* ── Projects ── */}
              <ResumeSection title="Projects" accentColor={accentColor}>
                {projects.map((proj, i) => (
                  <div key={i} className={i > 0 ? 'mt-4' : ''}>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[13px] font-bold text-gray-900">{proj.title}</span>
                      <span className="text-gray-400 text-[11px]">|</span>
                      <span className="text-[11px] text-gray-500 italic">{proj.tech}</span>
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="ml-1 flex items-center gap-0.5 text-[11px] hover:text-gray-900 underline underline-offset-2" style={{ color: accentColor }}>
                        <FiExternalLink size={10} /> Link
                      </a>
                    </div>
                    <ul className="list-disc list-outside ml-5 space-y-[3px]">
                      {proj.bullets.map((bullet, j) => (
                        <li key={j} className="text-[11.5px] text-gray-700 leading-relaxed">
                          <BulletText text={bullet} accentColor={accentColor} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ResumeSection>

              {/* ── Technical Skills ── */}
              <ResumeSection title="Technical Skills" accentColor={accentColor}>
                <div className="space-y-[5px]">
                  {skills.map(({ category, items }, i) => (
                    <div key={i} className="flex gap-2 text-[11.5px]">
                      <span className="font-bold text-gray-800 w-44 shrink-0">{category}:</span>
                      <span className="text-gray-700">{items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </ResumeSection>

              {/* ── Education ── */}
              <ResumeSection title="Education" accentColor={accentColor}>
                {education.map((edu, i) => (
                  <div key={i} className={`flex justify-between items-baseline gap-2 ${i > 0 ? 'mt-2' : ''}`}>
                    <span className="text-[12px]">
                      <span className="font-bold text-gray-900">{edu.school}</span>
                      <span className="text-gray-600 italic">&nbsp;|&nbsp;{edu.degree}&nbsp;|&nbsp;GPA: {edu.gpa}</span>
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold whitespace-nowrap">{edu.period}</span>
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

// ── Section wrapper ──
function ResumeSection({ title, accentColor, children }) {
  return (
    <div className="mt-5">
      <div className="pb-[3px] mb-2" style={{ borderBottom: `1.5px solid ${accentColor}` }}>
        <h2
          className="text-[11px] font-black uppercase tracking-widest"
          style={{ color: accentColor, letterSpacing: '0.15em' }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

// ── Bold highlighting ──
// • **text** → bold + accent color (manual, controlled from resume.js)
function BulletText({ text, accentColor }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-bold" style={{ color: accentColor }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
