import { useState, useEffect } from 'react'
import './SpinButton.css'

const BET_INCREMENTS = [1, 5, 10, 15, 25, 50]
const MIN_BET = 1

export default function SpinButton({ bet, setBet, balance, onSpin, spinDisabled, spinning, autoRoll, setAutoRoll }) {
  const [draft, setDraft] = useState(String(bet))
  const [error, setError] = useState('')

  // Keep input in sync when a chip button sets the bet externally
  useEffect(() => {
    setDraft(String(bet))
    setError('')
  }, [bet])

  function handleChange(raw) {
    // Allow only digits and a single decimal point with up to 2dp
    const sanitised = raw.replace(/[^0-9.]/g, '').replace(/^(\d*\.?\d{0,2}).*$/, '$1')
    setDraft(sanitised)
    setError('')
  }

  function commitDraft(raw) {
    const value = parseFloat(raw)
    if (isNaN(value) || value < MIN_BET) {
      setError(`Min £${MIN_BET}`)
      setDraft(String(bet))
      return
    }
    if (value > balance) {
      // Mirror reducer: clamp to max(MIN_BET, balance) so draft always matches what the engine will use
      const capped = Math.round(Math.max(MIN_BET, balance) * 100) / 100
      setDraft(String(capped))
      setBet(capped)
      return
    }
    const rounded = Math.round(value * 100) / 100
    setError('')
    setDraft(String(rounded))
    setBet(rounded)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.target.blur() // blur fires onBlur → commitDraft; don't call it again here
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
            type="text"
            inputMode="decimal"
            value={draft}
            disabled={spinning}
            onChange={e => handleChange(e.target.value)}
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

      <label className="auto-roll-label">
        <input
          type="checkbox"
          className="auto-roll-checkbox"
          checked={autoRoll}
          onChange={e => setAutoRoll(e.target.checked)}
        />
        Auto Roll
      </label>

      <div className="balance-display">Balance: £{balance.toFixed(2)}</div>
    </div>
  )
}
