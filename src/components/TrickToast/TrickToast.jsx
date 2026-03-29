import { motion, AnimatePresence } from 'framer-motion'
import './TrickToast.css'

const TRICK_CONTENT = {
  LDW: {
    icon: '🎭',
    label: 'Loss Disguised as Win',
    headline: 'The machine just lied to you.',
    body: 'Two symbols matched and the machine celebrated — lights, sounds, a "WIN" message. But you staked more than you received. You lost money on this spin. The celebration is engineered to suppress that feeling.',
    colour: '#d4af37',
  },
  NEAR_MISS: {
    icon: '🎯',
    label: 'Near Miss',
    headline: "That wasn't bad luck. It was designed.",
    body: 'Two symbols matched and the third landed just one position away. Slot machines produce near misses far more often than chance alone would predict. There is no "almost" — each spin is independent. The closeness was manufactured to keep you spinning.',
    colour: '#e07a52',
  },
  SUNK_COST: {
    icon: '🕳️',
    label: 'Sunk Cost Trap',
    headline: "The urge to 'win it back' is the trap.",
    body: "You've lost more than half your starting balance. The psychological pull to recover losses is at its strongest right now — and casinos design for exactly this moment. The money already spent is gone. Every spin from here is a fresh decision, not a chance to undo the past.",
    colour: '#e05252',
  },
}

export default function TrickToast({ event, onDismiss, onNavigateAbout }) {
  const content = event ? TRICK_CONTENT[event.type] : null

  return (
    <AnimatePresence>
      {event && content && (
        <motion.div
          className="tt-card"
          role="dialog"
          aria-modal="false"
          aria-labelledby="tt-headline"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{   opacity: 0, x: 8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="tt-icon-row">
            <span className="tt-icon" aria-hidden="true">{content.icon}</span>
            <span className="tt-label" style={{ color: content.colour }}>{content.label}</span>
          </div>

          <h2 className="tt-headline" id="tt-headline">{content.headline}</h2>
          <p className="tt-body">{content.body}</p>

          <div className="tt-footer">
            <button className="tt-dismiss" onClick={onDismiss} autoFocus>
              Got it
            </button>
            <button className="tt-hint tt-hint-link" onClick={() => { onDismiss(); onNavigateAbout?.() }}>
              More on the About page →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
