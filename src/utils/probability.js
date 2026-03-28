// Symbols and their weights — heavier weight = more common on reels
// RTP target: ~85%
export const SYMBOLS = [
  { id: 'cherry',  emoji: '🍒', weight: 30, payout: 2  },
  { id: 'lemon',   emoji: '🍋', weight: 25, payout: 3  },
  { id: 'orange',  emoji: '🍊', weight: 20, payout: 4  },
  { id: 'plum',    emoji: '🍇', weight: 15, payout: 6  },
  { id: 'bell',    emoji: '🔔', weight: 7,  payout: 15 },
  { id: 'seven',   emoji: '7️⃣', weight: 3,  payout: 50 },
]

const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0)

export function weightedRandomSymbol() {
  let r = Math.random() * totalWeight
  for (const symbol of SYMBOLS) {
    r -= symbol.weight
    if (r <= 0) return symbol
  }
  return SYMBOLS[SYMBOLS.length - 1]
}

// Spin three reels and return [sym, sym, sym]
export function spinReels() {
  return [weightedRandomSymbol(), weightedRandomSymbol(), weightedRandomSymbol()]
}

// Evaluate a spin result — returns { win: bool, payout: number, isLDW: bool }
// isLDW: two matching symbols pay out less than the bet (loss disguised as win)
export function evaluateSpin(reels, bet) {
  const [a, b, c] = reels

  // Three of a kind
  if (a.id === b.id && b.id === c.id) {
    const gross = bet * a.payout
    return { win: true, gross, net: gross - bet, isLDW: gross < bet }
  }

  // Adjacent two-of-a-kind on the payline (a=b or b=c) → LDW: celebrates a loss.
  // Non-adjacent (a=c, middle differs) is treated as a full loss — see detectNearMiss.
  const matchPayout = bet * 0.5
  if (a.id === b.id || b.id === c.id) {
    // LDW: you "won" but net is negative
    return { win: true, gross: matchPayout, net: matchPayout - bet, isLDW: true }
  }

  return { win: false, gross: 0, net: -bet, isLDW: false }
}

// Theoretical RTP derived from SYMBOLS weights and evaluateSpin payout rules.
// Re-export these so UI components stay in sync with the actual engine.
const _probs = SYMBOLS.map(s => s.weight / totalWeight)
const _p3 = _probs.reduce((sum, p) => sum + p ** 3, 0)
// P(adjacent pair but not 3-of-a-kind) = P(a=b) + P(b=c) - 2·P(a=b=c)
//   = 2·Σ(p²) - 2·Σ(p³)
// a=c (near-miss) is excluded from LDW payouts and not counted here.
const _p2adj = 2 * _probs.reduce((sum, p) => sum + p ** 2, 0) - 2 * _p3
const _rtp3 = SYMBOLS.reduce((sum, s, i) => sum + _probs[i] ** 3 * s.payout, 0)
export const RTP        = _rtp3 + _p2adj * 0.5
export const HOUSE_EDGE = 1 - RTP

// Near-miss: first and last reel match but the middle differs (a=c, b≠a).
// This is a full loss — no payout — but psychologically feels like a near-win.
// Distinct from LDW (adjacent match with small payout) by both outcome and appearance.
export function detectNearMiss(reels) {
  const [a, b, c] = reels
  return a.id === c.id && b.id !== a.id
}
