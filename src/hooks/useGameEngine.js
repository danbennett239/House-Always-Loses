import { useReducer, useCallback } from 'react'
import { spinReels, evaluateSpin, detectNearMiss } from '../utils/probability.js'

const STARTING_BALANCE = 100
const DEFAULT_BET = 1

// Total animation duration before revealing result (ms)
// Reel 0 stops at ~1800ms, reel 1 at ~2150ms, reel 2 at ~2500ms
export const SPIN_RESOLVE_MS = 2700

const initialState = {
  balance: STARTING_BALANCE,
  bet: DEFAULT_BET,
  spinning: false,
  // pendingReels: available immediately so Reels can animate to target
  pendingReels: null,
  // revealed after animation completes
  reels: null,
  lastResult: null,
  sessionData: {
    totalSpins: 0,
    totalWagered: 0,
    totalWon: 0,
    netBalance: 0,
    nearMisses: 0,
    ldwCount: 0,
    bigWins: 0,
    spinHistory: [],
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BET': {
      const bet = Math.max(1, Math.min(action.bet, state.balance))
      return { ...state, bet }
    }

    case 'SPIN_START': {
      // Pre-compute result so the animation can target the correct symbols
      const reels = spinReels()
      const result = evaluateSpin(reels, state.bet)
      return {
        ...state,
        spinning: true,
        pendingReels: reels,
        pendingResult: result,
        balance: state.balance - state.bet, // deduct bet immediately
      }
    }

    case 'SPIN_COMPLETE': {
      const { pendingReels, pendingResult } = state
      const { gross, net, isLDW } = pendingResult
      const nearMiss = !pendingResult.win && detectNearMiss(pendingReels)

      const newBalance = state.balance + gross
      const sd = state.sessionData
      const spinNum = sd.totalSpins + 1

      return {
        ...state,
        spinning: false,
        reels: pendingReels,
        lastResult: pendingResult,
        pendingReels: null,
        pendingResult: null,
        balance: newBalance,
        sessionData: {
          totalSpins: spinNum,
          totalWagered: sd.totalWagered + state.bet,
          totalWon: sd.totalWon + gross,
          netBalance: newBalance - STARTING_BALANCE,
          nearMisses: sd.nearMisses + (nearMiss ? 1 : 0),
          ldwCount: sd.ldwCount + (isLDW ? 1 : 0),
          bigWins: sd.bigWins + (gross >= state.bet * 10 ? 1 : 0),
          spinHistory: [
            ...sd.spinHistory,
            { spin: spinNum, net, balance: newBalance },
          ],
        },
      }
    }

    default:
      return state
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setBet = useCallback((bet) => {
    dispatch({ type: 'SET_BET', bet })
  }, [])

  const spinComplete = useCallback(() => {
    dispatch({ type: 'SPIN_COMPLETE' })
  }, [])

  const spin = useCallback(() => {
    if (state.spinning || state.balance < state.bet) return
    dispatch({ type: 'SPIN_START' })
    setTimeout(spinComplete, SPIN_RESOLVE_MS)
  }, [state.spinning, state.balance, state.bet, spinComplete])

  const canSpin = !state.spinning && state.balance >= state.bet

  return { ...state, setBet, spin, canSpin }
}
