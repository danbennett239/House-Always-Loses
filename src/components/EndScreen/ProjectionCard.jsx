import { projectLifetime, SPINS_PER_HOUR, HOURS_PER_SESSION, SESSIONS_PER_YEAR } from '../../utils/projections.js'
import './ProjectionCard.css'

function ProjectionRow({ label, value }) {
  const isZero     = value === 0
  const isNegative = value < 0
  const styleClass = isZero ? '' : isNegative ? 'proj-value--win' : 'proj-value--loss'
  const prefix     = isZero ? '' : isNegative ? '+' : '-'
  const display    = Math.abs(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="proj-row">
      <span className="proj-label">{label}</span>
      <span className={`proj-value ${styleClass}`}>
        {prefix}£{display}
      </span>
    </div>
  )
}

export default function ProjectionCard({ sessionData }) {
  const proj = projectLifetime(sessionData)

  const netResult = sessionData.netBalance   // positive = net win, negative = net loss

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

      {proj && (() => {
        const source = proj.usingExperiencedRTP ? proj.experienced : proj.theoretical
        return (
          <>
            <div className="proj-rtp">
              {proj.usingExperiencedRTP
                ? <>You got back <strong>{(source.rtp * 100).toFixed(1)}p</strong> for every £1 you bet</>
                : <>Too few spins for a personal rate — projections use the <strong>claimed {(source.rtp * 100).toFixed(0)}%</strong> RTP</>
              }
            </div>

            <div className="proj-rows">
              <ProjectionRow label="Per hour"                               value={source.netPerHour} />
              <ProjectionRow label={`Per session (${HOURS_PER_SESSION} hr)`}   value={source.netPerSession} />
              <ProjectionRow label={`Per year (${SESSIONS_PER_YEAR} sessions)`} value={source.netPerYear} />
              <ProjectionRow label="Over 10 years"                          value={source.netPerDecade} />
            </div>

            <p className="proj-note">
              {proj.usingExperiencedRTP ? 'Based on your actual rate' : 'Based on claimed RTP'}
              {` · ~${SPINS_PER_HOUR} spins/hr · ${HOURS_PER_SESSION} hr sessions · ${SESSIONS_PER_YEAR}×/yr`}
            </p>
          </>
        )
      })()}
    </div>
  )
}
