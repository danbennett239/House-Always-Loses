import './SupportCard.css'

const RESOURCES = [
  {
    name: 'BeGambleAware',
    url: 'https://www.begambleaware.org',
    description: 'Free, confidential support and advice.',
  },
  {
    name: 'GamCare',
    url: 'https://www.gamcare.org.uk',
    description: 'National helpline: 0808 8020 133 (free, 24/7).',
  },
  {
    name: 'GamStop',
    url: 'https://www.gamstop.co.uk',
    description: 'Self-exclusion from all UK-licensed gambling sites.',
  },
]

export default function SupportCard() {
  return (
    <div className="support-card">
      <p className="support-intro">
        If this session looked familiar — not as a game, but as a habit — help is available.
      </p>
      <ul className="support-list">
        {RESOURCES.map(({ name, url, description }) => (
          <li key={name} className="support-item">
            <a
              className="support-link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </a>
            <span className="support-description"> — {description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
