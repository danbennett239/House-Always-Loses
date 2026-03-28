import './SpinButton.css'

const BET_INCREMENTS = [1, 5, 10, 15, 25, 50]

export default function SpinButton({ bet, setBet, balance, onSpin, disabled, spinning }) {
  return (
    <div className="spin-controls">
      <div className="bet-increments">
        {BET_INCREMENTS.map((amount) => (
          <button
            key={amount}
            className={`bet-chip${bet === amount ? ' active' : ''}`}
            onClick={() => setBet(amount)}
            disabled={amount > balance || spinning}
          >
            £{amount}
          </button>
        ))}
      </div>

      <div className="bet-display">Bet: £{bet}</div>

      <button className="spin-btn" onClick={onSpin} disabled={disabled}>
        {spinning ? 'Spinning…' : 'SPIN'}
      </button>

      <div className="balance-display">Balance: £{balance.toFixed(2)}</div>
    </div>
  )
}
