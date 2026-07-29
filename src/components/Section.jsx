import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import { fadeInUp, staggerContainer } from '../utils/animations'

export default function Section({ id, title, devTitle, children, className = '' }) {
  const { isRecruiter, theme } = useMode()

  const displayTitle = isRecruiter ? title : (devTitle || title.toLowerCase())

  return (
    <section id={id} className={`relative py-14 px-5 sm:py-20 sm:px-6 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {title && (
            <motion.div variants={fadeInUp} className="mb-8 sm:mb-12 md:mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold ${theme.text} ${theme.font} transition-all duration-500`}>
                {isRecruiter ? (
                  displayTitle
                ) : (
                  <>
                    <span className={theme.accent}>{'> '}</span>
                    {displayTitle}
                    <span className={`${theme.accent} animate-blink`}>_</span>
                  </>
                )}
              </h2>
              <div className={`mt-3 h-1 w-16 rounded-full ${theme.accentBg} transition-colors duration-500`} />
            </motion.div>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
