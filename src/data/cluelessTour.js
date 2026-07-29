// The Clueless-mode guided tour script. Each station is one "beat": the cat
// walks across the screen, sits down, says its line, and a card of real facts
// pops up. Facts are hand-written in the pet's voice but grounded in
// content.js — keep them in sync when experience/projects change.
import { personal, projects, education } from './content'

export const WELCOME = {
  lines: [
    "hi!! i'm clueless 🐈 *stretches*",
    "i'm sai's digital cat, and this is his portfolio. he feeds me, so i learned his entire resume.",
    'want me to show you around?',
  ],
  startLabel: 'yes, show me around!',
  skipLabel: 'skip to the job-match magic ✨',
}

export const TOUR = [
  {
    id: 'meet',
    title: 'meet my human',
    pose: 'wave',
    say: "this is sai! software engineer at tesla, NYU CS grad, professional kafka whisperer. i've watched him debug things at 3am. he always wins eventually.",
    card: {
      type: 'profile',
      name: personal.name,
      location: personal.location,
      blurb:
        '4+ years building distributed systems, real-time pipelines, and security platforms. currently making robotaxis take your money (politely) at tesla.',
    },
  },
  {
    id: 'tesla',
    title: 'the tesla chapter',
    pose: 'point',
    say: 'right now he builds payment + fleet infrastructure for robotaxis. actual robot cars. i nap on his keyboard while he does it.',
    card: {
      type: 'facts',
      heading: 'Tesla · Software Engineer Intern · 2026',
      facts: [
        'made robotaxi payments 85% faster with a kafka pipeline + go dead-letter queue',
        'ride-data lookups got 90% faster after his mysql → elasticsearch sync',
        'put live supercharger wait times on google maps for millions of EV drivers',
        'scaled referral fraud-detection to 3.5M+ daily users',
      ],
    },
  },
  {
    id: 'citrix',
    title: 'the citrix era',
    pose: 'read',
    say: 'before that: 3 years at citrix making the internet safer. he once found servers downloading security files with NO auth and fixed it in C. i was so proud.',
    card: {
      type: 'facts',
      heading: 'Citrix · Software Engineer 1 → 2 · 2021 – 2024',
      facts: [
        'built a WAF security engine that bumped AppSec license sales by 60%',
        'took an API from 4 minutes to under 10 seconds (rewrote it in C++, added redis)',
        'cut a 16-hour release pipeline down to 2 hours with jenkins + ansible',
        'his test-selection module got adopted by every NetScaler team',
      ],
    },
  },
  {
    id: 'research',
    title: 'the science-cat years',
    pose: 'read',
    say: 'he also did research at samsung — teaching AIs to erase things from photos and recognizing people by how they WALK. suspiciously cat-like skills.',
    card: {
      type: 'facts',
      heading: 'Samsung R&D · 3 research internships · 2020 – 2021',
      facts: [
        'stitched 4K panoramic video from multiple phones in real time (<100ms/frame)',
        'trained a GAN on 350k images to magically erase objects from photos',
        'built gait-based authentication — your phone knows how you walk',
        'won best project at samsung prism 2021 🏆',
      ],
    },
  },
  {
    id: 'projects',
    title: 'things he builds for fun',
    pose: 'point',
    say: "when he's not working he builds MORE things. i don't get it either. but they're pretty cool:",
    card: {
      type: 'projects',
      projects: projects.map((p) => ({
        title: p.title,
        emoji: p.emoji,
        link: p.link,
        blurb: p.description.dev,
        tags: p.tags.slice(0, 4),
      })),
    },
  },
  {
    id: 'education',
    title: 'certified smart human',
    pose: 'idle',
    say: 'the paperwork checks out too — 3.9 GPA at NYU while TA-ing 250 students, summa cum laude before that. he still asks ME for advice though.',
    card: {
      type: 'education',
      schools: education.map((e) => ({
        school: e.school,
        degree: e.degree,
        period: e.period,
        gpa: e.gpa,
        note: e.highlight.dev,
      })),
    },
  },
  {
    id: 'contact',
    title: 'say hi!',
    pose: 'celebrate',
    say: "that's my human! he's looking for great teams to build with. you can reach him here — tell him clueless sent you, i get extra treats.",
    card: {
      type: 'contact',
      email: personal.email,
      linkedin: personal.linkedin,
      github: personal.github,
    },
  },
]

export const PITCH_INVITE = {
  say: 'oh! one more thing…',
  question: 'want me to walk you through a specific job description — and why sai would be a great match?',
  yesLabel: 'yes! read this job description 📋',
  laterLabel: 'maybe later',
}
