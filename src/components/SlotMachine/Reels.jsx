import { useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import { SYMBOLS } from '../../utils/probability.js'
import './Reels.css'

const REEL_SYMBOL_HEIGHT = 100 // px per symbol in the strip
const VISIBLE_SYMBOLS = 3      // how many rows are visible in the window

// Build a long shuffled strip for the illusion of spinning
function buildStrip(length = 30) {
  const strip = []
  for (let i = 0; i < length; i++) {
    strip.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
  }
  return strip
}

function Reel({ targetSymbol, spinning, delay = 0 }) {
  const stripRef = useRef(buildStrip())
  const yRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!spinning) return

    const strip = stripRef.current
    const totalHeight = strip.length * REEL_SYMBOL_HEIGHT

    // Kick the reel into a fast scroll
    if (containerRef.current) {
      animate(containerRef.current, { y: -totalHeight + REEL_SYMBOL_HEIGHT }, {
        duration: 0,
      })
    }

    animate(containerRef.current, { y: 0 }, {
      duration: 1.4 + delay * 0.3,
      ease: [0.1, 0.8, 0.5, 1],
    })
  }, [spinning, delay])

  useEffect(() => {
    if (spinning || !targetSymbol || !containerRef.current) return

    // After spin: snap so the target symbol lands in the middle visible row
    const strip = stripRef.current
    // Place target at a fixed landing position near the end of the strip
    const landingIndex = strip.length - 2
    strip[landingIndex] = targetSymbol
    stripRef.current = [...strip]

    const landingY = -(landingIndex - 1) * REEL_SYMBOL_HEIGHT

    animate(containerRef.current, { y: landingY }, {
      duration: 0.25 + delay * 0.15,
      ease: 'easeOut',
      delay: delay * 0.1,
    })
  }, [spinning, targetSymbol, delay])

  const strip = stripRef.current

  return (
    <div className="reel-window">
      <motion.div className="reel-strip" ref={containerRef}>
        {strip.map((sym, i) => (
          <div key={i} className="reel-cell">
            <span className="reel-emoji">{sym.emoji}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Reels({ reels, spinning }) {
  return (
    <div className="reels-container">
      {[0, 1, 2].map((i) => (
        <Reel
          key={i}
          targetSymbol={reels ? reels[i] : null}
          spinning={spinning}
          delay={i}
        />
      ))}
    </div>
  )
}
