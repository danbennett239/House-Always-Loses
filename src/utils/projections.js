const THEORETICAL_RTP = 0.85         // 85p returned per £1 bet
const SPINS_PER_HOUR  = 600          // ~600 spins/hr is typical for slots
const HOURS_PER_SESSION = 4
const SESSIONS_PER_YEAR = 50

// Returns the RTP the player has actually experienced this session.
// Falls back to theoretical if not enough data.
function experiencedRTP(sessionData) {
  const { totalWagered, totalWon } = sessionData
  if (totalWagered === 0) return THEORETICAL_RTP
  return totalWon / totalWagered
}

// Project losses forward using a given house edge and average bet.
function project(avgBetPerSpin, houseEdge) {
  const lossPerSpin    = avgBetPerSpin * houseEdge
  const lossPerHour    = lossPerSpin   * SPINS_PER_HOUR
  const lossPerSession = lossPerHour   * HOURS_PER_SESSION
  const lossPerYear    = lossPerSession * SESSIONS_PER_YEAR
  const lossPerDecade  = lossPerYear   * 10
  return { lossPerSpin, lossPerHour, lossPerSession, lossPerYear, lossPerDecade }
}

// Main export. Returns projection rows using both theoretical and experienced rates.
// Returns null if no spins have been made yet.
export function projectLifetime(sessionData) {
  const { totalSpins, totalWagered, netBalance } = sessionData
  if (totalSpins === 0) return null

  const avgBetPerSpin = totalWagered / totalSpins
  const actualRTP     = experiencedRTP(sessionData)

  return {
    theoretical: {
      rtp: THEORETICAL_RTP,
      ...project(avgBetPerSpin, 1 - THEORETICAL_RTP),
    },
    experienced: {
      rtp: actualRTP,
      ...project(avgBetPerSpin, 1 - actualRTP),
    },
    // Convenience fields for display
    returnPerPound: actualRTP,
    lossToDate: -netBalance,       // positive = net loss, negative = net win
    avgBetPerSpin,
  }
}
