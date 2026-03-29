import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import './AboutUs.css'

const STATS = [
  { value: '1 in 3', label: 'adults gamble regularly in the UK' },
  { value: '£1,200', label: 'lost per year by the average problem gambler' },
  { value: '3×',     label: 'higher rate of depression in gamblers' },
  { value: '430+',   label: 'gambling sites licensed in the UK' },
]

const TRICKS = [
  {
    id: 'ldw',
    icon: '🎭',
    title: 'Loss Disguised as Win',
    body: 'You bet £5, two reels match and you "win" £2.50 — but you\'re still £2.50 down. The machine celebrates anyway. Lights, sounds, animations. The loss never registers.',
    live: true,
  },
  {
    id: 'nearmiss',
    icon: '🎯',
    title: 'Near Misses',
    body: 'Two matching symbols appear. The third lands one position away. This happens far more often than pure chance — machines are programmed to manufacture the feeling that a jackpot is imminent.',
    live: true,
  },
  {
    id: 'sunkcost',
    icon: '🕳️',
    title: 'Sunk Cost Nudge',
    body: 'After heavy losses, the urge to "win it back" is overwhelming. Casinos design for this moment. The money is gone. Chasing it only adds to the loss.',
    live: true,
  },
  {
    id: 'variable',
    icon: '🎲',
    title: 'Variable Ratio Reinforcement',
    body: 'Unpredictable rewards produce the strongest compulsive behaviour — the same mechanic behind slot machines, social media likes, and loot boxes. You can\'t stop because the next win might be now.',
  },
  {
    id: 'sensory',
    icon: '🔊',
    title: 'Sensory Manipulation',
    body: 'Wins are loud and celebratory. Losses are silent. The soundscape is engineered to make winning feel constant. Autoplay removes the friction of deciding to spin again.',
  },
  {
    id: 'abstraction',
    icon: '💳',
    title: 'Abstracting Real Money',
    body: 'Chips, credits, gems — abstract tokens disconnect spending from its real-world weight. You\'re not losing £20; you\'re losing "20 coins". Online wallets reinforce the illusion.',
  },
  {
    id: 'environment',
    icon: '🕐',
    title: 'Engineered Environments',
    body: 'No clocks. No windows. Free drinks. Physical casinos erase every anchor to real time. Online platforms replicate this: 24/7 access, dark UIs, push notifications.',
  },
  {
    id: 'fallacy',
    icon: '📉',
    title: "The Gambler's Fallacy",
    body: 'After ten losses, a win feels due. It isn\'t. Each spin is statistically independent. The machine has no memory. The belief that past outcomes predict future ones is the engine of compulsive play.',
  },
]

const RESOURCES = [
  { name: 'GamCare',               desc: 'Free support, counselling, and a 24/7 helpline',         phone: '0808 8020 133' },
  { name: 'BeGambleAware',         desc: 'Advice, self-assessment tools, and a treatment finder',   phone: null },
  { name: 'Gamblers Anonymous UK', desc: 'Peer support groups meeting nationwide',                  phone: '0330 094 0322' },
]

/* ── Reusable animation variants ───────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1,    transition: { duration: 0.5, ease: [0.34, 1.26, 0.64, 1] } },
}

const staggerContainer = (stagger = 0.1) => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger } },
})

/* ── Helper: trigger animation when element enters viewport ── */
function InView({ children, variants, className, stagger, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={stagger ? staggerContainer(stagger) : variants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  )
}

/* ── Stat card with a pop entrance ── */
function StatCard({ value, label, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className="au-stat-card"
      variants={scaleIn}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay: index * 0.09, duration: 0.5, ease: [0.34, 1.26, 0.64, 1] }}
    >
      <span className="au-stat-value">{value}</span>
      <span className="au-stat-label">{label}</span>
    </motion.div>
  )
}

/* ── Trick card with alternating slide direction ── */
function TrickCard({ trick, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const fromLeft = index % 2 === 0
  const { id, icon, title, body, live } = trick
  return (
    <motion.article
      ref={ref}
      className={`au-trick-card${live ? ' au-trick-card--live' : ''}`}
      variants={fromLeft ? fadeLeft : fadeRight}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay: (index % 4) * 0.07 }}
    >
      <div className="au-trick-top">
        <span className="au-trick-icon" aria-hidden="true">{icon}</span>
        {live && <span className="au-live-chip">Live</span>}
      </div>
      <h3 className="au-trick-title">{title}</h3>
      <p className="au-trick-body">{body}</p>
    </motion.article>
  )
}

export default function AboutUs() {
  /* Parallax hero on scroll */
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY      = useTransform(heroScroll, [0, 1], [0, 80])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  /* Animate the divider line width */
  const divider1Ref = useRef(null)
  const div1InView = useInView(divider1Ref, { once: true })
  const divider2Ref = useRef(null)
  const div2InView = useInView(divider2Ref, { once: true })

  return (
    <main className="au-page">

      {/* ── Hero ── */}
      <section className="au-hero" ref={heroRef}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="au-hero-inner">
          <motion.p
            className="au-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            GamBull
          </motion.p>
          <motion.h1
            className="au-hero-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Know the game<br />before you play it.
          </motion.h1>
          <motion.p
            className="au-hero-body"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
          >
            Every mechanic in this slot machine is lifted directly from the gambling industry. We built it so you can see the tricks in action — and understand exactly how they work.
          </motion.p>
          <motion.div
            className="au-hero-scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="au-stats-section">
        <div className="au-stats-grid">
          {STATS.map(({ value, label }, i) => (
            <StatCard key={label} value={value} label={label} index={i} />
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <motion.div
        ref={divider1Ref}
        className="au-divider"
        initial={{ scaleX: 0 }}
        animate={div1InView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      {/* ── Tricks ── */}
      <section className="au-section">
        <InView variants={fadeUp}>
          <p className="au-section-eyebrow">Psychology</p>
          <h2 className="au-section-title">How they keep you playing.</h2>
          <p className="au-section-body">
            The three tricks marked <span className="au-live-chip">Live</span> are demonstrated in real time by the slot machine. Watch the callouts as you play.
          </p>
        </InView>
        <div className="au-tricks-grid">
          {TRICKS.map((trick, i) => (
            <TrickCard key={trick.id} trick={trick} index={i} />
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <motion.div
        ref={divider2Ref}
        className="au-divider"
        initial={{ scaleX: 0 }}
        animate={div2InView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      {/* ── Help ── */}
      <section className="au-section au-help-section">
        <InView variants={fadeUp}>
          <p className="au-section-eyebrow">Support</p>
          <h2 className="au-section-title">You don't have to figure this out alone.</h2>
          <p className="au-section-body">
            Free, confidential help is available right now — no referral needed.
          </p>
        </InView>
        <InView stagger={0.12} className="au-resources">
          {RESOURCES.map(({ name, desc, phone }) => (
            <motion.div key={name} className="au-resource-card" variants={fadeUp}>
              <div className="au-resource-info">
                <span className="au-resource-name">{name}</span>
                <span className="au-resource-desc">{desc}</span>
              </div>
              {phone && <span className="au-resource-phone">{phone}</span>}
            </motion.div>
          ))}
        </InView>
      </section>

      <div className="au-footer-glow" aria-hidden="true" />

    </main>
  )
}
