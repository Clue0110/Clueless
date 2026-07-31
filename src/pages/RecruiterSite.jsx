import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import { personal, experience, projects, education } from '../data/content'
import { resumeData } from '../data/resume'
import ContactForm from '../components/ContactForm'
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi'

// Recruiter mode, redesigned: a quiet, typography-first single column in the
// style of modern minimal developer portfolios. One accent color, hairline
// dividers, mono microtype for labels and dates, and almost no chrome — the
// content does the talking. Section ids match the Navbar anchors.

const HAIRLINE = 'border-[#1e1e2e]'
const MUTED = 'text-slate-400'
const FAINT = 'text-slate-500'

// One shared, restrained entrance: a short fade-up, once, on scroll.
function Reveal({ children, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Numbered mono section label with a hairline that runs off to the right.
function SectionLabel({ n, children }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="font-mono text-xs tracking-[0.25em] uppercase text-violet-400">
        {n} — {children}
      </span>
      <span className={`h-px flex-1 border-t ${HAIRLINE}`} />
    </div>
  )
}

function QuietLink({ href, onClick, icon, children }) {
  const cls =
    'group inline-flex items-center gap-1.5 font-mono text-sm text-slate-400 transition-colors hover:text-violet-400'
  const inner = (
    <>
      {icon}
      <span className="underline decoration-slate-700 underline-offset-4 group-hover:decoration-violet-400/60">
        {children}
      </span>
    </>
  )
  if (onClick) {
    return (
      <button onClick={onClick} className={cls}>
        {inner}
      </button>
    )
  }
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>
      {inner}
    </a>
  )
}

export default function RecruiterSite() {
  const { setShowResume } = useMode()

  return (
    <div id="hero" className="mx-auto max-w-2xl px-6 pt-32 pb-20 font-sans sm:pt-40">
      {/* ── Intro ── */}
      <header id="about" className="scroll-mt-28">
        <Reveal>
          <div className="flex items-center gap-5">
            <img
              src={`${import.meta.env.BASE_URL}ProfileImage.jpeg`}
              alt="Sai Akilesh Venigalla"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-white/15"
            />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
                {personal.name}
              </h1>
              <p className={`mt-0.5 text-sm ${MUTED}`}>Software Engineer @ Tesla · NYU CS</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-xs text-emerald-300">Open to full-time roles · {personal.location}</span>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className={`mt-7 leading-relaxed ${MUTED}`}>{personal.bio.recruiter}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <QuietLink href={personal.github} icon={<FiGithub size={14} />}>GitHub</QuietLink>
            <QuietLink href={personal.linkedin} icon={<FiLinkedin size={14} />}>LinkedIn</QuietLink>
            <QuietLink href={`mailto:${personal.email}`} icon={<FiMail size={14} />}>Email</QuietLink>
            <QuietLink onClick={() => setShowResume(true)} icon={<FiFileText size={14} />}>Résumé</QuietLink>
          </div>
        </Reveal>
      </header>

      {/* ── Experience ── */}
      <section id="experience" className="mt-24 scroll-mt-28">
        <Reveal>
          <SectionLabel n="01">Experience</SectionLabel>
        </Reveal>
        <div className="space-y-12">
          {experience.map((job, i) => (
            <ExperienceRow key={`${job.company}-${job.role}`} job={job} index={i} />
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="mt-24 scroll-mt-28">
        <Reveal>
          <SectionLabel n="02">Selected Projects</SectionLabel>
        </Reveal>
        <div className={`divide-y ${HAIRLINE} border-y ${HAIRLINE}`}>
          {projects.map((p) => (
            <ProjectRow key={p.title} project={p} />
          ))}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="mt-24">
        <Reveal>
          <SectionLabel n="03">Skills</SectionLabel>
        </Reveal>
        <div className="space-y-5">
          {resumeData.skills.map((group) => (
            <Reveal key={group.category}>
              <div className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-6">
                <div className={`font-mono text-xs uppercase tracking-wider ${FAINT} pt-0.5`}>{group.category}</div>
                <div className={`font-mono text-sm leading-relaxed ${MUTED}`}>{group.items.join(' · ')}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Education ── */}
      <section id="education" className="mt-24 scroll-mt-28">
        <Reveal>
          <SectionLabel n="04">Education</SectionLabel>
        </Reveal>
        <div className="space-y-10">
          {education.map((school) => (
            <Reveal key={school.school}>
              <div className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-6">
                <div className={`pt-0.5 font-mono text-xs ${FAINT}`}>{school.period}</div>
                <div>
                  <div className="font-medium text-slate-200">{school.school}</div>
                  <div className={`mt-0.5 text-sm ${MUTED}`}>
                    {school.degree} · GPA {school.gpa}
                  </div>
                  <p className={`mt-2 text-sm leading-relaxed ${FAINT}`}>{school.highlight.recruiter}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="mt-24 scroll-mt-28">
        <Reveal>
          <SectionLabel n="05">Contact</SectionLabel>
        </Reveal>
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Let's build something.</h2>
          <p className={`mt-3 max-w-md leading-relaxed ${MUTED}`}>
            I'm currently open to full-time software engineering roles. If you think I'd be a good fit for
            your team, my inbox is open.
          </p>
          <a
            href={`mailto:${personal.email}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-500/40 px-5 py-2.5 text-sm font-medium text-violet-300 transition-colors hover:border-violet-400 hover:bg-violet-500/10"
          >
            <FiMail size={15} />
            {personal.email}
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 [&>form]:mx-0 [&>div]:mx-0">
            <ContactForm />
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className={`mt-20 border-t pt-6 ${HAIRLINE}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-600">
          <span>© 2026 {personal.name}</span>
          <span>react · tailwind · one pixel cat</span>
        </div>
      </footer>
    </div>
  )
}

function ExperienceRow({ job, index }) {
  const [expanded, setExpanded] = useState(false)
  const bullets = job.bullets.recruiter
  const shown = expanded ? bullets : bullets.slice(0, 3)
  const hidden = bullets.length - 3

  return (
    <Reveal>
      <div className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-6">
        <div className={`pt-1 font-mono text-xs leading-5 ${FAINT}`}>{job.period}</div>
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="relative top-[-1px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: job.color }} />
            <h3 className="font-medium text-slate-200">
              {job.role} <span className={FAINT}>· {job.company}</span>
            </h3>
          </div>
          <ul className="mt-3 space-y-2">
            {shown.map((b, i) => (
              <li key={i} className={`flex gap-3 text-sm leading-relaxed ${MUTED}`}>
                <span className="select-none text-slate-600">–</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {hidden > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-2.5 font-mono text-xs text-violet-400 transition-colors hover:text-violet-300"
            >
              {expanded ? '– show less' : `+ ${hidden} more`}
            </button>
          )}
        </div>
      </div>
    </Reveal>
  )
}

function ProjectRow({ project }) {
  const Tag = project.link ? 'a' : 'div'
  return (
    <Reveal>
      <Tag
        {...(project.link ? { href: project.link, target: '_blank', rel: 'noreferrer' } : {})}
        className="group block py-6"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-medium text-slate-200 transition-colors group-hover:text-violet-300">
            {project.title}
          </h3>
          {project.link && (
            <FiArrowUpRight
              size={16}
              className="shrink-0 text-slate-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
            />
          )}
        </div>
        <p className={`mt-1.5 max-w-xl text-sm leading-relaxed ${MUTED}`}>{project.description.recruiter}</p>
        <div className={`mt-2.5 font-mono text-xs ${FAINT}`}>{project.tags.slice(0, 6).join(' · ')}</div>
      </Tag>
    </Reveal>
  )
}
