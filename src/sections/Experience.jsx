import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import { experience } from '../data/content'
import { fadeInUp } from '../utils/animations'
import { useIsMobile } from '../hooks/useIsMobile'

// Recruiter mode: the quiet gutter-timeline look — mono dates on the left, a
// brand-colored dot by the role, dash bullets, and a "+ n more" expander.
function RecruiterExperienceRow({ job }) {
  const [expanded, setExpanded] = useState(false)
  const bullets = job.bullets.recruiter
  const shown = expanded ? bullets : bullets.slice(0, 3)
  const hidden = bullets.length - 3

  return (
    <motion.div variants={fadeInUp} className="grid gap-2 sm:grid-cols-[200px_1fr] sm:gap-10">
      <div className="pt-1">
        <div className="font-mono text-xs leading-5 text-slate-500">{job.period}</div>
        <div className="mt-0.5 font-mono text-xs leading-5 text-slate-600">{job.location}</div>
      </div>
      <div>
        <div className="flex items-baseline gap-2.5">
          <span
            className="relative top-[-1px] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: job.color }}
          />
          <h3 className="font-medium text-slate-200">
            {job.role} <span className="text-slate-500">· {job.company}</span>
          </h3>
        </div>
        <ul className="mt-3 space-y-2">
          {shown.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-400">
              <span className="select-none text-slate-600">–</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {hidden > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-2.5 min-h-8 font-mono text-xs text-violet-400 transition-colors hover:text-violet-300"
          >
            {expanded ? '– show less' : `+ ${hidden} more`}
          </button>
        )}
      </div>
    </motion.div>
  )
}

function ExperienceCard({ job, index }) {
  const { isRecruiter, theme, mode } = useMode()
  const [expanded, setExpanded] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const isMobile = useIsMobile()

  const bullets = isRecruiter ? job.bullets.recruiter : job.bullets.dev
  const visibleBullets = isMobile ? bullets : (expanded ? bullets : bullets.slice(0, 3))
  const hasMore = !isMobile && bullets.length > 3

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="relative pl-8 md:pl-12 pb-12 group"
    >
      {/* Timeline line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px transition-colors duration-500"
        style={{ backgroundColor: `${job.color}30` }}
      />

      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-[5.5px] ring-4 ring-black/50"
        style={{ backgroundColor: job.color }}
        whileHover={{ scale: 1.4 }}
      />

      {/* Card */}
      <div className={`${theme.card} border ${theme.border} rounded-2xl p-4 sm:p-6 glass glass-hover transition-all duration-500`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className={`text-xl font-bold ${theme.text} ${theme.font}`}>
              {isRecruiter ? job.role : job.role.toLowerCase()}
            </h3>
            <p className={`text-sm ${theme.accent} ${theme.font}`}>
              {isRecruiter ? job.company : job.company.toLowerCase()}
              <span className={theme.muted}> · {job.location}</span>
            </p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${theme.tagBg} ${theme.tagText} ${theme.tagBorder} whitespace-nowrap ${theme.font}`}>
            {job.period}
          </span>
        </div>

        {/* Mobile expand toggle */}
        {isMobile && (
          <button
            onClick={() => setMobileExpanded(e => !e)}
            className={`w-full flex min-h-11 items-center justify-between text-sm ${theme.accent} ${theme.font} py-2 mb-1`}
          >
            <span>
              {mobileExpanded
                ? (isRecruiter ? 'Hide details' : 'collapse()')
                : (isRecruiter ? 'Show details' : 'expand()')
              }
            </span>
            <motion.span
              animate={{ rotate: mobileExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown size={16} />
            </motion.span>
          </button>
        )}

        {/* Bullets */}
        <AnimatePresence initial={false}>
          {(!isMobile || mobileExpanded) && (
            <motion.div
              key="bullets"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.ul
                  key={mode + '-bullets-' + job.company + (expanded ? '-exp' : '-col')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {visibleBullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-3 text-sm ${theme.muted} ${theme.font} leading-relaxed`}
                    >
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.accentBg}`} />
                      {bullet}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>

              {/* Desktop show more/less */}
              {hasMore && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  className={`mt-4 text-xs ${theme.accent} ${theme.font} hover:underline`}
                >
                  {expanded
                    ? (isRecruiter ? 'Show Less' : 'collapse()')
                    : (isRecruiter ? `Show ${bullets.length - 3} More` : `expand(${bullets.length - 3} more)`)
                  }
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const { isRecruiter, mode } = useMode()
  return (
    // Keyed by mode: the recruiter/dev layouts are different trees, and children
    // mounted after the Section's once-only stagger has fired would otherwise
    // stay stuck in their hidden variant. Remounting re-runs the entrance.
    <Section key={mode} id="experience" title="Experience" devTitle="work_history">
      {isRecruiter ? (
        <div className="space-y-12">
          {experience.map((job) => (
            <RecruiterExperienceRow key={job.company + job.role} job={job} />
          ))}
        </div>
      ) : (
        <div className="relative">
          {experience.map((job, i) => (
            <ExperienceCard key={job.company + job.role} job={job} index={i} />
          ))}
        </div>
      )}
    </Section>
  )
}
