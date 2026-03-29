// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  return '£' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function sign(n) { return n === 0 ? '' : n > 0 ? '-' : '+' }

// ── Overlay ───────────────────────────────────────────────────────────────────
let overlay         = null
let backdrop        = null
let expanded        = false
let lastData        = null

function setExpanded(val) {
  expanded = val
  overlay.classList.toggle('hal-expanded', expanded)
  overlay.setAttribute('aria-expanded', String(expanded))
  if (expanded) {
    backdrop = document.createElement('div')
    backdrop.id = 'hal-ext-backdrop'
    backdrop.addEventListener('click', () => setExpanded(false))
    document.body.insertBefore(backdrop, overlay)
    // Move focus into overlay so keyboard users can tab to Minimise
    overlay.focus()
  } else {
    backdrop?.remove()
    backdrop = null
  }
  render(lastData)
}

function ensureOverlay() {
  // Idempotent — reuse existing element if script is injected more than once
  const existing = document.getElementById('hal-ext-overlay')
  if (existing) { overlay = existing; return overlay }

  overlay = document.createElement('div')
  overlay.id = 'hal-ext-overlay'
  overlay.setAttribute('role', 'button')
  overlay.setAttribute('tabindex', '0')
  overlay.setAttribute('aria-label', 'Reality Check — click to expand')
  overlay.setAttribute('aria-expanded', 'false')

  overlay.addEventListener('click', () => { if (!expanded) setExpanded(true) })
  overlay.addEventListener('keydown', (e) => {
    if (!expanded && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setExpanded(true)
    }
    if (expanded && e.key === 'Escape') setExpanded(false)
  })

  document.body.appendChild(overlay)
  return overlay
}

function render(data) {
  const el = ensureOverlay()

  if (!data || !data.projections) {
    el.innerHTML = ''
    const header = document.createElement('div')
    header.className = 'hal-header'
    header.innerHTML = '<span class="hal-logo">⚠︎</span>'
    const title = document.createElement('span')
    title.className = 'hal-title'
    title.textContent = 'Reality Check'
    header.appendChild(title)
    el.appendChild(header)

    const idle = document.createElement('p')
    idle.className = 'hal-idle'
    idle.textContent = 'Waiting for first spin…'
    el.appendChild(idle)
    return
  }

  const { projections: proj, totalSpins, ldwCount, nearMisses, lossToDate } = data
  const usingExpRTP = proj.usingExperiencedRTP
  const rtp         = proj.experienced.rtp
  const perHour     = proj.experienced.netPerHour
  const perSession  = proj.experienced.netPerSession
  const perYear     = proj.experienced.netPerYear

  el.innerHTML = ''

  // Header
  const header = document.createElement('div')
  header.className = 'hal-header'
  const logo = document.createElement('span')
  logo.className = 'hal-logo'
  logo.textContent = '⚠︎'
  const titleEl = document.createElement('span')
  titleEl.className = 'hal-title'
  titleEl.textContent = 'Reality Check'
  const spinsEl = document.createElement('span')
  spinsEl.className = 'hal-spins'
  spinsEl.textContent = `${totalSpins} spin${totalSpins !== 1 ? 's' : ''}`
  header.append(logo, titleEl, spinsEl)
  el.appendChild(header)

  // Rows helper
  function addRow(parent, label, value, cls) {
    const row = document.createElement('div')
    row.className = 'hal-row'
    const l = document.createElement('span')
    l.className = 'hal-label'
    l.textContent = label
    const v = document.createElement('span')
    v.className = `hal-value${cls ? ' ' + cls : ''}`
    v.textContent = value
    row.append(l, v)
    parent.appendChild(row)
  }

  const sec1 = document.createElement('div')
  sec1.className = 'hal-section'
  function projFmt(n) { return `${n > 0 ? '-' : '+'}${fmt(n)}` }
  function projCls(n) { return n > 0 ? 'hal-red' : 'hal-green' }

  addRow(sec1, 'Lost so far',         `${sign(lossToDate)}${fmt(lossToDate)}`, lossToDate > 0 ? 'hal-red' : 'hal-green')
  addRow(sec1, 'Projected / hour',    projFmt(perHour),    projCls(perHour))
  addRow(sec1, 'Projected / session', projFmt(perSession), projCls(perSession))
  addRow(sec1, 'Projected / year',    projFmt(perYear),    projCls(perYear))
  el.appendChild(sec1)

  const divider = document.createElement('div')
  divider.className = 'hal-divider'
  el.appendChild(divider)

  const sec2 = document.createElement('div')
  sec2.className = 'hal-section'
  addRow(sec2, 'Loss Disguised as Win', `${ldwCount}×`,    'hal-orange')
  addRow(sec2, 'Near Misses',           `${nearMisses}×`,  'hal-orange')
  addRow(sec2, `Actual RTP${usingExpRTP ? '' : '*'}`, `${(rtp * 100).toFixed(1)}%`)
  el.appendChild(sec2)

  if (!usingExpRTP) {
    const note = document.createElement('p')
    note.className = 'hal-note'
    note.textContent = '* Theoretical — more spins needed'
    el.appendChild(note)
  }

  if (expanded) {
    const btn = document.createElement('button')
    btn.className = 'hal-collapse-btn'
    btn.textContent = 'Minimise'
    btn.addEventListener('click', (e) => { e.stopPropagation(); setExpanded(false) })
    el.appendChild(btn)
  }
}

// ── Listen (guarded — safe to inject multiple times) ─────────────────────────
if (!globalThis.__halInitialised) {
  globalThis.__halInitialised = true
  ensureOverlay()
  render(null)

  window.addEventListener('hal:spin-settled', (e) => {
    lastData = e.detail
    render(lastData)
  })
}
