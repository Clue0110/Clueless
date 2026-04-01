import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import Tag from '../components/Tag'
import { education } from '../data/content'
import { fadeInUp } from '../utils/animations'

function EduCard({ edu, index }) {
  const { isRecruiter, theme, mode } = useMode()

  const highlight = isRecruiter ? edu.highlight.recruiter : edu.highlight.dev

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className={`${theme.card} border ${theme.border} rounded-2xl p-6 glass glass-hover transition-all duration-500`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className={`text-xl font-bold ${theme.text} ${theme.font}`}>
            {edu.school}
          </h3>
          <p className={`text-sm ${theme.accent} ${theme.font}`}>
            {edu.degree}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full border ${theme.tagBg} ${theme.tagText} ${theme.tagBorder} ${theme.font}`}>
            {edu.period}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full border ${theme.tagBg} ${theme.tagText} ${theme.tagBorder} font-mono`}>
            GPA: {edu.gpa}
          </span>
        </div>
      </div>

      {/* Honors */}
      {edu.honors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {edu.honors.map(h => (
            <span key={h} className={`text-xs px-2 py-0.5 rounded-full ${theme.accentBg} text-white font-medium`}>
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Highlight */}
      <AnimatePresence mode="wait">
        <motion.p
          key={mode + '-edu-' + edu.school}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`text-sm mb-4 ${theme.muted} ${theme.font} leading-relaxed`}
        >
          {isRecruiter ? '' : '// '}
          {highlight}
        </motion.p>
      </AnimatePresence>

      {/* Courses */}
      <div className="flex flex-wrap gap-1.5">
        {edu.courses.map(course => (
          <Tag key={course} label={course} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Education() {
  return (
    <Section id="education" title="Education" devTitle="education">
      <div className="grid gap-6">
        {education.map((edu, i) => (
          <EduCard key={edu.school} edu={edu} index={i} />
        ))}
      </div>
    </Section>
  )
}
