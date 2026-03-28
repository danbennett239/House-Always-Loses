import { useEffect, useRef } from 'react'
import { animate, useMotionValue, motion } from 'framer-motion'

const COLOURS = ['#ffd700', '#f0c040', '#ff6b6b', '#4ecdc4', '#a8e6cf', '#ffffff', '#ff9f43']
const PARTICLE_COUNT = 36

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function Particle({ originX, originY }) {
  const angle  = randomBetween(0, Math.PI * 2)
  const speed  = randomBetween(120, 260)
  const dx     = Math.cos(angle) * speed
  const dy     = Math.sin(angle) * speed - randomBetween(60, 140) // bias upward
  const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)]
  const size   = randomBetween(6, 12)
  const rotate = randomBetween(0, 360)

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: originX,
        top: originY,
        width: size,
        height: size,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        background: colour,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        x: dx,
        y: dy + randomBetween(40, 120),
        opacity: 0,
        rotate: rotate,
        scale: randomBetween(0.3, 0.8),
      }}
      transition={{ duration: randomBetween(0.8, 1.4), ease: [0.2, 0.8, 0.6, 1] }}
    />
  )
}

export default function WinCelebration({ active, originRef }) {
  const particles = useRef([])

  if (active && particles.current.length === 0) {
    particles.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => i)
  }
  if (!active) {
    particles.current = []
  }

  if (!active) return null

  const rect = originRef?.current?.getBoundingClientRect?.()
  const originX = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2
  const originY = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2

  return (
    <>
      {particles.current.map(i => (
        <Particle key={i} originX={originX} originY={originY} />
      ))}
    </>
  )
}
