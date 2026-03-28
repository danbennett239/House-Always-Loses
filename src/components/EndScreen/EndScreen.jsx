import { useEffect, useRef } from 'react'
import EndCard, { CARD_DELAY_START, CARD_DELAY_STEP } from './EndCard.jsx'
import ProjectionCard from './ProjectionCard.jsx'
import TrickList from './TrickList.jsx'
import SupportCard from './SupportCard.jsx'
import './EndScreen.css'

const TITLE_ID = 'end-screen-title'

// Add entries here to introduce new cards. Index is derived from position.
function buildCards(sessionData) {
  return [
    {
      id: 'projection',
      title: 'Your Session',
      content: <ProjectionCard sessionData={sessionData} />,
    },
    {
      id: 'tricks',
      title: 'How You Were Manipulated',
      content: <TrickList sessionData={sessionData} />,
    },
    {
      id: 'support',
      title: 'Get Help',
      content: <SupportCard />,
    },
  ]
}

export default function EndScreen({ sessionData, onReset }) {
  const cards = buildCards(sessionData)
  const resetDelay = `${CARD_DELAY_START + cards.length * CARD_DELAY_STEP}s`
  const resetRef = useRef(null)

  // Move focus to Play Again when the overlay mounts so keyboard/screen-reader
  // users are not left focused behind the overlay.
  useEffect(() => {
    resetRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div
      className="end-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
    >
      <div className="end-screen-inner">
        <h2 id={TITLE_ID} className="end-title">Game Over</h2>

        {cards.map(({ id, title, content }, i) => (
          <EndCard key={id} index={i} title={title}>
            {content}
          </EndCard>
        ))}

        <button
          ref={resetRef}
          className="end-reset-btn"
          style={{ animationDelay: resetDelay }}
          onClick={onReset}
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
