import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const COLOURS = ['#ffd700', '#f0c040', '#ff6b6b', '#4ecdc4', '#a8e6cf', '#ffffff', '#ff9f43']
const PARTICLE_COUNT = 36

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function buildParticleConfigs(originX, originY) {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle  = randomBetween(0, Math.PI * 2)
    const speed  = randomBetween(120, 260)
    return {
      id:       i,
      originX,
      originY,
      dx:       Math.cos(angle) * speed,
      dy:       Math.sin(angle) * speed - randomBetween(60, 140) + randomBetween(40, 120),
      colour:   COLOURS[Math.floor(Math.random() * COLOURS.length)],
      size:     randomBetween(6, 12),
      round:    Math.random() > 0.5,
      rotate:   randomBetween(0, 360),
      scale:    randomBetween(0.3, 0.8),
      duration: randomBetween(0.8, 1.4),
    }
  })
}

function Particle({ cfg }) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        left: cfg.originX,
        top: cfg.originY,
        width: cfg.size,
        height: cfg.size,
        borderRadius: cfg.round ? '50%' : '2px',
        background: cfg.colour,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ x: cfg.dx, y: cfg.dy, opacity: 0, rotate: cfg.rotate, scale: cfg.scale }}
      transition={{ duration: cfg.duration, ease: [0.2, 0.8, 0.6, 1] }}
    />
  )
}

export default function WinCelebration({ active, originRef }) {
  const [configs, setConfigs] = useState([])

  useEffect(() => {
    if (!active) {
      setConfigs([])
      return
    }
    const rect = originRef?.current?.getBoundingClientRect?.()
    const originX = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2
    const originY = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2
    setConfigs(buildParticleConfigs(originX, originY))
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!active || configs.length === 0) return null

  return (
    <>
      {configs.map(cfg => <Particle key={cfg.id} cfg={cfg} />)}
    </>
  )
}
