import { AnimatePresence } from 'framer-motion'
import { ModeProvider, useMode } from './context/ModeContext'
import Navbar from './components/Navbar'
import ParticleField from './components/ParticleField'
import Hero from './sections/Hero'
import About from './sections/About'
import CluelessWorld from './sections/CluelessWorld'
import CluelessChat from './components/CluelessChat'
import CluelessPet from './components/CluelessPet'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Education from './sections/Education'
import Contact from './sections/Contact'
import ResumePage from './pages/ResumePage'

const MODE_CLASS = {
  recruiter: 'mode-recruiter',
  developer: 'mode-dev',
  clueless: 'mode-clueless',
}

function AppContent() {
  const { theme, mode, isClueless, showResume } = useMode()

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${theme.bg} ${MODE_CLASS[mode]} grain-overlay dot-grid`}
    >
      <ParticleField />
      <Navbar />

      <main className="relative z-10">
        {isClueless ? (
          // Clueless mode replaces the whole site with the cat-guided tour
          // (which ends in the JD-match pitch — exclusive to this mode).
          <CluelessWorld key={mode} />
        ) : (
          <>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Education />
            <Contact />
          </>
        )}
      </main>

      <AnimatePresence>
        {showResume && <ResumePage />}
      </AnimatePresence>

      {/* The roaming pet lives in every mode. Tapping it opens the chat window;
          both hide while the resume overlay (z-50) is up. */}
      {!showResume && (
        <>
          <CluelessPet />
          <CluelessChat />
        </>
      )}
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
