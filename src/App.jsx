import { useState, useEffect, useCallback } from 'react'
import { useGameEngine } from './hooks/useGameEngine.js'
import SlotMachine from './components/SlotMachine/SlotMachine.jsx'
import HowToWin from './components/HowToWin/HowToWin.jsx'
import PlayByPlay from './components/PlayByPlay/PlayByPlay.jsx'
import AboutUs from './components/AboutUs/AboutUs.jsx'
import './App.css'

export default function App() {
  const engine = useGameEngine()
  const [page, setPage] = useState('game')
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  )
  // Only show log entries that were present when the reels last settled
  const [settledLogLength, setSettledLogLength] = useState(0)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleReelsSettled = useCallback(() => {
    setSettledLogLength(engine.sessionData.log.length)
  }, [engine.sessionData.log.length])

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
        <div className="game-layout">
          <HowToWin />
          <SlotMachine {...engine} onReelsSettled={handleReelsSettled} />
          <PlayByPlay log={visibleLog} />
        </div>
      ) : (
        <AboutUs />
      )}
    </div>
  )
}
