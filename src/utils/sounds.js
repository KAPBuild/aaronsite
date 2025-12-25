import * as Tone from 'tone'

// Initialize Tone.js
let isInitialized = false
const masterVolume = new Tone.Gain(0.1) // Very quiet - 10% volume
masterVolume.connect(Tone.Destination)

const initAudio = async () => {
  if (!isInitialized) {
    await Tone.start()
    isInitialized = true
  }
}

// Pop sound (quiet, subtle)
export const playPopSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.08, sustain: 0, release: 0.05 },
    }).connect(masterVolume)

    synth.triggerAttackRelease('A4', '0.08')
  } catch (e) {
    // Silently fail if audio fails
  }
}

// Success/Win sound
export const playWinSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.08 },
    }).connect(masterVolume)

    synth.triggerAttackRelease(['G4', 'C5'], '0.15')
  } catch (e) {}
}

// Ding sound (achievement)
export const playDingSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
    }).connect(masterVolume)

    synth.triggerAttackRelease('E5', '0.15')
  } catch (e) {}
}

// Error/Wrong sound (very subtle)
export const playErrorSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 },
    }).connect(masterVolume)

    synth.triggerAttackRelease('D3', '0.1')
  } catch (e) {}
}

// Click sound (button press) - very quiet
export const playClickSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.005, decay: 0.03, sustain: 0, release: 0.02 },
    }).connect(masterVolume)

    synth.triggerAttackRelease('B4', '0.03')
  } catch (e) {}
}

// Whoosh sound (movement)
export const playWhooshSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 },
    }).connect(masterVolume)

    synth.triggerAttackRelease('F4', '0.1')
  } catch (e) {}
}

// Bell sound (subtle)
export const playBellSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
    }).connect(masterVolume)

    synth.triggerAttackRelease('G5', '0.2')
  } catch (e) {}
}

// Leveling up sound
export const playLevelUpSound = async () => {
  try {
    await initAudio()
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 },
    }).connect(masterVolume)

    synth.triggerAttackRelease(['C4', 'E4', 'G4'], '0.1')
  } catch (e) {}
}
