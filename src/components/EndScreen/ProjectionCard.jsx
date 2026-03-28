import { projectLifetime } from '../../utils/projections.js'
import './ProjectionCard.css'

function ProjectionRow({ label, value }) {
  const isNegative = value < 0
  return (
    <div className="proj-row">
      <span className="proj-label">{label}</span>
      <span className={`proj-value ${isNegative ? 'proj-value--win' : 'proj-value--loss'}`}>
        {isNegative ? '+' : '-'}£{Math.abs(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  )
}

export default function ProjectionCard({ sessionData, balance }) {
  const proj = projectLifetime(sessionData)

  const netResult = balance - 100   // positive = net win, negative = net loss

  return (
    <div className="projection-card">
      <div className="proj-summary">
        <div className="proj-summary-item">
          <span className="proj-summary-value">{sessionData.totalSpins}</span>
          <span className="proj-summary-label">spins</span>
        </div>
        <div className="proj-summary-item">
          <span className="proj-summary-value">£{sessionData.totalWagered.toFixed(2)}</span>
          <span className="proj-summary-label">wagered</span>
        </div>
        <div className="proj-summary-item">
          <span className={`proj-summary-value ${netResult < 0 ? 'proj-value--loss' : 'proj-value--win'}`}>
            {netResult >= 0 ? '+' : '-'}£{Math.abs(netResult).toFixed(2)}
          </span>
          <span className="proj-summary-label">net result</span>
        </div>
      </div>

      {proj && (
        <>
          <div className="proj-rtp">
            You got back <strong>{(proj.experienced.rtp * 100).toFixed(1)}p</strong> for every £1 you bet
          </div>

          <div className="proj-rows">
            <ProjectionRow label="Per hour"           value={proj.experienced.lossPerHour} />
            <ProjectionRow label="Per session (4 hr)" value={proj.experienced.lossPerSession} />
            <ProjectionRow label="Per year"           value={proj.experienced.lossPerYear} />
            <ProjectionRow label="Over 10 years"      value={proj.experienced.lossPerDecade} />
          </div>

          <p className="proj-note">Based on your actual rate · ~600 spins/hr · 4 hr sessions · 50×/yr</p>
        </>
      )}
    </div>
  )
}
