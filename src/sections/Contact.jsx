import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import ContactForm from '../components/ContactForm'
import { personal } from '../data/content'
import { fadeInUp } from '../utils/animations'
import { FiGithub, FiLinkedin, FiMail, FiCopy, FiCheck, FiFileText } from 'react-icons/fi'

export default function Contact() {
  const { isRecruiter, theme, setShowResume } = useMode()
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText(personal.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const links = [
    {
      href: personal.github,
      icon: <FiGithub size={22} />,
      label: 'GitHub',
      recruiter: 'GitHub',
      dev: 'github',
    },
    {
      href: personal.linkedin,
      icon: <FiLinkedin size={22} />,
      label: 'LinkedIn',
      recruiter: 'LinkedIn',
      dev: 'linkedin',
    },
  ]

  return (
    <Section id="contact" title="Get In Touch" devTitle="ping me">
      <motion.div variants={fadeInUp} className="max-w-xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={isRecruiter ? 'r' : 'd'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-base mb-8 ${theme.muted} ${theme.font}`}
          >
            {isRecruiter
              ? 'I\'m always interested in discussing new opportunities in distributed systems, AI, and platform engineering. Let\'s connect.'
              : 'always down to chat about systems, AI, side projects or just nerd out about tech. hit me up.'}
          </motion.p>
        </AnimatePresence>

        {/* Contact form — sends email via /api/contact */}
        <ContactForm />

        {/* Email copy button (fallback / direct) */}
        <motion.button
          onClick={copyEmail}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`group flex items-center gap-3 mx-auto px-6 py-4 rounded-xl border ${theme.border} ${theme.card} glass glass-hover transition-all duration-300 mb-8`}
        >
          <FiMail className={theme.accent} size={18} />
          <span className={`text-sm ${theme.text} ${theme.font}`}>{personal.email}</span>
          {copied ? (
            <FiCheck className="text-green-400" size={16} />
          ) : (
            <FiCopy className={`${theme.muted} group-hover:${isRecruiter ? 'text-violet-400' : 'text-green-400'} transition-colors`} size={16} />
          )}
        </motion.button>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeInUp}
              custom={i + 1}
              whileHover={{ scale: 1.1, y: -3 }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border ${theme.border} ${theme.card} glass glass-hover ${theme.muted} hover:${isRecruiter ? 'text-violet-400' : 'text-green-400'} transition-all duration-300 ${theme.font} text-sm`}
            >
              {link.icon}
              {isRecruiter ? link.recruiter : link.dev}
            </motion.a>
          ))}
          <motion.button
            onClick={() => setShowResume(true)}
            variants={fadeInUp}
            custom={links.length + 1}
            whileHover={{ scale: 1.1, y: -3 }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border ${theme.border} ${theme.card} glass glass-hover ${theme.muted} hover:${isRecruiter ? 'text-violet-400' : 'text-green-400'} transition-all duration-300 ${theme.font} text-sm`}
          >
            <FiFileText size={22} />
            {isRecruiter ? 'Resume' : 'resume'}
          </motion.button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={fadeInUp} custom={3} className="mt-20 text-center">
        <p className={`text-xs ${theme.muted} ${theme.font}`}>
          {isRecruiter
            ? `© ${new Date().getFullYear()} Sai Akilesh Venigalla. Built with React + Framer Motion.`
            : `built with react, tailwind, framer-motion & ☕ // ${new Date().getFullYear()}`}
        </p>
      </motion.div>
    </Section>
  )
}
