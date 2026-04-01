import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import { personal, stats } from '../data/content'
import { fadeInUp, scaleIn } from '../utils/animations'
import TerminalAbout from '../components/TerminalAbout'
import RecruiterStatPills from '../components/RecruiterStatPills'

export default function About() {
  const { isRecruiter, isDev, theme, mode } = useMode()

  const bio = isRecruiter ? personal.bio.recruiter : personal.bio.dev
  const currentStats = isRecruiter ? stats.recruiter : stats.dev

  return (
    <Section id="about" title="About" devTitle="about me">
      {isDev ? (
        <motion.div variants={fadeInUp}>
          <TerminalAbout />
        </motion.div>
      ) : (
        <>
          {/* Top row: bio */}
          <div className="mb-10">
            <motion.div variants={fadeInUp}>
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
            </motion.div>
          </div>

          {/* Stats pills */}
          <motion.div variants={fadeInUp} custom={1}>
            <RecruiterStatPills />
          </motion.div>
        </>
      )}
    </Section>
  )
}
