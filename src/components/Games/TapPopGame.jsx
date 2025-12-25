import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { playPopSound, playWinSound } from '../../utils/sounds'

const COLORS = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#FF1493', '#00CED1']

export default function TapPopGame({ onBack }) {
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [taps, setTaps] = useState(0)
  const [balloons, setBalloons] = useState([])
  const [gameOver, setGameOver] = useState(false)

  // Start game
  const startGame = () => {
    setGameActive(true)
    setTimeLeft(30)
    setTaps(0)
    setGameOver(false)
    setBalloons([])
    spawnBalloon()
  }

  // Spawn balloons
  const spawnBalloon = () => {
    const newBalloon = {
      id: Math.random(),
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 200),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 30 + 40,
    }
    setBalloons(prev => [...prev, newBalloon])
  }

  // Pop balloon
  const popBalloon = async (id) => {
    setBalloons(prev => prev.filter(b => b.id !== id))
    setTaps(prev => prev + 1)
    await playPopSound()
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: Math.random(), y: Math.random() }
    })
    if (Math.random() > 0.7) spawnBalloon()
  }

  // Game timer
  useEffect(() => {
    if (!gameActive || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false)
          setGameOver(true)
          playWinSound()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive, gameOver])

  // Spawn balloons continuously
  useEffect(() => {
    if (!gameActive || gameOver) return

    const interval = setInterval(() => {
      setBalloons(prev => prev.length < 8 ? [...prev, {
        id: Math.random(),
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 200),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 30 + 40,
      }] : prev)
    }, 500)

    return () => clearInterval(interval)
  }, [gameActive, gameOver])

  if (!gameActive && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-pink-400 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-red-400">
          <h1 className="text-5xl md:text-6xl font-black text-red-600 mb-4">
            🎈 TAP POP 🎈
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-8">
            Pop as many balloons as you can in 30 seconds!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-red-600 shadow-lg"
          >
            🎈 START! 🎈
          </button>
          <p className="text-lg font-bold text-purple-600 mt-6">
            Tap the balloons to pop them! The faster the better!
          </p>
        </div>
      </div>
    )
  }

  if (gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-300 to-yellow-300 p-4 overflow-hidden">
        {/* Score and Time */}
        <div className="fixed top-24 left-4 right-4 flex justify-around z-10">
          <div className="bg-white rounded-2xl px-6 py-4 text-2xl md:text-3xl font-black border-4 border-red-500 shadow-lg">
            🎈 {taps}
          </div>
          <div className={`bg-white rounded-2xl px-6 py-4 text-2xl md:text-3xl font-black border-4 shadow-lg ${timeLeft < 10 ? 'border-red-600 bg-red-100' : 'border-blue-500'}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>

        {/* Balloons */}
        <div className="relative w-full h-screen">
          {balloons.map((balloon) => (
            <button
              key={balloon.id}
              onClick={() => popBalloon(balloon.id)}
              className="absolute rounded-full cursor-pointer hover:scale-125 active:scale-75 transition-all shadow-lg border-4 border-white transform hover:shadow-2xl"
              style={{
                left: balloon.x,
                top: balloon.y,
                width: balloon.size,
                height: balloon.size,
                backgroundColor: balloon.color,
              }}
            >
              <div className="text-2xl">🎈</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Game Over
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-400 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border-8 border-yellow-400">
        <h1 className="text-5xl md:text-6xl font-black text-yellow-500 mb-4 animate-bounce">
          🎉 GAME OVER! 🎉
        </h1>
        <p className="text-4xl md:text-5xl font-black text-purple-600 mb-2">
          {taps} BALLOONS!
        </p>
        <p className="text-2xl font-bold text-blue-600 mb-8">
          {taps > 50 ? '⭐⭐⭐ AMAZING!' : taps > 30 ? '⭐⭐ GREAT!' : '⭐ GOOD JOB!'}
        </p>
        <div className="space-y-4">
          <button
            onClick={startGame}
            className="w-full px-8 py-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-3xl font-black rounded-2xl hover:scale-110 active:scale-95 transition-all border-4 border-red-600 shadow-lg"
          >
            🎈 PLAY AGAIN! 🎈
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
