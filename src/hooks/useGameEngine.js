import { useReducer, useCallback, useEffect, useRef } from 'react'
import { spinReels, evaluateSpin, detectNearMiss } from '../utils/probability.js'

const STARTING_BALANCE = 100
const DEFAULT_BET = 1

export const SPIN_RESOLVE_MS = 2700

const initialState = {
  balance: STARTING_BALANCE,
  bet: DEFAULT_BET,
  spinning: false,
  pendingReels: null,
  pendingResult: null,
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
      const reels = spinReels()
      const result = evaluateSpin(reels, state.bet)
      return {
        ...state,
        spinning: true,
        pendingReels: reels,
        pendingResult: result,
        balance: state.balance - state.bet,
      }
    }

    case 'SPIN_COMPLETE': {
      // Guard: if pending state was somehow cleared, do nothing
      if (!state.pendingReels || !state.pendingResult) return state

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
  const timeoutRef = useRef(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  const setBet = useCallback((bet) => {
    dispatch({ type: 'SET_BET', bet })
  }, [])

  const spin = useCallback(() => {
    if (state.spinning || state.balance < state.bet) return
    dispatch({ type: 'SPIN_START' })
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'SPIN_COMPLETE' })
    }, SPIN_RESOLVE_MS)
  }, [state.spinning, state.balance, state.bet])

  const canSpin = !state.spinning && state.balance >= state.bet

  return { ...state, setBet, spin, canSpin }
}
