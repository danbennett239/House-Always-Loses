import './PlayByPlay.css'

function machineLabel(entry) {
  if (entry.isLDW || (entry.gross > 0 && entry.net < 0)) {
    return { text: `WIN  +£${entry.gross.toFixed(2)}`, cls: 'pbp-label--ldw' }
  }
  if (entry.net > 0) {
    return { text: `WIN  +£${entry.gross.toFixed(2)}`, cls: 'pbp-label--win' }
  }
  return { text: 'No win', cls: 'pbp-label--loss' }
}

function truthLabel(entry) {
  if (entry.net > 0) return { text: `+£${entry.net.toFixed(2)} profit`, cls: 'pbp-truth--win' }
  if (entry.net === 0) return { text: 'Break even', cls: 'pbp-truth--neutral' }
  return { text: `-£${Math.abs(entry.net).toFixed(2)} real loss`, cls: 'pbp-truth--loss' }
}

function annotation(entry) {
  if (entry.isLDW) return 'Loss disguised as win — the machine celebrated while you lost money'
  if (entry.nearMiss) return 'Near miss — engineered to feel like bad luck'
  return null
}

function LogEntry({ entry }) {
  const machine = machineLabel(entry)
  const truth = truthLabel(entry)
  const note = annotation(entry)

  return (
    <div className={`pbp-entry ${note ? 'pbp-entry--flagged' : ''}`}>
      <div className="pbp-spin-num">#{entry.spin}</div>
      <div className="pbp-content">
        <div className="pbp-bet-line">Staked £{entry.bet.toFixed(2)}</div>
        <div className="pbp-machine-line">
          <span className="pbp-machine-label">Machine says</span>
          <span className={`pbp-machine-value ${machine.cls}`}>{machine.text}</span>
        </div>
        <div className="pbp-truth-line">
          <span className="pbp-truth-label">Reality</span>
          <span className={`pbp-truth-value ${truth.cls}`}>{truth.text}</span>
        </div>
        {note && <p className="pbp-note">{note}</p>}
      </div>
    </div>
  )
}

export default function PlayByPlay({ log }) {
  return (
    <aside className="pbp-panel">
      <h2 className="pbp-title">Play by Play</h2>
      {log.length === 0 ? (
        <p className="pbp-empty">Spin to see what's really happening.</p>
      ) : (
        <div className="pbp-list">
          {[...log].reverse().map((entry) => (
            <LogEntry key={entry.spin} entry={entry} />
          ))}
        </div>
      )}
    </aside>
  )
}
