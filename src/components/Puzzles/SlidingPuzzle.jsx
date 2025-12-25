import React, { useState, useEffect } from 'react'

export default function SlidingPuzzle({ onBack }) {
  const [gameStarted, setGameStarted] = useState(false)
  const [tiles, setTiles] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize puzzle
  const initializePuzzle = () => {
    const initialTiles = Array.from({ length: 15 }, (_, i) => i + 1)
    initialTiles.push(null) // null represents empty space

    // Shuffle tiles
    for (let i = 0; i < 100; i++) {
      const emptyIndex = initialTiles.indexOf(null)
      const validMoves = getValidMoves(emptyIndex, initialTiles)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      [initialTiles[emptyIndex], initialTiles[randomMove]] = [initialTiles[randomMove], initialTiles[emptyIndex]]
    }

    setTiles(initialTiles)
    setMoves(0)
    setGameWon(false)
    setGameStarted(true)
  }

  // Get valid moves (tiles that can slide into empty space)
  const getValidMoves = (emptyIndex, currentTiles = tiles) => {
    const moves = []
    const row = Math.floor(emptyIndex / 4)
    const col = emptyIndex % 4

    if (row > 0) moves.push(emptyIndex - 4) // Up
    if (row < 3) moves.push(emptyIndex + 4) // Down
    if (col > 0) moves.push(emptyIndex - 1) // Left
    if (col < 3) moves.push(emptyIndex + 1) // Right

    return moves
  }

  // Handle tile click
  const handleTileClick = (index) => {
    if (!gameStarted || gameWon) return

    const emptyIndex = tiles.indexOf(null)
    const validMoves = getValidMoves(emptyIndex)

    if (validMoves.includes(index)) {
      const newTiles = [...tiles]
      ;[newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]]
      setTiles(newTiles)
      setMoves(moves + 1)

      // Check if solved
      if (isSolved(newTiles)) {
        setGameWon(true)
      }
    }
  }

  // Check if puzzle is solved
  const isSolved = (currentTiles) => {
    for (let i = 0; i < 15; i++) {
      if (currentTiles[i] !== i + 1) return false
    }
    return currentTiles[15] === null
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border border-cyan-500">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🔢 SLIDING PUZZLE 🔢
          </h1>
          <p className="text-xl text-cyan-300 mb-8">
            Arrange the numbers from 1 to 15 in order!
          </p>
          <button
            onClick={initializePuzzle}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all"
          >
            Start Game!
          </button>
        </div>
      </div>
    )
  }

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8 md:p-12 text-center max-w-2xl border border-cyan-500">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎉 YOU SOLVED IT! 🎉
          </h1>
          <p className="text-3xl font-bold text-cyan-400 mb-2">Moves: {moves}</p>
          <p className="text-lg text-cyan-300 mb-8">
            {moves < 50 ? '⭐ Excellent!' : moves < 100 ? '👍 Great job!' : '💪 Good effort!'}
          </p>
          <div className="space-y-4">
            <button
              onClick={initializePuzzle}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Sliding Puzzle</h2>
          <p className="text-xl font-semibold text-cyan-400">Moves: {moves}</p>
        </div>

        {/* Puzzle Grid */}
        <div className="bg-slate-800 rounded-lg p-4 border border-cyan-500 shadow-2xl mb-6">
          <div className="grid grid-cols-4 gap-2">
            {tiles.map((tile, index) => (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                className={`aspect-square text-2xl font-bold rounded-lg transition-all ${
                  tile === null
                    ? 'bg-slate-700 cursor-default'
                    : 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white hover:from-cyan-500 hover:to-cyan-600 cursor-pointer hover:scale-110 active:scale-95 shadow-lg'
                }`}
              >
                {tile}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-cyan-300 font-semibold mb-4">
          Click tiles adjacent to the empty space to slide them
        </p>

        <button
          onClick={onBack}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg text-lg"
        >
          Back to Puzzles
        </button>
      </div>
    </div>
  )
}
