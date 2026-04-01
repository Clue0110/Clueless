import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import { personal, stats } from '../data/content'

import TerminalAbout from '../components/TerminalAbout'
import RecruiterStatPills from '../components/RecruiterStatPills'

export default function About() {
  const { isRecruiter, isDev, theme, mode } = useMode()

  const bio = isRecruiter ? personal.bio.recruiter : personal.bio.dev
  const currentStats = isRecruiter ? stats.recruiter : stats.dev

  return (
    <Section id="about" title="About" devTitle="about me">
      <AnimatePresence mode="wait">
        {isDev ? (
          <motion.div
            key="dev-about"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <TerminalAbout />
          </motion.div>
        ) : (
          <motion.div
            key="recruiter-about"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top row: bio */}
            <div className="mb-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={mode + '-bio'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={`text-base md:text-lg leading-relaxed ${theme.muted} ${theme.font} transition-all duration-500`}
                >
                  {bio}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Stats pills */}
            <RecruiterStatPills />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
