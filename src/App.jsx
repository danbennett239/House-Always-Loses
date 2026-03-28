import { useGameEngine } from './hooks/useGameEngine.js'
import SlotMachine from './components/SlotMachine/SlotMachine.jsx'
import HowToWin from './components/HowToWin/HowToWin.jsx'
import PlayByPlay from './components/PlayByPlay/PlayByPlay.jsx'
import './App.css'

export default function App() {
  const engine = useGameEngine()

  return (
    <div className="app-layout">
      <HowToWin />
      <SlotMachine {...engine} />
      <PlayByPlay log={engine.sessionData.log} />
    </div>
  )
}
