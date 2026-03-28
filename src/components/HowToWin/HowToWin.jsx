import './HowToWin.css'

const PAYOUTS = [
  { symbol: '🍒', name: 'Cherry',  multiplier: 2,  twoOf: true  },
  { symbol: '🍋', name: 'Lemon',   multiplier: 3,  twoOf: true  },
  { symbol: '🍊', name: 'Orange',  multiplier: 4,  twoOf: true  },
  { symbol: '🍇', name: 'Plum',    multiplier: 6,  twoOf: true  },
  { symbol: '🔔', name: 'Bell',    multiplier: 15, twoOf: true  },
  { symbol: '7️⃣', name: 'Seven',   multiplier: 50, twoOf: true  },
]

export default function HowToWin() {
  return (
    <aside className="htw-panel">
      <h2 className="htw-title">How to Win</h2>

      <section className="htw-section">
        <h3 className="htw-section-title">Match 3 — Full Win</h3>
        <p className="htw-note">All three reels show the same symbol</p>
        <ul className="htw-payout-list">
          {PAYOUTS.map(({ symbol, name, multiplier }) => (
            <li key={name} className="htw-payout-row">
              <span className="htw-symbols">
                {symbol}{symbol}{symbol}
              </span>
              <span className="htw-label">{name}</span>
              <span className="htw-multiplier">{multiplier}×</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="htw-section">
        <h3 className="htw-section-title">Match 2 — Partial Win</h3>
        <div className="htw-two-of-a-kind">
          <span className="htw-symbols">🍒🍒&nbsp;&nbsp;🍇🍇</span>
          <span className="htw-multiplier">0.5×</span>
        </div>
        <p className="htw-note">Any two matching symbols pay half your bet</p>
      </section>

      <section className="htw-section">
        <h3 className="htw-section-title">How to Bet</h3>
        <ol className="htw-steps">
          <li>Choose a chip amount below the reels</li>
          <li>Press <strong>SPIN</strong></li>
          <li>Win if the reels line up on the centre row</li>
        </ol>
      </section>

      <div className="htw-rtp-badge">
        <span className="htw-rtp-label">House Edge</span>
        <span className="htw-rtp-value">15%</span>
        <span className="htw-rtp-sub">£0.85 returned per £1 bet on average</span>
      </div>
    </aside>
  )
}
