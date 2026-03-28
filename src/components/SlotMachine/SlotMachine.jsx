import { useState, useCallback, useEffect, useRef } from 'react'
import Reels from './Reels.jsx'
import SpinButton from './SpinButton.jsx'
import ResultMessage from './ResultMessage.jsx'
import WinCelebration from './WinCelebration.jsx'
import EndScreen from '../EndScreen/EndScreen.jsx'
import './SlotMachine.css'

export default function SlotMachine({ reels, spinning, lastResult, balance, bet, setBet, spin, canSpin, gameOver, reset, sessionData, onReelsSettled }) {
  const [reelsSettled, setReelsSettled] = useState(true)
  const [autoRoll, setAutoRoll] = useState(false)
  const preSpinBalance = useRef(balance)
  const reelsRef = useRef(null)
  // Only auto-roll after the user has manually spun at least once with auto-roll on
  const autoRollArmed = useRef(false)

  const handleAllStopped = useCallback(() => {
    setReelsSettled(true)
    onReelsSettled?.()
  }, [onReelsSettled])

  const handleSpin = useCallback(() => {
    preSpinBalance.current = balance
    setReelsSettled(false)
    autoRollArmed.current = true
    spin()
  }, [spin, balance])

  // Auto-roll: wait 1.5s after reels settle then fire next spin
  useEffect(() => {
    if (!autoRoll || !reelsSettled || !canSpin || gameOver) return
    if (!autoRollArmed.current) return
    const t = setTimeout(handleSpin, 1500)
    return () => clearTimeout(t)
  }, [autoRoll, reelsSettled, canSpin, gameOver, handleSpin])

  const isWin = reelsSettled && lastResult?.win && !lastResult?.isLDW

  return (
    <div className="slot-machine" data-win={isWin || undefined}>
      <div className="slot-machine-header">
        <h1 className="slot-title">Superman Shlops</h1>
        <span className="slot-tagline">Shlops for me, Shlops for you</span>
      </div>

      <div className="reels-wrapper" ref={reelsRef}>
        <Reels
          reels={reels}
          spinning={spinning}
          lastResult={lastResult}
          onAllStopped={handleAllStopped}
        />
      </div>

      <WinCelebration active={isWin} originRef={reelsRef} />

      <ResultMessage lastResult={reelsSettled ? lastResult : null} spinning={spinning || !reelsSettled} />

      <SpinButton
        bet={bet}
        setBet={setBet}
        balance={reelsSettled ? balance : preSpinBalance.current}
        onSpin={handleSpin}
        spinDisabled={!canSpin || !reelsSettled}
        spinning={spinning || !reelsSettled}
        autoRoll={autoRoll}
        setAutoRoll={setAutoRoll}
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
