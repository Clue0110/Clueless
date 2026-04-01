import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import TiltCard from '../components/TiltCard'
import Tag from '../components/Tag'
import { projects } from '../data/content'
import { fadeInUp, scaleIn } from '../utils/animations'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

function ProjectCard({ project, index }) {
  const { isRecruiter, theme, mode } = useMode()

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

        {/* Bullets */}
        <AnimatePresence mode="wait">
          <motion.ul
            key={mode + '-bullets-' + project.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 mb-5 flex-1"
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
