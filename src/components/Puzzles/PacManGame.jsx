import React, { useState, useEffect, useRef } from 'react'

export default function PacManGame({ onBack }) {
  const canvasRef = useRef(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const gameStateRef = useRef({
    pacman: { x: 10, y: 10, dir: 'right' },
    ghosts: [
      { x: 1, y: 1, color: '#FF0000' },
      { x: 18, y: 1, color: '#FFC0CB' },
      { x: 1, y: 18, color: '#00FFFF' },
      { x: 18, y: 18, color: '#FFB347' }
    ],
    dots: [],
    score: 0,
    nextDir: 'right'
  })

  const COLS = 20
  const ROWS = 20
  const CELL_SIZE = 20

  // Initialize dots
  useEffect(() => {
    const dots = []
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (Math.random() > 0.15) {
          dots.push({ x: i, y: j })
        }
      }
    }
    gameStateRef.current.dots = dots
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const interval = setInterval(() => {
      const state = gameStateRef.current

      // Update Pac-Man direction
      state.pacman.dir = state.nextDir

      // Move Pac-Man
      const newX = state.pacman.x + (state.pacman.dir === 'right' ? 1 : state.pacman.dir === 'left' ? -1 : 0)
      const newY = state.pacman.y + (state.pacman.dir === 'down' ? 1 : state.pacman.dir === 'up' ? -1 : 0)

      if (newX >= 0 && newX < COLS && newY >= 0 && newY < ROWS) {
        state.pacman.x = newX
        state.pacman.y = newY
      }

      // Check for dot collision
      state.dots = state.dots.filter(dot => {
        if (dot.x === state.pacman.x && dot.y === state.pacman.y) {
          state.score += 10
          setScore(state.score)
          return false
        }
        return true
      })

      // Move ghosts randomly
      state.ghosts.forEach(ghost => {
        const dirs = ['up', 'down', 'left', 'right']
        const dir = dirs[Math.floor(Math.random() * dirs.length)]
        const dx = dir === 'right' ? 1 : dir === 'left' ? -1 : 0
        const dy = dir === 'down' ? 1 : dir === 'up' ? -1 : 0

        const gx = ghost.x + dx
        const gy = ghost.y + dy

        if (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) {
          ghost.x = gx
          ghost.y = gy
        }

        // Ghost collision (game over)
        if (ghost.x === state.pacman.x && ghost.y === state.pacman.y) {
          setGameOver(true)
          setGameStarted(false)
        }
      })

      // Win condition
      if (state.dots.length === 0) {
        setGameOver(true)
        setGameStarted(false)
      }

      // Draw
      draw(state)
    }, 200)

    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  // Draw function
  const draw = (state) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1F2937'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, ROWS * CELL_SIZE)
      ctx.stroke()
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(COLS * CELL_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw dots
    ctx.fillStyle = '#FBBF24'
    state.dots.forEach(dot => {
      ctx.fillRect(dot.x * CELL_SIZE + 8, dot.y * CELL_SIZE + 8, 4, 4)
    })

    // Draw Pac-Man
    ctx.fillStyle = '#FCD34D'
    ctx.beginPath()
    ctx.arc(state.pacman.x * CELL_SIZE + CELL_SIZE / 2, state.pacman.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw ghosts
    state.ghosts.forEach(ghost => {
      ctx.fillStyle = ghost.color
      ctx.fillRect(ghost.x * CELL_SIZE + 2, ghost.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4)
    })
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') gameStateRef.current.nextDir = 'up'
      if (e.key === 'ArrowDown') gameStateRef.current.nextDir = 'down'
      if (e.key === 'ArrowLeft') gameStateRef.current.nextDir = 'left'
      if (e.key === 'ArrowRight') gameStateRef.current.nextDir = 'right'
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!gameStarted && !gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border border-cyan-500">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            👾 PAC-MAN 👾
          </h1>
          <p className="text-xl text-cyan-300 mb-8">
            Eat all the dots and avoid the ghosts!
          </p>
          <p className="text-gray-300 mb-8">Use arrow keys to move</p>
          <button
            onClick={() => {
              setGameStarted(true)
              setGameOver(false)
              setScore(0)
              gameStateRef.current.pacman = { x: 10, y: 10, dir: 'right' }
            }}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all"
          >
            Start Game!
          </button>
        </div>
      </div>
    )
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8 border border-cyan-500">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-white">Score: {score}</h2>
            <p className="text-cyan-300">Use arrow keys to move</p>
          </div>
          <canvas
            ref={canvasRef}
            width={COLS * CELL_SIZE}
            height={ROWS * CELL_SIZE}
            className="border-2 border-cyan-500 mx-auto"
          />
          <div className="text-center mt-4 text-gray-300">
            {gameStateRef.current.dots.length > 0 && `Dots left: ${gameStateRef.current.dots.length}`}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border border-cyan-500">
        <h1 className="text-5xl font-bold text-white mb-4">
          {score > 300 ? '🎉 YOU WIN! 🎉' : '💀 GAME OVER! 💀'}
        </h1>
        <p className="text-3xl font-bold text-cyan-400 mb-8">Score: {score}</p>
        <div className="space-y-4">
          <button
            onClick={() => {
              setGameStarted(true)
              setGameOver(false)
              setScore(0)
              gameStateRef.current.pacman = { x: 10, y: 10, dir: 'right' }
              const dots = []
              for (let i = 0; i < COLS; i++) {
                for (let j = 0; j < ROWS; j++) {
                  if (Math.random() > 0.15) {
                    dots.push({ x: i, y: j })
                  }
                }
              }
              gameStateRef.current.dots = dots
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg text-lg"
          >
            Play Again
          </button>
          <button
            onClick={onBack}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg text-lg"
          >
            Back to Puzzles
          </button>
        </div>
      </div>
    </div>
  )
}
