import { motion, AnimatePresence } from 'framer-motion'
import { ModeProvider, useMode } from './context/ModeContext'
import Navbar from './components/Navbar'
import ParticleField from './components/ParticleField'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Education from './sections/Education'
import Contact from './sections/Contact'
import ResumePage from './pages/ResumePage'

function AppContent() {
  const { isRecruiter, theme, mode, showResume } = useMode()

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${theme.bg} ${
        isRecruiter ? 'mode-recruiter' : 'mode-dev'
      } grain-overlay dot-grid`}
    >
      <ParticleField />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>

      <AnimatePresence>
        {showResume && <ResumePage />}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <ModeProvider>
      <AppContent />
    </ModeProvider>
  )
}
