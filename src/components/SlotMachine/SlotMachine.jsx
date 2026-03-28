import { useState, useCallback, useRef } from 'react'
import Reels from './Reels.jsx'
import SpinButton from './SpinButton.jsx'
import ResultMessage from './ResultMessage.jsx'
import WinCelebration from './WinCelebration.jsx'
import EndScreen from '../EndScreen/EndScreen.jsx'
import './SlotMachine.css'

export default function SlotMachine({ reels, spinning, lastResult, balance, bet, setBet, spin, canSpin, gameOver, reset, sessionData, onReelsSettled }) {
  const [reelsSettled, setReelsSettled] = useState(true)
  const preSpinBalance = useRef(balance)
  const reelsRef = useRef(null)

  const handleAllStopped = useCallback(() => {
    setReelsSettled(true)
    onReelsSettled?.()
  }, [onReelsSettled])

  const handleSpin = useCallback(() => {
    preSpinBalance.current = balance
    setReelsSettled(false)
    spin()
  }, [spin, balance])

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
