import './EndCard.css'

export const CARD_DELAY_START = 0.6   // seconds before the first card appears
export const CARD_DELAY_STEP  = 0.5   // seconds between each subsequent card

// Reusable animated card for the end screen.
// index controls the stagger delay — 0 = first card in, 1 = second, etc.
export default function EndCard({ index, title, children }) {
  return (
    <div
      className="end-card"
      style={{ animationDelay: `${CARD_DELAY_START + index * CARD_DELAY_STEP}s` }}
    >
      {title && <h3 className="end-card-title">{title}</h3>}
      {children}
    </div>
  )
}
