import { useState, useEffect } from 'react'
import './SpinButton.css'

const BET_INCREMENTS = [1, 5, 10, 15, 25, 50]
const MIN_BET = 1

export default function SpinButton({ bet, setBet, balance, onSpin, spinDisabled, spinning }) {
  const [draft, setDraft] = useState(String(bet))
  const [error, setError] = useState('')

  // Keep input in sync when a chip button sets the bet externally
  useEffect(() => {
    setDraft(String(bet))
    setError('')
  }, [bet])

  function commitDraft(raw) {
    const value = parseFloat(raw)
    if (isNaN(value) || value < MIN_BET) {
      setError(`Min £${MIN_BET}`)
      setDraft(String(bet))
      return
    }
    if (value > balance) {
      setError(`Max £${balance.toFixed(2)}`)
      setDraft(String(bet))
      return
    }
    const clamped = Math.round(value * 100) / 100
    setError('')
    setDraft(String(clamped))
    setBet(clamped)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.target.blur()
      commitDraft(draft)
    }
  }

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

      <div className="custom-bet-row">
        <label className="custom-bet-label" htmlFor="custom-bet">Custom</label>
        <div className={`custom-bet-input-wrap${error ? ' invalid' : ''}`}>
          <span className="custom-bet-prefix">£</span>
          <input
            id="custom-bet"
            className="custom-bet-input"
            type="number"
            min={MIN_BET}
            max={balance}
            step="1"
            value={draft}
            disabled={spinning}
            onChange={e => { setDraft(e.target.value); setError('') }}
            onBlur={e => commitDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Custom bet amount in pounds"
            aria-describedby={error ? 'custom-bet-error' : undefined}
          />
        </div>
        {error && <span id="custom-bet-error" className="custom-bet-error">{error}</span>}
      </div>

      <button className="spin-btn" onClick={onSpin} disabled={spinDisabled}>
        {spinning ? 'Spinning…' : 'SPIN'}
      </button>

      <div className="balance-display">Balance: £{balance.toFixed(2)}</div>
    </div>
  )
}
