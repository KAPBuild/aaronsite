import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { playPopSound, playWinSound } from '../../utils/sounds'

export default function BubblePopGame({ onBack }) {
  const [gameActive, setGameActive] = useState(false)
  const [bubbles, setBubbles] = useState([])
  const [pops, setPops] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => {
    setGameActive(true)
    setGameOver(false)
    setPops(0)
    setBubbles(generateBubbles())

    setTimeout(() => {
      setGameActive(false)
      setGameOver(true)
      playWinSound()
    }, 20000) // 20 second game
  }

  const generateBubbles = () => {
    const newBubbles = []
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: Math.random(),
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 300),
        size: Math.random() * 40 + 40,
      })
    }
    return newBubbles
  }

  const popBubble = async (id) => {
    setBubbles(prev => prev.filter(b => b.id !== id))
    setPops(prev => prev + 1)
    await playPopSound()
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x: Math.random(), y: Math.random() }
    })

    // Add new bubble
    if (bubbles.length > 0) {
      setTimeout(() => {
        setBubbles(prev => [...prev, {
          id: Math.random(),
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 300),
          size: Math.random() * 40 + 40,
        }])
      }, 300)
    }
  }

  if (!gameActive && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-purple-400 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-cyan-400">
          <h1 className="text-5xl md:text-6xl font-black text-cyan-600 mb-4">🫧 BUBBLE POP 🫧</h1>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-8">Pop all the bubbles you can in 20 seconds!</p>
          <button
            onClick={startGame}
            className="px-8 py-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-cyan-600 shadow-lg"
          >
            🫧 START! 🫧
          </button>
        </div>
      </div>
    )
  }

  if (gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-300 p-4 overflow-hidden flex flex-col">
        <div className="text-center mb-4 mt-24">
          <div className="bg-white rounded-2xl px-6 py-4 text-2xl md:text-3xl font-black border-4 border-cyan-500 shadow-lg inline-block">
            🫧 {pops}
          </div>
        </div>

        <div className="relative flex-1">
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              className="absolute rounded-full cursor-pointer hover:scale-125 active:scale-75 transition-all shadow-lg border-4 border-white animate-pulse"
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
              }}
            >
              <div className="text-2xl flex items-center justify-center h-full">🫧</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-400 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-yellow-400">
        <h1 className="text-5xl md:text-6xl font-black text-yellow-500 mb-4 animate-bounce">🎉 GAME OVER! 🎉</h1>
        <p className="text-4xl md:text-5xl font-black text-purple-600 mb-2">{pops} BUBBLES!</p>
        <p className="text-2xl font-bold text-blue-600 mb-8">
          {pops > 80 ? '⭐⭐⭐ INCREDIBLE!' : pops > 50 ? '⭐⭐ AMAZING!' : '⭐ GREAT!'}
        </p>
        <div className="space-y-4 mt-8">
          <button
            onClick={startGame}
            className="w-full px-8 py-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-cyan-600 shadow-lg"
          >
            🫧 PLAY AGAIN! 🫧
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
