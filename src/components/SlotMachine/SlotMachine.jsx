import { useGameEngine } from '../../hooks/useGameEngine.js'
import Reels from './Reels.jsx'
import SpinButton from './SpinButton.jsx'
import ResultMessage from './ResultMessage.jsx'
import Paytable from './Paytable.jsx'
import './SlotMachine.css'

export default function SlotMachine() {
  const {
    pendingReels, spinning, lastResult,
    balance, bet, setBet, spin, canSpin,
    sessionData,
  } = useGameEngine()

  return (
    <div className="slot-machine-wrapper">
      <Paytable />

      <div className="slot-machine">
        <div className="slot-machine-header">
          <h1 className="slot-title">Superman Shlops</h1>
          <span className="slot-tagline">Shlops for me, Shlops for you</span>
        </div>

        <div className="reels-wrapper">
          <Reels
            targetReels={pendingReels}
            spinning={spinning}
            spinKey={sessionData.totalSpins}
          />
          <div className="payline-overlay" />
        </div>

        <ResultMessage lastResult={lastResult} spinning={spinning} />

        <SpinButton
          bet={bet}
          setBet={setBet}
          balance={balance}
          onSpin={spin}
          disabled={!canSpin}
        />

        <div className="spin-counter">
          {sessionData.totalSpins} spin{sessionData.totalSpins !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
