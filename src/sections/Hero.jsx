import { lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import { personal } from '../data/content'
import AnimatedText from '../components/AnimatedText'
import { fadeInUp } from '../utils/animations'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown, FiFileText } from 'react-icons/fi'

const Beams = lazy(() => import('../components/Beams'))

export default function Hero() {
  const { isRecruiter, theme, mode, setShowResume } = useMode()

  let tagline = isRecruiter ? personal.tagline.recruiter : personal.tagline.dev

  const beamColor = isRecruiter ? '#B19EEF' : '#6EE7B7'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Beams background ── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor={beamColor}
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
        </Suspense>
        {/* Bottom fade to site bg */}
        <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t ${
          isRecruiter ? 'from-[#0a0a0f]' : 'from-[#0d1117]'
        } to-transparent pointer-events-none transition-colors duration-700`} />
      </div>

      {/* ── Content: image LEFT + text RIGHT ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 w-full md:w-auto mx-auto">

          {/* Profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <div className={`relative w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden
              border-2 ${ isRecruiter ? 'border-violet-500/50' : 'border-green-500/50'}
              transition-colors duration-700`}
              style={{ transform: 'scaleY(1.06)' }}
            >
              <img
                src="/ProfileImage.jpeg"
                alt="Sai Akilesh Venigalla"
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: 'center', width: '100%', height: '100%', transform: 'scale(1.25)' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'flex'
                }}
              />
              <div className={`hidden absolute inset-0 items-center justify-center text-4xl font-black ${
                isRecruiter ? 'bg-violet-500/20 text-violet-300' : 'bg-green-500/20 text-green-300'
              }`}>
                SA
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            {/* Greeting */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className={`text-sm md:text-base mb-3 ${theme.muted} ${theme.font} transition-all duration-500`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {isRecruiter ? "Hello, I'm" : "hey, i'm"}
                </motion.span>
              </AnimatePresence>
            </motion.p>

            {/* Name */}
            <h1 className={`font-black tracking-tight mb-4 ${theme.text} ${theme.font} transition-all duration-500 leading-none`}>
              <div className="text-5xl md:text-6xl lg:text-7xl">
                <AnimatedText text="Sai Akilesh" />
              </div>
              <div className={`text-5xl md:text-6xl lg:text-7xl pb-1 ${theme.gradientText}`}>
                <AnimatedText text="Venigalla" />
              </div>
            </h1>

            {/* Tagline */}
            <AnimatePresence mode="wait">
              <motion.p
                key={mode + '-tagline'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`text-base md:text-lg mb-8 ${theme.muted} ${theme.font} transition-all duration-500 max-w-xl whitespace-pre-line`}
              >
                {isRecruiter ? tagline : (
                  <span>
                    <span className={theme.accent}>{'$ '}</span>
                    {tagline}
                  </span>
                )}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex items-center justify-center md:justify-start gap-4 flex-wrap"
            >
              <motion.a
                href="#experience"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full text-sm font-medium text-white ${theme.accentBg} ${theme.accentHover} transition-colors duration-300`}
              >
                {isRecruiter ? 'View Experience' : "see what i've built"}
              </motion.a>

              <motion.button
                onClick={() => setShowResume(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border ${theme.border} ${theme.muted} glass transition-all duration-300`}
              >
                <FiFileText size={15} />
                {isRecruiter ? 'Resume' : 'resume'}
              </motion.button>

              <div className="flex items-center gap-3">
                {[
                  { href: personal.github, icon: <FiGithub size={18} />, label: 'GitHub' },
                  { href: personal.linkedin, icon: <FiLinkedin size={18} />, label: 'LinkedIn' },
                  { href: `mailto:${personal.email}`, icon: <FiMail size={18} />, label: 'Email' },
                ].map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-full border ${theme.border} ${theme.muted} transition-all duration-300 glass`}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiArrowDown className={theme.muted} size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
