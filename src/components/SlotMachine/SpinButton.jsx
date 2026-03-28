import { useState } from 'react'
import './SpinButton.css'

const BET_INCREMENTS = [1, 5, 10, 15, 25, 50]

export default function SpinButton({ bet, setBet, balance, onSpin, disabled }) {
  const [custom, setCustom] = useState('')

  function handleCustomChange(e) {
    setCustom(e.target.value)
  }

  function handleCustomBlur() {
    const val = parseInt(custom, 10)
    if (!isNaN(val) && val >= 1) setBet(val)
    setCustom('')
  }

  function handleCustomKey(e) {
    if (e.key === 'Enter') e.target.blur()
  }

  const isCustomActive = !BET_INCREMENTS.includes(bet)

  return (
    <div className="spin-controls">
      <div className="bet-increments">
        {BET_INCREMENTS.map((amount) => (
          <button
            key={amount}
            className={`bet-chip${bet === amount ? ' active' : ''}`}
            onClick={() => setBet(amount)}
            disabled={amount > balance || disabled}
          >
            £{amount}
          </button>
        ))}
      </div>

      <label className="sr-only" htmlFor="bet-custom-input">Custom bet amount</label>
      <input
        id="bet-custom-input"
        className={`bet-custom${isCustomActive ? ' active' : ''}`}
        type="number"
        min={1}
        max={balance}
        placeholder="Custom amount"
        value={custom}
        onChange={handleCustomChange}
        onBlur={handleCustomBlur}
        onKeyDown={handleCustomKey}
        disabled={disabled}
      />

      <div className="bet-display">Bet: £{bet}</div>

      <button className="spin-btn" onClick={onSpin} disabled={disabled}>
        {disabled ? 'Spinning…' : 'SPIN'}
      </button>

      <div className="balance-display">Balance: £{balance.toFixed(2)}</div>
    </div>
  )
}
