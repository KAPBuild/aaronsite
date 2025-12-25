import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { playPopSound, playWinSound, playClickSound } from '../../utils/sounds'

const COLORS = ['#FF0000', '#0000FF', '#FFFF00', '#00FF00']

export default function PatternGame({ onBack }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [pattern, setPattern] = useState([])
  const [userPattern, setUserPattern] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(0)
  const [message, setMessage] = useState('')

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setLevel(0)
    setPattern([])
    setUserPattern([])
    setMessage('Watch the pattern!')
    addToPattern([])
  }

  const addToPattern = (currentPattern) => {
    const newPattern = [...currentPattern, Math.floor(Math.random() * 4)]
    setPattern(newPattern)
    setLevel(newPattern.length)
    setUserPattern([])
    setTimeout(() => playPattern(newPattern), 500)
  }

  const playPattern = async (pat) => {
    for (let i = 0; i < pat.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      await playPopSound()
      const btn = document.getElementById(`btn-${pat[i]}`)
      if (btn) btn.style.transform = 'scale(0.9)'
      await new Promise(resolve => setTimeout(resolve, 300))
      if (btn) btn.style.transform = 'scale(1)'
    }
    setMessage('Your turn!')
  }

  const handleButtonClick = async (index) => {
    await playClickSound()
    const newUserPattern = [...userPattern, index]
    setUserPattern(newUserPattern)

    if (newUserPattern[newUserPattern.length - 1] !== pattern[newUserPattern.length - 1]) {
      setMessage('❌ Wrong! Game Over!')
      setGameStarted(false)
      setGameOver(true)
      return
    }

    if (newUserPattern.length === pattern.length) {
      setMessage('✅ Correct! Next level!')
      confetti({ particleCount: 50, spread: 60 })
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (level >= 5) {
        setGameStarted(false)
        setGameOver(true)
        await playWinSound()
      } else {
        addToPattern(pattern)
      }
    }
  }

  if (!gameStarted && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-400 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-green-400">
          <h1 className="text-5xl md:text-6xl font-black text-green-600 mb-4">🎨 PATTERN 🎨</h1>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-8">Remember the pattern and copy it!</p>
          <button
            onClick={startGame}
            className="px-8 py-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-green-600 shadow-lg"
          >
            🎨 START! 🎨
          </button>
        </div>
      </div>
    )
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-300 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl px-6 py-4 text-3xl font-black border-4 border-green-400 shadow-lg inline-block mb-6">
              Level {level}
            </div>
            <p className="text-2xl font-black text-white drop-shadow-lg">{message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {COLORS.map((color, index) => (
              <button
                key={index}
                id={`btn-${index}`}
                onClick={() => handleButtonClick(index)}
                className="py-16 md:py-20 rounded-3xl border-4 border-white shadow-lg hover:scale-105 active:scale-90 transition-all"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-400 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-yellow-400">
        <h1 className="text-5xl md:text-6xl font-black text-yellow-500 mb-4 animate-bounce">🎉 LEVEL {level}! 🎉</h1>
        <p className="text-2xl font-bold text-blue-600 mb-8">{level >= 5 ? '⭐ YOU WON! ⭐' : 'GAME OVER!'}</p>
        <div className="space-y-4 mt-8">
          <button
            onClick={startGame}
            className="w-full px-8 py-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-green-600 shadow-lg"
          >
            🎨 PLAY AGAIN! 🎨
          </button>
          <button
            onClick={onBack}
            className="w-full px-8 py-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-2xl font-black rounded-2xl hover:scale-105 active:scale-95 transition-all border-4 border-gray-700 shadow-lg"
          >
            🎮 Back to Games
          </button>
        </div>
      </div>
    </div>
  )
}
