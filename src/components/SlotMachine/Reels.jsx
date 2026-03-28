import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, animate, useMotionValue } from 'framer-motion'
import { SYMBOLS } from '../../utils/probability.js'
import './Reels.css'

const REEL_SYMBOL_HEIGHT = 100
const STRIP_LENGTH       = 40
const LOOP_SYMBOLS       = 20
const LOOP_DURATION      = 0.7   // seconds per full loop cycle
const STOP_DELAY_STEP    = 0.5   // seconds between each reel stopping
const DECEL_DURATION     = 0.55
const LANDING_INDEX      = STRIP_LENGTH - 2
const LANDING_Y          = -(LANDING_INDEX - 1) * REEL_SYMBOL_HEIGHT

function buildStrip() {
  return Array.from({ length: STRIP_LENGTH }, () =>
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  )
}

function getPaylineInfo(reels, lastResult) {
  if (!reels || !lastResult) return { indices: [], color: null }
  const [a, b, c] = reels

  if (lastResult.win && !lastResult.isLDW) {
    return { indices: [0, 1, 2], color: '#d4af37' }
  }
  if (lastResult.isLDW) {
    return { indices: a.id === b.id ? [0, 1] : [1, 2], color: '#e07b39' }
  }
  if (a.id === c.id && b.id !== a.id) {
    return { indices: [0, 2], color: '#888' }
  }
  return { indices: [], color: null }
}

function Reel({ targetSymbol, spinning, stopDelay, onStopped, highlighted, color }) {
  const [strip, setStrip] = useState(buildStrip)
  const y            = useMotionValue(0)
  const wasSpinning  = useRef(false)
  const loopCtrl     = useRef(null)
  const stopTimeout  = useRef(null)

  // Bake target into DOM as soon as it's known — long before y reaches LANDING_Y
  useEffect(() => {
    if (!targetSymbol) return
    setStrip(prev => {
      const next = [...prev]
      next[LANDING_INDEX] = targetSymbol
      return next
    })
  }, [targetSymbol])

  // Start loop when spinning begins. No cleanup here — each reel stops its own
  // loop inside the staggered timeout below, so loops keep running independently.
  useEffect(() => {
    if (!spinning) return

    // Cancel any in-flight stop from previous spin
    clearTimeout(stopTimeout.current)
    if (loopCtrl.current) loopCtrl.current.stop()

    y.set(0)
    loopCtrl.current = animate(y, -(LOOP_SYMBOLS * REEL_SYMBOL_HEIGHT), {
      duration: LOOP_DURATION,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    })
  }, [spinning, y])

  // When the engine resolves, schedule this reel's stop after its own delay.
  // The loop keeps running until the timeout fires.
  useEffect(() => {
    const justLanded = wasSpinning.current && !spinning
    wasSpinning.current = spinning

    if (!justLanded || !targetSymbol) return

    stopTimeout.current = setTimeout(() => {
      if (loopCtrl.current) {
        loopCtrl.current.stop()
        loopCtrl.current = null
      }
      animate(y, LANDING_Y, {
        duration: DECEL_DURATION,
        ease: [0.2, 0.8, 0.4, 1],
        onComplete: onStopped,
      })
    }, stopDelay * 1000)

    return () => clearTimeout(stopTimeout.current)
  }, [spinning, targetSymbol, stopDelay, y, onStopped])

  const borderStyle = highlighted && color
    ? { borderColor: color, boxShadow: `0 0 14px ${color}99, inset 0 0 8px ${color}22` }
    : {}

  return (
    <div className="reel-window" style={borderStyle}>
      <motion.div className="reel-strip" style={{ y }}>
        {strip.map((sym, i) => (
          <div key={i} className="reel-cell">
            <span className="reel-emoji">{sym.emoji}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Reels({ reels, spinning, lastResult }) {
  const [allStopped, setAllStopped] = useState(false)
  const stoppedCount = useRef(0)

  useEffect(() => {
    if (spinning) {
      setAllStopped(false)
      stoppedCount.current = 0
    }
  }, [spinning])

  const handleStopped = useCallback(() => {
    stoppedCount.current += 1
    if (stoppedCount.current === 3) setAllStopped(true)
  }, [])

  const { indices, color } = getPaylineInfo(reels, allStopped ? lastResult : null)

  // Centre x of each reel: padding(12) + reelIndex * (width(100) + gap(8)) + halfWidth(50)
  const reelCentreX = (i) => 12 + i * 108 + 50
  const showLine    = indices.length >= 2 && allStopped
  const lineLeft    = showLine ? reelCentreX(Math.min(...indices)) : 0
  const lineWidth   = showLine ? reelCentreX(Math.max(...indices)) - lineLeft : 0

  return (
    <div className="reels-container">
      {[0, 1, 2].map((i) => (
        <Reel
          key={i}
          targetSymbol={reels ? reels[i] : null}
          spinning={spinning}
          stopDelay={i * STOP_DELAY_STEP}
          onStopped={handleStopped}
          highlighted={indices.includes(i)}
          color={color}
        />
      ))}

      {showLine && (
        <motion.div
          key={`line-${lastResult?.gross}-${lastResult?.net}`}
          className="payline-line"
          style={{ backgroundColor: color, left: lineLeft, top: 'calc(12px + 150px - 2px)' }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: lineWidth, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      )}
    </div>
  )
}
