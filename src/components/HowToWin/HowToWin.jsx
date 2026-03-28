import { SYMBOLS, RTP, HOUSE_EDGE } from '../../utils/probability.js'
import './HowToWin.css'

const HOUSE_EDGE_PCT   = Math.round(HOUSE_EDGE * 100)
const RETURN_PER_POUND = RTP.toFixed(2)

const [s0, s1] = SYMBOLS

export default function HowToWin() {
  return (
    <aside className="htw-panel" aria-label="How to win">
      <h2 className="htw-title">How to Win</h2>

      <div className="htw-body">
        {/* Col 1: Match 3 payouts — single column */}
        <div className="htw-col">
          <h3 className="htw-section-title">Match 3 — Full Win</h3>
          <ul className="htw-payout-list">
            {SYMBOLS.map(({ id, emoji, payout }) => (
              <li key={id} className="htw-payout-row">
                <span className="htw-symbols" aria-hidden="true">{emoji}{emoji}{emoji}</span>
                <span className="htw-label">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
                <span className="htw-multiplier">{payout}×</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2: Match 2 — Partial + House Edge */}
        <div className="htw-col htw-col--right">
          <div className="htw-sub-section">
            <h3 className="htw-section-title">Match 2 — Partial</h3>
            <div className="htw-two-of-a-kind">
              <span className="htw-symbols" aria-hidden="true">{s0.emoji}{s0.emoji}{s1.emoji}</span>
              <span className="htw-multiplier">0.5×</span>
            </div>
            <p className="htw-note">Pays half your bet (net loss)</p>
          </div>

          <div className="htw-rtp-badge">
            <span className="htw-rtp-label">House Edge</span>
            <span className="htw-rtp-value">{HOUSE_EDGE_PCT}%</span>
            <span className="htw-rtp-sub">£{RETURN_PER_POUND} back per £1 bet</span>
          </div>
        </div>
      </div>

    </aside>
  )
}
