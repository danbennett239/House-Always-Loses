import './SpinButton.css'

export default function SpinButton({ bet, setBet, balance, onSpin, disabled }) {
  return (
    <div className="spin-controls">
      <div className="bet-row">
        <button
          className="bet-adj"
          onClick={() => setBet(bet - 1)}
          disabled={bet <= 1 || disabled}
        >−</button>
        <span className="bet-display">Bet: £{bet}</span>
        <button
          className="bet-adj"
          onClick={() => setBet(bet + 1)}
          disabled={bet >= balance || disabled}
        >+</button>
      </div>

      <button className="spin-btn" onClick={onSpin} disabled={disabled}>
        {disabled ? 'Spinning…' : 'SPIN'}
      </button>

      <div className="balance-display">Balance: £{balance.toFixed(2)}</div>
    </div>
  )
}
