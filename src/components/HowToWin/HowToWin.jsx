import { SYMBOLS, RTP, HOUSE_EDGE } from '../../utils/probability.js'
import './HowToWin.css'

const HOUSE_EDGE_PCT   = Math.round(HOUSE_EDGE * 100)
const RETURN_PER_POUND = RTP.toFixed(2)

// First symbol in SYMBOLS used as the "odd one out" in the match-2 example
const [s0, s1] = SYMBOLS

export default function HowToWin() {
  return (
    <aside className="htw-panel">
      <h2 className="htw-title">How to Win</h2>

      <section className="htw-section">
        <h3 className="htw-section-title">Match 3 — Full Win</h3>
        <p className="htw-note">All three reels show the same symbol</p>
        <ul className="htw-payout-list">
          {SYMBOLS.map(({ id, emoji, payout }) => (
            <li key={id} className="htw-payout-row">
              <span
                className="htw-symbols"
                aria-hidden="true"
              >
                {emoji}{emoji}{emoji}
              </span>
              <span className="htw-label">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
              <span className="htw-multiplier">{payout}×</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="htw-section">
        <h3 className="htw-section-title">Match 2 — Partial Win</h3>
        <div className="htw-two-of-a-kind">
          {/* Three reels, two matching — e.g. 🍒🍒🍋 */}
          <span className="htw-symbols" aria-hidden="true">
            {s0.emoji}{s0.emoji}{s1.emoji}
          </span>
          <span className="htw-multiplier">0.5×</span>
        </div>
        <p className="htw-note">Any two matching symbols pay half your bet (net loss)</p>
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
        <span className="htw-rtp-value">{HOUSE_EDGE_PCT}%</span>
        <span className="htw-rtp-sub">£{RETURN_PER_POUND} returned per £1 bet on average</span>
      </div>
    </aside>
  )
}
