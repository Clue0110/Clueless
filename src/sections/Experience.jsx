import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import { experience } from '../data/content'
import { fadeInUp, fadeInLeft } from '../utils/animations'

function ExperienceCard({ job, index }) {
  const { isRecruiter, theme, mode } = useMode()
  const [expanded, setExpanded] = useState(false)

  const bullets = isRecruiter ? job.bullets.recruiter : job.bullets.dev
  const visibleBullets = expanded ? bullets : bullets.slice(0, 3)
  const hasMore = bullets.length > 3

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="relative pl-8 md:pl-12 pb-12 group"
    >
      {/* Timeline line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-px transition-colors duration-500`}
        style={{ backgroundColor: `${job.color}30` }}
      />

      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-[5.5px] ring-4 ring-black/50"
        style={{ backgroundColor: job.color }}
        whileHover={{ scale: 1.4 }}
      />

      {/* Card */}
      <div className={`${theme.card} border ${theme.border} rounded-2xl p-6 glass glass-hover transition-all duration-500`}>
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

        {/* Bullets */}
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

        {/* Expand/collapse */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`mt-4 text-xs ${theme.accent} ${theme.font} hover:underline`}
          >
            {expanded
              ? (isRecruiter ? 'Show Less' : 'collapse()')
              : (isRecruiter ? `Show ${bullets.length - 3} More` : `expand(${bullets.length - 3} more)`)
            }
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <Section id="experience" title="Experience" devTitle="work_history">
      <div className="relative">
        {experience.map((job, i) => (
          <ExperienceCard key={job.company + job.role} job={job} index={i} />
        ))}
      </div>
    </Section>
  )
}
