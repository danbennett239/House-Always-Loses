// Synthesised slot machine audio using Web Audio API.
// No audio files — all sounds are generated procedurally.
// Demonstrates the sensory manipulation trick: wins are loud and celebratory,
// losses are near-silent.

import { useRef, useCallback } from 'react'

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!window._slotAudioCtx) {
    window._slotAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return window._slotAudioCtx
}

// Resume suspended context (browsers suspend until first user gesture)
function resume(ctx) {
  if (ctx.state === 'suspended') ctx.resume()
}

function playTone({ frequency, type = 'sine', gain = 0.15, duration = 0.12, start = 0, ctx }) {
  const osc  = ctx.createOscillator()
  const env  = ctx.createGain()
  osc.connect(env)
  env.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + start)
  env.gain.setValueAtTime(0, ctx.currentTime + start)
  env.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01)
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + duration + 0.01)
}

function playNoise({ gain = 0.04, duration = 0.08, start = 0, ctx }) {
  const bufSize = ctx.sampleRate * duration
  const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
  const data    = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
  const src  = ctx.createBufferSource()
  const env  = ctx.createGain()
  const filt = ctx.createBiquadFilter()
  src.buffer = buf
  filt.type  = 'bandpass'
  filt.frequency.value = 1200
  src.connect(filt)
  filt.connect(env)
  env.connect(ctx.destination)
  env.gain.setValueAtTime(gain, ctx.currentTime + start)
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
  src.start(ctx.currentTime + start)
  src.stop(ctx.currentTime + start + duration + 0.01)
}

export function useSlotAudio() {
  const reelIntervals = useRef([])

  // Spin start: mechanical whirr — rapid noise bursts
  const playSpinStart = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return; resume(ctx)
    playNoise({ gain: 0.06, duration: 0.06, start: 0,    ctx })
    playNoise({ gain: 0.05, duration: 0.06, start: 0.07, ctx })
    playNoise({ gain: 0.04, duration: 0.06, start: 0.14, ctx })
  }, [])

  // Reel spinning: repeating mechanical click tick
  const startReelTick = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return; resume(ctx)
    const id = setInterval(() => {
      playNoise({ gain: 0.025, duration: 0.03, start: 0, ctx })
    }, 120)
    reelIntervals.current.push(id)
  }, [])

  const stopReelTick = useCallback(() => {
    reelIntervals.current.forEach(clearInterval)
    reelIntervals.current = []
  }, [])

  // Reel stop: single satisfying thunk
  const playReelStop = useCallback((reelIndex) => {
    const ctx = getCtx(); if (!ctx) return; resume(ctx)
    playNoise({ gain: 0.08, duration: 0.05, start: 0, ctx })
    playTone({ frequency: 180 - reelIndex * 20, type: 'sine', gain: 0.06, duration: 0.08, start: 0, ctx })
  }, [])

  // Win: ascending celebratory arpeggio — loud, joyful
  const playWin = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return; resume(ctx)
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      playTone({ frequency: freq, type: 'triangle', gain: 0.22, duration: 0.18, start: i * 0.1, ctx })
    })
    // Add shimmer
    playTone({ frequency: 1568, type: 'sine', gain: 0.1, duration: 0.4, start: 0.3, ctx })
  }, [])

  // LDW: short upward jingle — sounds like a win but abruptly cut off
  const playLDW = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return; resume(ctx)
    playTone({ frequency: 523,  type: 'triangle', gain: 0.18, duration: 0.12, start: 0,    ctx })
    playTone({ frequency: 659,  type: 'triangle', gain: 0.18, duration: 0.12, start: 0.1,  ctx })
    // Deliberately cut — no resolution
  }, [])

  // Loss: near-silent soft thud — barely noticeable
  const playLoss = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return; resume(ctx)
    playNoise({ gain: 0.012, duration: 0.06, start: 0, ctx })
  }, [])

  return { playSpinStart, startReelTick, stopReelTick, playReelStop, playWin, playLDW, playLoss }
}
