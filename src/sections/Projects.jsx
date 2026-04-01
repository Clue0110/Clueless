import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiChevronDown } from 'react-icons/fi'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import TiltCard from '../components/TiltCard'
import Tag from '../components/Tag'
import { projects } from '../data/content'
import { scaleIn } from '../utils/animations'
import { useIsMobile } from '../hooks/useIsMobile'

function ProjectCard({ project, index }) {
  const { isRecruiter, theme, mode } = useMode()
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const isMobile = useIsMobile()

  const description = isRecruiter ? project.description.recruiter : project.description.dev
  const bullets = isRecruiter ? project.bullets.recruiter : project.bullets.dev

  return (
    <motion.div variants={scaleIn} custom={index}>
      <TiltCard className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{project.emoji}</span>
            <h3 className={`text-xl font-bold ${theme.text} ${theme.font}`}>
              {project.title}
            </h3>
          </div>
          {project.link && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className={`${theme.muted} hover:${isRecruiter ? 'text-violet-400' : 'text-green-400'} transition-colors`}
              aria-label={`View ${project.title} on GitHub`}
            >
              <FiGithub size={18} />
            </motion.a>
          )}
        </div>

        {/* Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={mode + '-desc-' + project.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`text-sm mb-4 ${theme.muted} ${theme.font} leading-relaxed`}
          >
            {description}
          </motion.p>
        </AnimatePresence>

        {/* Mobile expand toggle */}
        {isMobile && (
          <button
            onClick={() => setMobileExpanded(e => !e)}
            className={`w-full flex items-center justify-between text-xs ${theme.accent} ${theme.font} py-1 mb-2`}
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
              <FiChevronDown size={14} />
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
              className="flex-1"
            >
              <AnimatePresence mode="wait">
                <motion.ul
                  key={mode + '-bullets-' + project.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2 mb-5"
                >
                  {bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-xs ${theme.muted} ${theme.font} leading-relaxed`}
                    >
                      <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${theme.accentBg}`} />
                      {bullet}
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
          {project.tags.map(tag => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </TiltCard>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <Section id="projects" title="Projects" devTitle="side_quests">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}
