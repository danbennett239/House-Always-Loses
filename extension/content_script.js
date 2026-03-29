// ── Projection logic (mirrored from src/utils/projections.js) ──────────────
const THEORETICAL_RTP        = 0.85
const SPINS_PER_HOUR         = 600
const HOURS_PER_SESSION      = 4
const SESSIONS_PER_YEAR      = 50
const MIN_SPINS_FOR_EXP_RTP  = 10

function experiencedRTP(sd) {
  if (sd.totalSpins < MIN_SPINS_FOR_EXP_RTP) return THEORETICAL_RTP
  return sd.totalWon / sd.totalWagered
}

function project(avgBet, houseEdge) {
  const perSpin    = avgBet * houseEdge
  const perHour    = perSpin    * SPINS_PER_HOUR
  const perSession = perHour    * HOURS_PER_SESSION
  const perYear    = perSession * SESSIONS_PER_YEAR
  return { perSpin, perHour, perSession, perYear }
}

function calcProjections(sd) {
  if (sd.totalSpins === 0) return null
  const avgBet    = sd.totalWagered / sd.totalSpins
  const rtp       = experiencedRTP(sd)
  const useExp    = sd.totalSpins >= MIN_SPINS_FOR_EXP_RTP
  const proj      = project(avgBet, 1 - rtp)
  return {
    lossToDate:  -sd.netBalance,
    perHour:      proj.perHour,
    perSession:   proj.perSession,
    perYear:      proj.perYear,
    ldwCount:     sd.ldwCount,
    nearMisses:   sd.nearMisses,
    totalSpins:   sd.totalSpins,
    usingExpRTP:  useExp,
    rtp,
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return '£' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function sign(n) { return n >= 0 ? '-' : '+' }

// ── Overlay ───────────────────────────────────────────────────────────────────
let overlay         = null
let backdrop        = null
let expanded        = false
let lastProjections = null

function setExpanded(val) {
  expanded = val
  overlay.classList.toggle('hal-expanded', expanded)
  if (expanded) {
    backdrop = document.createElement('div')
    backdrop.id = 'hal-ext-backdrop'
    backdrop.addEventListener('click', () => setExpanded(false))
    document.body.insertBefore(backdrop, overlay)
  } else {
    backdrop?.remove()
    backdrop = null
  }
  render(lastProjections)
}

function ensureOverlay() {
  if (overlay) return overlay
  overlay = document.createElement('div')
  overlay.id = 'hal-ext-overlay'
  overlay.addEventListener('click', () => {
    if (!expanded) setExpanded(true)
  })
  document.body.appendChild(overlay)
  return overlay
}

function render(p) {
  const el = ensureOverlay()

  if (!p) {
    el.innerHTML = `
      <div class="hal-header">
        <span class="hal-logo">⚠︎</span>
        <span class="hal-title">Reality Check</span>
      </div>
      <p class="hal-idle">Waiting for first spin…</p>
    `
    return
  }

  el.innerHTML = `
    <div class="hal-header">
      <span class="hal-logo">⚠︎</span>
      <span class="hal-title">Reality Check</span>
      <span class="hal-spins">${p.totalSpins} spin${p.totalSpins !== 1 ? 's' : ''}</span>
    </div>

    <div class="hal-section">
      <div class="hal-row">
        <span class="hal-label">Lost so far</span>
        <span class="hal-value ${p.lossToDate > 0 ? 'hal-red' : 'hal-green'}">${sign(p.lossToDate)}${fmt(p.lossToDate)}</span>
      </div>
      <div class="hal-row">
        <span class="hal-label">Projected / hour</span>
        <span class="hal-value hal-red">-${fmt(p.perHour)}</span>
      </div>
      <div class="hal-row">
        <span class="hal-label">Projected / session</span>
        <span class="hal-value hal-red">-${fmt(p.perSession)}</span>
      </div>
      <div class="hal-row">
        <span class="hal-label">Projected / year</span>
        <span class="hal-value hal-red">-${fmt(p.perYear)}</span>
      </div>
    </div>

    <div class="hal-divider"></div>

    <div class="hal-section">
      <div class="hal-row">
        <span class="hal-label">Loss Disguised as Win</span>
        <span class="hal-value hal-orange">${p.ldwCount}×</span>
      </div>
      <div class="hal-row">
        <span class="hal-label">Near Misses</span>
        <span class="hal-value hal-orange">${p.nearMisses}×</span>
      </div>
      <div class="hal-row">
        <span class="hal-label">Actual RTP${p.usingExpRTP ? '' : '*'}</span>
        <span class="hal-value">${(p.rtp * 100).toFixed(1)}%</span>
      </div>
    </div>

    ${!p.usingExpRTP ? `<p class="hal-note">* Theoretical until ${MIN_SPINS_FOR_EXP_RTP} spins</p>` : ''}
    ${expanded ? `<button class="hal-collapse-btn" id="hal-collapse">Minimise</button>` : ''}
  `

  document.getElementById('hal-collapse')?.addEventListener('click', (e) => {
    e.stopPropagation()
    setExpanded(false)
  })
}

// ── Listen ────────────────────────────────────────────────────────────────────
ensureOverlay()
render(null)

window.addEventListener('hal:spin-settled', (e) => {
  const { sessionData } = e.detail
  lastProjections = calcProjections(sessionData)
  render(lastProjections)
})
