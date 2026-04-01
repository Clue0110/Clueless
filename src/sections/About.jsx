import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import { personal, stats } from '../data/content'
import { fadeInUp, scaleIn } from '../utils/animations'

export default function About() {
  const { isRecruiter, isDev, theme, mode } = useMode()

  const bio = isRecruiter ? personal.bio.recruiter : personal.bio.dev
  const currentStats = isRecruiter ? stats.recruiter : stats.dev

  return (
    <Section id="about" title="About" devTitle="about me">
      {/* Top row: photo + bio */}
      <div className="grid md:grid-cols-5 gap-10 items-start mb-10">
        {/* Photo */}
        <motion.div variants={fadeInUp} className="md:col-span-1 flex justify-center md:justify-start">
          <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 ${isRecruiter ? 'border-violet-500/40' : 'border-green-500/40'} transition-colors duration-500 ${theme.accentGlow}`}>
            <img
              src="/avatar.jpg"
              alt="Sai Akilesh Venigalla"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'flex'
              }}
            />
            {/* Fallback initials */}
            <div className={`hidden absolute inset-0 items-center justify-center text-2xl font-black ${theme.accent} ${theme.card}`}>
              SA
            </div>
          </div>
        </motion.div>

        {/* Bio text */}
        <motion.div variants={fadeInUp} className="md:col-span-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={mode + '-bio'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`text-base md:text-lg leading-relaxed ${theme.muted} ${theme.font} transition-all duration-500`}
            >
              {isDev && <span className={theme.accent}>{'// '}</span>}
              {bio}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats pills */}
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-1 hidden md:block" />
        <motion.div variants={fadeInUp} custom={1} className="md:col-span-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                custom={i}
                className={`p-4 rounded-xl border ${theme.border} ${theme.card} glass transition-all duration-500`}
              >
                <div className={`text-2xl font-bold ${theme.accent} ${theme.font}`}>
                  {stat.value}
                </div>
                <div className={`text-xs mt-1 ${theme.muted} ${theme.font}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
