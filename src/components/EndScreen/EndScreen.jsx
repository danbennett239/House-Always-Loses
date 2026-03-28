import EndCard, { CARD_DELAY_START, CARD_DELAY_STEP } from './EndCard.jsx'
import ProjectionCard from './ProjectionCard.jsx'
import './EndScreen.css'

// Add entries here to introduce new cards. Index is derived from position.
function buildCards(sessionData) {
  return [
    { title: 'Your Session', content: <ProjectionCard sessionData={sessionData} /> },
  ]
}

export default function EndScreen({ sessionData, onReset }) {
  const cards = buildCards(sessionData)
  const resetDelay = `${CARD_DELAY_START + cards.length * CARD_DELAY_STEP}s`

  return (
    <div className="end-screen">
      <h2 className="end-title">Game Over</h2>

      {cards.map(({ title, content }, i) => (
        <EndCard key={title} index={i} title={title}>
          {content}
        </EndCard>
      ))}

      <button
        className="spin-btn end-reset-btn"
        style={{ animationDelay: resetDelay }}
        onClick={onReset}
      >
        Play Again
      </button>
    </div>
  )
}
