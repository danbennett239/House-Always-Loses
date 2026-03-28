const THEORETICAL_RTP = 0.85

export const SPINS_PER_HOUR    = 600   // ~600 spins/hr is typical for slots
export const HOURS_PER_SESSION = 4
export const SESSIONS_PER_YEAR = 50

// Minimum spins before trusting experienced RTP for projections.
// Below this threshold the sample is too small and we fall back to theoretical.
export const MIN_SPINS_FOR_EXPERIENCED_RTP = 10

// Returns the RTP the player has actually experienced this session.
// Falls back to theoretical until MIN_SPINS_FOR_EXPERIENCED_RTP spins have been made.
function experiencedRTP(sessionData) {
  const { totalSpins, totalWagered, totalWon } = sessionData
  if (totalSpins < MIN_SPINS_FOR_EXPERIENCED_RTP) return THEORETICAL_RTP
  return totalWon / totalWagered
}

// Project expected net result forward using a given house edge and average bet.
// Positive values = expected net loss for the player; negative = expected net gain.
function project(avgBetPerSpin, houseEdge) {
  const netPerSpin    = avgBetPerSpin * houseEdge
  const netPerHour    = netPerSpin    * SPINS_PER_HOUR
  const netPerSession = netPerHour    * HOURS_PER_SESSION
  const netPerYear    = netPerSession * SESSIONS_PER_YEAR
  const netPerDecade  = netPerYear    * 10
  return { netPerSpin, netPerHour, netPerSession, netPerYear, netPerDecade }
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
    // true once the sample is large enough to trust experienced RTP
    usingExperiencedRTP: totalSpins >= MIN_SPINS_FOR_EXPERIENCED_RTP,
    lossToDate: -netBalance,       // positive = net loss, negative = net win
    avgBetPerSpin,
  }
}
