import { useReducer, useCallback } from 'react'
import { spinReels, evaluateSpin, detectNearMiss } from '../utils/probability.js'

const STARTING_BALANCE = 100
const MIN_BET = 1

function getInitialState() {
  return {
    balance: STARTING_BALANCE,
    bet: MIN_BET,
    reels: null,          // null = not yet spun
    spinning: false,
    lastResult: null,     // { win, gross, net, isLDW }
    gameOver: false,
    sessionData: {
      totalSpins: 0,
      totalWagered: 0,
      totalWon: 0,
      netBalance: 0,      // cumulative net vs starting balance
      nearMisses: 0,
      ldwCount: 0,
      bigWins: 0,
      spinHistory: [],    // [{ spin, net, balance }]
    },
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BET': {
      const bet = Math.max(MIN_BET, Math.min(action.bet, state.balance))
      return { ...state, bet }
    }

    case 'SPIN_START':
      return { ...state, spinning: true }

    case 'SPIN_COMPLETE': {
      const { reels, result } = action
      const { gross, net, win, isLDW } = result
      const nearMiss = !win && detectNearMiss(reels)

      const newBalance = Math.round((state.balance + net) * 100) / 100
      const sd = state.sessionData
      const spinNum = sd.totalSpins + 1

      return {
        ...state,
        spinning: false,
        reels,
        lastResult: result,
        balance: newBalance,
        gameOver: newBalance < MIN_BET,
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

    case 'RESET':
      return getInitialState()

    default:
      return state
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)

  const setBet = useCallback((bet) => {
    dispatch({ type: 'SET_BET', bet })
  }, [])

  const spin = useCallback(() => {
    if (state.spinning || state.balance < state.bet) return

    dispatch({ type: 'SPIN_START' })

    // Slight delay before resolving — gives animation time to run
    setTimeout(() => {
      const reels = spinReels()
      const result = evaluateSpin(reels, state.bet)
      dispatch({ type: 'SPIN_COMPLETE', reels, result })
    }, 1800)
  }, [state.spinning, state.balance, state.bet])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const canSpin = !state.spinning && !state.gameOver && state.balance >= state.bet

  return { ...state, setBet, spin, canSpin, reset }
}
