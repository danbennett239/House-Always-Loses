import EndCard from './EndCard.jsx'
import ProjectionCard from './ProjectionCard.jsx'
import './EndScreen.css'

// To add a new card: append an <EndCard index={n}> and bump CARD_COUNT.
const CARD_COUNT = 1

export default function EndScreen({ sessionData, balance, onReset }) {
  const resetDelay = `${0.6 + CARD_COUNT * 0.5}s`

  return (
    <div className="end-screen">
      <h2 className="end-title">Game Over</h2>

      <EndCard index={0} title="Your Session">
        <ProjectionCard sessionData={sessionData} balance={balance} />
      </EndCard>

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
