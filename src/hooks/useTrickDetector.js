import { useEffect, useRef, useState } from 'react'
import { detectNearMiss } from '../utils/probability.js'

// Returns the latest trick event, cleared after it's been read
export function useTrickDetector(sessionData, reels, lastResult) {
  const [event, setEvent] = useState(null)
  const prevSpins = useRef(0)

  useEffect(() => {
    if (!lastResult || sessionData.totalSpins === prevSpins.current) return
    prevSpins.current = sessionData.totalSpins

    const { win, isLDW } = lastResult

    if (isLDW) {
      setEvent({ type: 'LDW', spin: sessionData.totalSpins })
      return
    }

    if (!win && reels && detectNearMiss(reels)) {
      setEvent({ type: 'NEAR_MISS', spin: sessionData.totalSpins })
      return
    }

    // Sunk cost nudge: balance below 50% of start after 10+ spins
    if (sessionData.totalSpins >= 10 && sessionData.netBalance < -50) {
      setEvent({ type: 'SUNK_COST', spin: sessionData.totalSpins })
      return
    }
  }, [sessionData.totalSpins])

  const clearEvent = () => setEvent(null)

  return { event, clearEvent }
}
