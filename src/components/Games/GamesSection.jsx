import React, { useState } from 'react'
import TapPopGame from './TapPopGame'
import ColorMatchGame from './ColorMatchGame'
import ShapeHuntGame from './ShapeHuntGame'
import PatternGameGame from './PatternGame'
import BubblePopGame from './BubblePopGame'

export default function GamesSection() {
  const [selectedGame, setSelectedGame] = useState(null)

  if (selectedGame) {
    return (
      <>
        {selectedGame === 'tappop' && <TapPopGame onBack={() => setSelectedGame(null)} />}
        {selectedGame === 'colormatch' && <ColorMatchGame onBack={() => setSelectedGame(null)} />}
        {selectedGame === 'shapehunt' && <ShapeHuntGame onBack={() => setSelectedGame(null)} />}
        {selectedGame === 'pattern' && <PatternGameGame onBack={() => setSelectedGame(null)} />}
        {selectedGame === 'bubblepop' && <BubblePopGame onBack={() => setSelectedGame(null)} />}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-blue-300 to-purple-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-4 animate-bounce">
            🎮 GAMES & FUN! 🎮
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white drop-shadow">
            Pick a game and HAVE FUN! 🎉
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <GameButton
            emoji="🎈"
            title="TAP POP"
            description="Pop balloons as fast as you can!"
            onClick={() => setSelectedGame('tappop')}
            bgColor="from-red-400 to-pink-400"
          />
          <GameButton
            emoji="🌈"
            title="COLOR MATCH"
            description="Match the colors!"
            onClick={() => setSelectedGame('colormatch')}
            bgColor="from-yellow-400 to-blue-400"
          />
          <GameButton
            emoji="🔷"
            title="SHAPE HUNT"
            description="Find the shapes!"
            onClick={() => setSelectedGame('shapehunt')}
            bgColor="from-purple-400 to-pink-400"
          />
          <GameButton
            emoji="🎨"
            title="PATTERN"
            description="Copy the pattern!"
            onClick={() => setSelectedGame('pattern')}
            bgColor="from-green-400 to-blue-400"
          />
          <GameButton
            emoji="🫧"
            title="BUBBLE POP"
            description="Pop all the bubbles!"
            onClick={() => setSelectedGame('bubblepop')}
            bgColor="from-cyan-400 to-purple-400"
          />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border-8 border-yellow-300 shadow-2xl text-center">
          <p className="text-2xl md:text-3xl font-black text-blue-600">
            ⭐ PLAY GAMES AND HAVE FUN! ⭐
          </p>
          <p className="text-xl font-bold text-purple-600 mt-4">
            Every game is super fun and you might win amazing prizes! 🏆
          </p>
        </div>
      </div>
    </div>
  )
}

function GameButton({ emoji, title, description, onClick, bgColor }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${bgColor} rounded-3xl shadow-2xl p-8 text-white hover:shadow-4xl hover:scale-110 transition-all duration-300 border-4 border-white active:scale-95 transform`}
    >
      <div className="text-6xl md:text-7xl mb-4">{emoji}</div>
      <h3 className="text-2xl md:text-3xl font-black mb-2">{title}</h3>
      <p className="text-lg md:text-xl font-bold">{description}</p>
      <div className="text-xl mt-4 font-bold">👇 TAP ME! 👇</div>
    </button>
  )
}
