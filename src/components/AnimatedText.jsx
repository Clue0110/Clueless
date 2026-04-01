import { motion } from 'framer-motion'
import { letterPull } from '../utils/animations'

// Animates each letter individually
export default function AnimatedText({ text, className = '', as: Tag = 'span' }) {
  const letters = text.split('')

  return (
    <Tag className={className} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={i}
          variants={letterPull}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  )
}
