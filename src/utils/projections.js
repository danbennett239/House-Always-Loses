const RTP = 0.85 // 85p returned per £1 bet
const HOUSE_EDGE = 1 - RTP

// Project lifetime losses given a session's pace
export function projectLifetime(sessionData) {
  const { totalSpins, totalWagered, netBalance } = sessionData
  if (totalSpins === 0) return null

  const avgBetPerSpin = totalWagered / totalSpins

  const perHour = avgBetPerSpin * 600   // ~600 spins/hr is typical
  const perDay  = perHour * 4           // 4hr session
  const perYear = perDay * 50           // 50 days/yr

  return {
    lossPerSpin:  avgBetPerSpin * HOUSE_EDGE,
    lossPerHour:  perHour * HOUSE_EDGE,
    lossPerDay:   perDay  * HOUSE_EDGE,
    lossPerYear:  perYear * HOUSE_EDGE,
    returnPerPound: RTP,
  }
}
