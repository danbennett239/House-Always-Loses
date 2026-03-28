import { RTP, HOUSE_EDGE } from '../../utils/probability.js'
import './TrickList.css'

function longestLosingStreak(spinHistory) {
  let max = 0, current = 0
  for (const { net } of spinHistory) {
    if (net < 0) { current++; if (current > max) max = current }
    else current = 0
  }
  return max
}

const TRICKS = [
  {
    id: 'house-edge',
    name: 'House Edge',
    getStat: () => `${(HOUSE_EDGE * 100).toFixed(1)}p lost per £1 bet`,
    getDetected: () => true,
    description: () =>
      `This machine returns ${(RTP * 100).toFixed(1)}p per £1 bet. The house keeps the other ${(HOUSE_EDGE * 100).toFixed(1)}p — silently, automatically, every spin.`,
  },
  {
    id: 'near-miss',
    name: 'Near Miss',
    getStat: (sd) => sd.nearMisses > 0 ? `${sd.nearMisses} detected` : 'None detected',
    getDetected: (sd) => sd.nearMisses > 0,
    description: (sd) =>
      sd.nearMisses > 0
        ? `${sd.nearMisses} time${sd.nearMisses !== 1 ? 's' : ''} the first and last reel matched but the middle didn't — a full loss that looks like a near-win. No payout. Pure psychology.`
        : 'First and last reel match, middle doesn\'t — a full loss engineered to feel like bad luck rather than the expected outcome.',
  },
  {
    id: 'ldw',
    name: 'Loss Disguised as Win',
    getStat: (sd) => sd.ldwCount > 0 ? `${sd.ldwCount} times` : 'None this session',
    getDetected: (sd) => sd.ldwCount > 0,
    description: (sd) =>
      sd.ldwCount > 0
        ? `${sd.ldwCount} time${sd.ldwCount !== 1 ? 's' : ''} two adjacent reels matched and the machine celebrated — but the payout was less than your bet. You were losing while winning.`
        : 'Two adjacent reels match, triggering win sounds and animation. The payout is less than the bet. The machine celebrates your loss.',
  },
  {
    id: 'variable-reward',
    name: 'Variable Reward Schedule',
    getStat: (sd) => sd.bigWins > 0 ? `${sd.bigWins} big win${sd.bigWins !== 1 ? 's' : ''}` : 'Always active',
    getDetected: () => true,
    description: (sd) =>
      sd.bigWins > 0
        ? `${sd.bigWins} outsized payout${sd.bigWins !== 1 ? 's' : ''} kept the pattern unpredictable. Unpredictable rewards produce stronger compulsive behaviour than predictable ones — the same mechanism as a Skinner box.`
        : 'Unpredictable reward timing produces the strongest compulsive behaviour. Identical to operant conditioning in a Skinner box.',
  },
  {
    id: 'sound-design',
    name: 'Asymmetric Sound Design',
    getStat: () => 'Every spin',
    getDetected: () => true,
    description: () =>
      'Wins trigger audio and visual fanfare. Losses are silent. Your brain registers wins as more salient than losses — distorting your sense of how often you won.',
  },
  {
    id: 'sunk-cost',
    name: 'Sunk Cost',
    getStat: (sd) => {
      const streak = longestLosingStreak(sd.spinHistory)
      return streak > 0 ? `${streak}-spin losing streak` : 'Always active'
    },
    getDetected: () => true,
    description: (sd) => {
      const streak = longestLosingStreak(sd.spinHistory)
      return streak > 1
        ? `Your longest losing run was ${streak} spins. Each loss raised the psychological cost of stopping — you were already invested.`
        : 'After each loss, the next spin feels cheaper — you are recouping, not spending. Each loss raises the psychological cost of stopping.'
    },
  },
]

function TrickItem({ trick, sessionData }) {
  const detected = trick.getDetected(sessionData)
  return (
    <div className={`trick-item ${detected ? 'trick-item--detected' : 'trick-item--inactive'}`}>
      <div className="trick-header">
        <span className="trick-name">{trick.name}</span>
        <span className={`trick-stat ${detected ? 'trick-stat--detected' : ''}`}>
          {trick.getStat(sessionData)}
        </span>
      </div>
      <p className="trick-description">{trick.description(sessionData)}</p>
    </div>
  )
}

export default function TrickList({ sessionData }) {
  return (
    <div className="trick-list">
      {TRICKS.map((trick) => (
        <TrickItem key={trick.id} trick={trick} sessionData={sessionData} />
      ))}
    </div>
  )
}
