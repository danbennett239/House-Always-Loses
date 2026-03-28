import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameEngine } from './hooks/useGameEngine.js'
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
  const pendingTrick = useRef(null)
  const [activeToast, setActiveToast] = useState(null)

  useEffect(() => {
    if (trickEvent) pendingTrick.current = trickEvent
  }, [trickEvent])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleReelsSettled = useCallback(() => {
    setSettledLogLength(engine.sessionData.log.length)
    if (pendingTrick.current) {
      setActiveToast(pendingTrick.current)
      pendingTrick.current = null
    }
  }, [engine.sessionData.log.length])

  function dismissToast() {
    setActiveToast(null)
    clearEvent()
  }

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
        <div className="game-layout" data-toast-active={activeToast ? 'true' : undefined}>
          {/* Left column: trick callout lives here */}
          <div className="toast-area">
            <TrickToast event={activeToast} onDismiss={dismissToast} />
          </div>
          {/* Centre column: machine only */}
          <div className="machine-column">
            <SlotMachine {...engine} onReelsSettled={handleReelsSettled} />
          </div>
          <PlayByPlay log={visibleLog} />
          {/* Full-width row below the three columns */}
          <HowToWin />
        </div>
      ) : (
        <AboutUs />
      )}
    </div>
  )
}
