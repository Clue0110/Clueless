import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '../context/ModeContext'
import Section from '../components/Section'
import GitLogExperience from '../components/GitLogExperience'
import { experience } from '../data/content'
import { fadeInUp } from '../utils/animations'

// Recruiter mode: the quiet gutter-timeline look — mono dates on the left, a
// brand-colored dot by the role, dash bullets, and a "+ n more" expander.
function RecruiterExperienceRow({ job }) {
  const [expanded, setExpanded] = useState(false)
  const bullets = job.bullets.recruiter
  const shown = expanded ? bullets : bullets.slice(0, 3)
  const hidden = bullets.length - 3

  return (
    <motion.div variants={fadeInUp} className="grid gap-2 sm:grid-cols-[200px_1fr] sm:gap-10">
      <div className="pt-1">
        <div className="font-mono text-xs leading-5 text-slate-500">{job.period}</div>
        <div className="mt-0.5 font-mono text-xs leading-5 text-slate-600">{job.location}</div>
      </div>
      <div>
        <div className="flex items-baseline gap-2.5">
          <span
            className="relative top-[-1px] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: job.color }}
          />
          <h3 className="font-medium text-slate-200">
            {job.role} <span className="text-slate-500">· {job.company}</span>
          </h3>
        </div>
        <ul className="mt-3 space-y-2">
          {shown.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-400">
              <span className="select-none text-slate-600">–</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {hidden > 0 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-2.5 min-h-8 font-mono text-xs text-violet-400 transition-colors hover:text-violet-300"
          >
            {expanded ? '– show less' : `+ ${hidden} more`}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const { isRecruiter, mode } = useMode()
  return (
    // Keyed by mode: the recruiter/dev layouts are different trees, and children
    // mounted after the Section's once-only stagger has fired would otherwise
    // stay stuck in their hidden variant. Remounting re-runs the entrance.
    <Section key={mode} id="experience" title="Experience" devTitle="work_history">
      {isRecruiter ? (
        <div className="space-y-12">
          {experience.map((job) => (
            <RecruiterExperienceRow key={job.company + job.role} job={job} />
          ))}
        </div>
      ) : (
        <GitLogExperience />
      )}
    </Section>
  )
}
