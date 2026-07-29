import { useMode } from '../context/ModeContext'
import CluelessCat from './CluelessCat'

// The Clueless mascot — a small wrapper that tints the animated SVG cat with
// the active mode's accent color. Same pose API everywhere (chat, pitch, tour).
export default function Clueless({ pose = 'idle', size = 34, label = true, facing = 'right' }) {
  const { theme } = useMode()
  return (
    <div className="flex flex-col items-center select-none" aria-hidden="true">
      <div className={theme.accent}>
        <CluelessCat pose={pose} size={size * 1.9} facing={facing} />
      </div>
      {label && (
        <span className={`mt-1 font-mono text-[10px] tracking-widest uppercase ${theme.muted}`}>clueless</span>
      )}
    </div>
  )
}
