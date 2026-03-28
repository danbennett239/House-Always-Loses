import { useState, useCallback } from 'react'
import Reels from './Reels.jsx'
import SpinButton from './SpinButton.jsx'
import ResultMessage from './ResultMessage.jsx'
import EndScreen from '../EndScreen/EndScreen.jsx'
import './SlotMachine.css'

export default function SlotMachine({ reels, spinning, lastResult, balance, bet, setBet, spin, canSpin, gameOver, reset, sessionData, onReelsSettled }) {
  const [reelsSettled, setReelsSettled] = useState(true)

  const handleAllStopped = useCallback(() => {
    setReelsSettled(true)
    onReelsSettled?.()
  }, [onReelsSettled])

  // Mark unsettled as soon as a spin starts
  const handleSpin = useCallback(() => {
    setReelsSettled(false)
    spin()
  }, [spin])

  return (
    <div className="slot-machine">
      <div className="slot-machine-header">
        <h1 className="slot-title">Superman Shlops</h1>
        <span className="slot-tagline">Shlops for me, Shlops for you</span>
      </div>

      <div className="reels-wrapper">
        <Reels
          reels={reels}
          spinning={spinning}
          lastResult={lastResult}
          onAllStopped={handleAllStopped}
        />
      </div>

      <ResultMessage lastResult={reelsSettled ? lastResult : null} spinning={spinning || !reelsSettled} />

      <SpinButton
        bet={bet}
        setBet={setBet}
        balance={reelsSettled ? balance : balance + (lastResult?.net ?? 0)}
        onSpin={handleSpin}
        spinDisabled={!canSpin || !reelsSettled}
        spinning={spinning || !reelsSettled}
      />

      <div className="spin-counter">
        {sessionData.totalSpins} spin{sessionData.totalSpins !== 1 ? 's' : ''}
      </div>

      {gameOver && reelsSettled && (
        <EndScreen sessionData={sessionData} onReset={reset} />
      )}
    </div>
  )
}
