import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameEngine } from './hooks/useGameEngine.js'
import { projectLifetime } from './utils/projections.js'
import { useTrickDetector } from './hooks/useTrickDetector.js'
import SlotMachine from './components/SlotMachine/SlotMachine.jsx'
import HowToWin from './components/HowToWin/HowToWin.jsx'
import PlayByPlay from './components/PlayByPlay/PlayByPlay.jsx'
import AboutUs from './components/AboutUs/AboutUs.jsx'
import TrickToast from './components/TrickToast/TrickToast.jsx'
import './App.css'

export default function App() {
  const engine = useGameEngine()
  const [page, setPage] = useState('game')
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  )
  const [settledLogLength, setSettledLogLength] = useState(0)

  const { event: trickEvent, clearEvent } = useTrickDetector(
    engine.sessionData, engine.reels, engine.lastResult
  )
  const pendingTrick    = useRef(null)
  const toastTimeout    = useRef(null)
  const [activeToast, setActiveToast] = useState(null)

  // Clear pending toast timer on unmount
  useEffect(() => () => clearTimeout(toastTimeout.current), [])

  useEffect(() => {
    if (trickEvent) pendingTrick.current = trickEvent
  }, [trickEvent])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleReelsSettled = useCallback(() => {
    setSettledLogLength(engine.sessionData.log.length)
    if (pendingTrick.current) {
      const trick = pendingTrick.current
      pendingTrick.current = null
      clearTimeout(toastTimeout.current)
      const isMobile = window.matchMedia('(max-width: 700px)').matches
      if (isMobile) {
        toastTimeout.current = setTimeout(() => setActiveToast(trick), 750)
      } else {
        setActiveToast(trick)
      }
    }
    // Emit pre-computed projections for Chrome extension — no raw session data exposed
    const proj = projectLifetime(engine.sessionData)
    const sd   = engine.sessionData
    window.dispatchEvent(new CustomEvent('hal:spin-settled', {
      detail: {
        projections: proj,
        totalSpins:  sd.totalSpins,
        ldwCount:    sd.ldwCount,
        nearMisses:  sd.nearMisses,
        lossToDate:  proj?.lossToDate ?? 0,
      }
    }))
  }, [engine.sessionData, engine.lastResult, engine.balance])

  function dismissToast() {
    setActiveToast(null)
    clearEvent()
  }

  const handleReset = useCallback(() => {
    clearTimeout(toastTimeout.current)
    dismissToast()
    pendingTrick.current = null
    engine.reset()
  }, [engine.reset])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  const visibleLog = engine.sessionData.log.slice(0, settledLogLength)

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav-tabs">
          <button
            className={`app-nav-btn${page === 'game' ? ' active' : ''}`}
            onClick={() => setPage('game')}
          >
            Play
          </button>
          <button
            className={`app-nav-btn${page === 'about' ? ' active' : ''}`}
            onClick={() => setPage('about')}
          >
            About
          </button>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀︎' : '☽'}
        </button>
      </nav>

      {page === 'game' ? (
        <div className="game-layout" data-toast-active={!!activeToast || undefined}>
          {/* Left column: trick callout lives here */}
          <div className="toast-area">
            <TrickToast event={activeToast} onDismiss={dismissToast} onNavigateAbout={() => setPage('about')} />
          </div>
          {/* Centre column (row 1): machine. HowToWin placed in row 2 same column via CSS grid. */}
          <div className="machine-column">
            <SlotMachine {...engine} canSpin={engine.canSpin && !activeToast} reset={handleReset} onReelsSettled={handleReelsSettled} />
          </div>
          <PlayByPlay log={visibleLog} />
          <HowToWin />
        </div>
      ) : (
        <AboutUs />
      )}
    </div>
  )
}
