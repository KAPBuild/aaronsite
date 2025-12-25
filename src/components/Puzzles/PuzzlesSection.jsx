import React, { useState } from 'react'
import PacManGame from './PacManGame'
import SlidingPuzzle from './SlidingPuzzle'

export default function PuzzlesSection() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null)

  if (selectedPuzzle) {
    return (
      <>
        {selectedPuzzle === 'pacman' && <PacManGame onBack={() => setSelectedPuzzle(null)} />}
        {selectedPuzzle === 'sliding' && <SlidingPuzzle onBack={() => setSelectedPuzzle(null)} />}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
            🧩 Puzzles & Brain Games
          </h1>
          <p className="text-lg text-cyan-300">
            Choose a puzzle to solve!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PuzzleCard
            emoji="👾"
            title="Pac-Man"
            description="Classic arcade game - eat the dots, avoid ghosts!"
            onClick={() => setSelectedPuzzle('pacman')}
          />
          <PuzzleCard
            emoji="🔢"
            title="Sliding Puzzle"
            description="Arrange the numbers in order"
            onClick={() => setSelectedPuzzle('sliding')}
          />
        </div>

        <div className="text-center bg-slate-800 rounded-lg p-6 border border-purple-500">
          <p className="text-cyan-300 font-semibold mb-2">
            More puzzles coming soon! 🚀
          </p>
          <p className="text-sm text-slate-400">
            Sudoku, maze games, and more challenging puzzles
          </p>
        </div>
      </div>
    </div>
  )
}

function PuzzleCard({ emoji, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl p-8 text-white hover:shadow-2xl hover:scale-105 transition-all border border-purple-500 hover:border-cyan-400 text-left"
    >
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-slate-300">{description}</p>
      <div className="mt-6 inline-block bg-cyan-600 px-6 py-2 rounded-lg font-semibold hover:bg-cyan-500">
        Play Now →
      </div>
    </button>
  )
}
