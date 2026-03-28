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

  // Two of a kind (pays 1.5× the symbol's base payout divided by 3 — small)
  const matchPayout = bet * 0.5
  if (a.id === b.id || b.id === c.id || a.id === c.id) {
    // LDW: you "won" but net is negative
    return { win: true, gross: matchPayout, net: matchPayout - bet, isLDW: true }
  }

  return { win: false, gross: 0, net: -bet, isLDW: false }
}

// Near-miss: two matching symbols + a third that's one position off on the same symbol
export function detectNearMiss(reels) {
  const [a, b, c] = reels
  if (a.id === b.id && c.id !== a.id) return true
  if (b.id === c.id && a.id !== b.id) return true
  if (a.id === c.id && b.id !== a.id) return true
  return false
}
