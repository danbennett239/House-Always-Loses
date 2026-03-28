import { useGameEngine } from '../../hooks/useGameEngine.js'
import Reels from './Reels.jsx'
import SpinButton from './SpinButton.jsx'
import ResultMessage from './ResultMessage.jsx'
import './SlotMachine.css'

export default function SlotMachine() {
  const { reels, spinning, lastResult, balance, bet, setBet, spin, canSpin, gameOver, reset, sessionData } = useGameEngine()

  return (
    <div className="slot-machine">
      <div className="slot-machine-header">
        <h1 className="slot-title">Superman Shlops</h1>
        <span className="slot-tagline">Shlops for me, Shlops for you</span>
      </div>

      <div className="reels-wrapper">
        <Reels reels={reels} spinning={spinning} />
        {/* Payline highlight overlay */}
        <div className="payline-overlay" />
      </div>

      <ResultMessage lastResult={lastResult} spinning={spinning} />

      {gameOver ? (
        <div className="game-over">
          <p>Out of funds! Final balance: £{balance.toFixed(2)}</p>
          <button className="spin-btn" onClick={reset}>Play Again</button>
        </div>
      ) : (
        <SpinButton
          bet={bet}
          setBet={setBet}
          balance={balance}
          onSpin={spin}
          spinDisabled={!canSpin}
          spinning={spinning}
        />
      )}

      <div className="spin-counter">
        {sessionData.totalSpins} spin{sessionData.totalSpins !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
