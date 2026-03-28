import './EndCard.css'

// Reusable animated card for the end screen.
// index controls the stagger delay — 0 = first card in, 1 = second, etc.
export default function EndCard({ index, title, children }) {
  return (
    <div
      className="end-card"
      style={{ animationDelay: `${0.6 + index * 0.5}s` }}
    >
      {title && <h3 className="end-card-title">{title}</h3>}
      {children}
    </div>
  )
}
