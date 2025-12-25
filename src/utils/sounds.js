import * as Tone from 'tone'

// Initialize Tone.js
let isInitialized = false

const initAudio = async () => {
  if (!isInitialized) {
    await Tone.start()
    isInitialized = true
  }
}

// Pop sound (satisfying bubble pop)
export const playPopSound = async () => {
  await initAudio()
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
  }).toDestination()

  synth.triggerAttackRelease('C4', '0.1')
}

// Success/Win sound
export const playWinSound = async () => {
  await initAudio()
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 },
  }).toDestination()

  synth.triggerAttackRelease(['G4', 'B4', 'D5'], '0.2')
}

// Ding sound (achievement)
export const playDingSound = async () => {
  await initAudio()
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 },
  }).toDestination()

  synth.triggerAttackRelease('E5', '0.3')
}

// Error/Wrong sound (gentle, not harsh)
export const playErrorSound = async () => {
  await initAudio()
  const synth = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
  }).toDestination()

  synth.triggerAttackRelease('C3', '0.15')
}

// Click sound (button press)
export const playClickSound = async () => {
  await initAudio()
  const synth = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.003, decay: 0.05, sustain: 0, release: 0.03 },
  }).toDestination()

  synth.triggerAttackRelease('A4', '0.05')
}

// Whoosh sound (movement)
export const playWhooshSound = async () => {
  await initAudio()
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
  }).toDestination()

  synth.triggerAttackRelease('F4', '0.2')
}

// Bell sound (cheerful)
export const playBellSound = async () => {
  await initAudio()
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 },
  }).toDestination()

  synth.triggerAttackRelease(['G5', 'D6'], '0.3')
}

// Leveling up sound
export const playLevelUpSound = async () => {
  await initAudio()
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
  }).toDestination()

  synth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '0.15')
}
