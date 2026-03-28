import SlotMachine from './components/SlotMachine/SlotMachine.jsx'
import HowToWin from './components/HowToWin/HowToWin.jsx'

export default function App() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '24px', padding: '24px' }}>
      <HowToWin />
      <SlotMachine />
    </div>
  )
}
