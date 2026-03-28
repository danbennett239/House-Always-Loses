import { AnimatePresence, motion } from 'framer-motion'
import './ResultMessage.css'

export default function ResultMessage({ lastResult, spinning }) {
  if (spinning || !lastResult) return <div className="result-placeholder" />

  const { win, gross, net, isLDW, nearMiss } = lastResult

  // Suppress result line for plain near-miss losses — the callout handles it
  if (!win && nearMiss) return <div className="result-placeholder" />

  let label, className
  if (isLDW) {
    label = `WIN  +£${gross.toFixed(2)}`
    className = 'result-ldw'
  } else if (win) {
    label = `WIN  +£${gross.toFixed(2)}`
    className = 'result-win'
  } else {
    label = `£${Math.abs(net).toFixed(2)} lost`
    className = 'result-loss'
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={label}
        className={`result-message ${className}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.div>
    </AnimatePresence>
  )
}
