import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import { playPopSound, playWinSound } from '../../utils/sounds'

export default function ShapeHuntGame({ onBack }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [shapes, setShapes] = useState([])
  const [targetShape, setTargetShape] = useState('⭐')

  const SHAPES = ['⭐', '❤️', '🔵', '🟥', '🟨', '🟩']

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    generateShapes()
  }

  const generateShapes = () => {
    const target = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    setTargetShape(target)

    const newShapes = []
    for (let i = 0; i < 12; i++) {
      newShapes.push({
        id: Math.random(),
        shape: Math.random() > 0.3 ? target : SHAPES[Math.floor(Math.random() * SHAPES.length)],
        x: Math.random() * 80,
        y: Math.random() * 60,
      })
    }
    setShapes(newShapes.sort(() => Math.random() - 0.5))
  }

  const tapShape = async (id, shape) => {
    if (shape === targetShape) {
      await playPopSound()
      setScore(prev => prev + 1)
      confetti({ particleCount: 50, spread: 60 })

      if (score + 1 >= 5) {
        setGameStarted(false)
        setGameOver(true)
        await playWinSound()
      } else {
        setTimeout(generateShapes, 500)
      }
    }
  }

  if (!gameStarted && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-purple-400">
          <h1 className="text-5xl md:text-6xl font-black text-purple-600 mb-4">🔍 SHAPE HUNT 🔍</h1>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-8">Tap all the shapes that match!</p>
          <button
            onClick={startGame}
            className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-purple-600 shadow-lg"
          >
            🔍 START! 🔍
          </button>
        </div>
      </div>
    )
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 to-pink-300 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl px-6 py-4 text-3xl font-black border-4 border-purple-400 shadow-lg inline-block">
              Find: {targetShape} | Score: {score}/5
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border-4 border-purple-400 shadow-2xl">
            <div className="grid grid-cols-4 gap-4 h-96">
              {shapes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => tapShape(item.id, item.shape)}
                  className="text-6xl md:text-7xl hover:scale-125 active:scale-75 transition-all transform"
                >
                  {item.shape}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-400 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-yellow-400">
        <h1 className="text-5xl md:text-6xl font-black text-yellow-500 mb-4 animate-bounce">🎉 AWESOME! 🎉</h1>
        <p className="text-4xl md:text-5xl font-black text-purple-600 mb-2">YOU DID IT! 5/5!</p>
        <div className="space-y-4 mt-8">
          <button
            onClick={startGame}
            className="w-full px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-purple-600 shadow-lg"
          >
            🔍 PLAY AGAIN! 🔍
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
