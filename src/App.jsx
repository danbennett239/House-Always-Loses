import { useState, useEffect } from 'react'
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

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
          <SlotMachine {...engine} />
          <PlayByPlay log={engine.sessionData.log} />
        </div>
      ) : (
        <AboutUs />
      )}
    </div>
  )
}
