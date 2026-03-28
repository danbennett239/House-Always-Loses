import { SYMBOLS } from '../../utils/probability.js'
import './Paytable.css'

// Sorted highest payout first
const SORTED = [...SYMBOLS].sort((a, b) => b.payout - a.payout)

export default function Paytable() {
  return (
    <div className="paytable">
      <h2 className="paytable-title">Payouts</h2>
      <table className="paytable-table">
        <tbody>
          {SORTED.map((sym) => (
            <tr key={sym.id} className="paytable-row">
              <td className="paytable-combo">
                <span>{sym.emoji}</span>
                <span>{sym.emoji}</span>
                <span>{sym.emoji}</span>
              </td>
              <td className="paytable-multiplier">{sym.payout}×</td>
            </tr>
          ))}
          <tr className="paytable-row paytable-row--ldw">
            <td className="paytable-combo paytable-combo--any">
              <span>any</span>
              <span>×2</span>
            </td>
            <td className="paytable-multiplier paytable-multiplier--ldw">0.5×</td>
          </tr>
        </tbody>
      </table>
      <p className="paytable-rtp">RTP 85%</p>
    </div>
  )
}
