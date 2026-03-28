import { useLayoutEffect, useRef } from 'react'
import { animate } from 'framer-motion'
import { SYMBOLS } from '../../utils/probability.js'
import './Reels.css'

const SYMBOL_H = 100
const STRIP_LEN = 40
const LANDING_INDEX = 36 // symbol at this index is the target

// y value that centres symbol[LANDING_INDEX] in the middle visible row
const LANDING_Y = 100 - LANDING_INDEX * SYMBOL_H  // -3500

// Fast-scroll stops here before decelerating to landing
const MID_SCROLL_Y = -(SYMBOL_H * 28)             // -2800

// Stop delays per reel (seconds) — cascading halt effect
const STOP_DELAYS = [0, 0.35, 0.7]

function buildStrip(target) {
  return Array.from({ length: STRIP_LEN }, (_, i) =>
    i === LANDING_INDEX
      ? target
      : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  )
}

function Reel({ targetSymbol, spinning, spinKey, stopDelay = 0 }) {
  const containerRef = useRef(null)
  // Compute strip synchronously during render so the DOM is correct
  // before useLayoutEffect fires
  const stripRef = useRef(null)
  const lastSpinKey = useRef(-1)

  if (spinning && targetSymbol && spinKey !== lastSpinKey.current) {
    lastSpinKey.current = spinKey
    stripRef.current = buildStrip(targetSymbol)
  }

  // Initialise strip on first render
  if (!stripRef.current) {
    stripRef.current = buildStrip(SYMBOLS[0])
  }

  const strip = stripRef.current

  useLayoutEffect(() => {
    if (!spinning || !containerRef.current) return

    // Reset strip to top before animating
    containerRef.current.style.transform = 'translateY(0px)'

    const animation = animate(
      containerRef.current,
      { y: [0, MID_SCROLL_Y, LANDING_Y] },
      {
        duration: 1.8 + stopDelay,
        times: [0, 0.72, 1],
        // linear fast scroll → cubic decelerate into landing
        ease: ['linear', [0.15, 0.85, 0.35, 1]],
      }
    )

    return () => animation.stop()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, spinKey]) // re-run each new spin

  return (
    <div className="reel-window">
      <div className="reel-strip" ref={containerRef}>
        {strip.map((sym, i) => (
          <div key={i} className="reel-cell">
            <span className="reel-emoji">{sym.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reels({ targetReels, spinning, spinKey }) {
  return (
    <div className="reels-container">
      {[0, 1, 2].map((i) => (
        <Reel
          key={i}
          targetSymbol={targetReels ? targetReels[i] : null}
          spinning={spinning}
          spinKey={spinKey}
          stopDelay={STOP_DELAYS[i]}
        />
      ))}
    </div>
  )
}
