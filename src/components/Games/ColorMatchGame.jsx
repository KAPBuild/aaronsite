import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { playPopSound, playWinSound } from '../../utils/sounds'

const COLORS = [
  { name: 'Red', code: '#FF0000' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Green', code: '#00FF00' },
  { name: 'Yellow', code: '#FFFF00' },
  { name: 'Purple', code: '#800080' },
  { name: 'Orange', code: '#FF8C00' },
]

export default function ColorMatchGame({ onBack }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [targetColor, setTargetColor] = useState(null)
  const [options, setOptions] = useState([])
  const [round, setRound] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')

  // Start game
  const startGame = () => {
    setGameStarted(true)
    setRound(1)
    setScore(0)
    setGameOver(false)
    newRound()
  }

  // New round
  const newRound = () => {
    const correctColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    setTargetColor(correctColor)

    const wrongColors = COLORS.filter(c => c.code !== correctColor.code)
    const shuffledOptions = [correctColor, ...wrongColors.sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5)
    setOptions(shuffledOptions)
    setMessage('')
  }

  // Handle color selection
  const selectColor = async (color) => {
    if (color.code === targetColor.code) {
      await playPopSound()
      setScore(prev => prev + 1)
      setMessage('✅ CORRECT!')
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })

      if (round < 5) {
        setTimeout(() => {
          setRound(prev => prev + 1)
          newRound()
        }, 1000)
      } else {
        setTimeout(async () => {
          setGameStarted(false)
          setGameOver(true)
          await playWinSound()
        }, 1000)
      }
    } else {
      setMessage('❌ Wrong! Try again!')
    }
  }

  if (!gameStarted && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-400 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-yellow-400">
          <h1 className="text-5xl md:text-6xl font-black text-yellow-600 mb-4">
            🌈 COLOR MATCH 🌈
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-8">
            Pick the color that matches!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-yellow-600 shadow-lg"
          >
            🌈 START! 🌈
          </button>
        </div>
      </div>
    )
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 to-purple-400 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Score */}
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl px-6 py-4 text-3xl md:text-4xl font-black border-4 border-yellow-400 shadow-lg inline-block mb-6">
              Round {round}/5 | Score: {score}⭐
            </div>
          </div>

          {/* Target Color */}
          <div className="text-center mb-8">
            <p className="text-2xl font-black text-white drop-shadow-lg mb-4">
              🎨 Match this color:
            </p>
            <div
              className="w-40 h-40 md:w-48 md:h-48 rounded-3xl shadow-2xl mx-auto border-8 border-white"
              style={{ backgroundColor: targetColor?.code }}
            ></div>
          </div>

          {/* Message */}
          {message && (
            <div className="text-center text-3xl font-black mb-8 bg-white rounded-2xl px-6 py-4 border-4">
              {message}
            </div>
          )}

          {/* Color Options */}
          <div className="space-y-4">
            {options.map((color) => (
              <button
                key={color.code}
                onClick={() => selectColor(color)}
                className={`w-full py-8 rounded-2xl text-2xl font-black hover:scale-105 active:scale-95 transition-all border-4 text-white shadow-lg`}
                style={{
                  backgroundColor: color.code,
                  borderColor: 'white',
                }}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Game Over
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-400 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-yellow-400">
        <h1 className="text-5xl md:text-6xl font-black text-yellow-500 mb-4 animate-bounce">
          🎉 AWESOME! 🎉
        </h1>
        <p className="text-4xl md:text-5xl font-black text-purple-600 mb-2">
          {score}/5 CORRECT!
        </p>
        <div className="space-y-4 mt-8">
          <button
            onClick={startGame}
            className="w-full px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-yellow-600 shadow-lg"
          >
            🌈 PLAY AGAIN! 🌈
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
