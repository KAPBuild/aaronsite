import React from 'react'

export default function EmulatorSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-4 animate-bounce">
            🕹️ RETRO GAMES! 🕹️
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white drop-shadow">
            Classic games are coming soon! 🚀
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl mx-auto border-8 border-purple-400 mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-purple-600 mb-6">
            🎮 EPIC GAMES ARE COMING! 🎮
          </h2>
          <p className="text-2xl font-bold text-blue-600 mb-8">
            We're setting up classic NES/SNES games like:
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <GameTease emoji="🔴" title="Super Mario" />
            <GameTease emoji="🗡️" title="Zelda" />
            <GameTease emoji="👻" title="Pac-Man" />
            <GameTease emoji="🟥" title="Tetris" />
          </div>
          <p className="text-xl font-bold text-purple-600">
            Check back soon to play these awesome retro games! 🎉
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GameCard emoji="🔴" title="Super Mario Bros" description="Jump, run, and save the princess!" />
          <GameCard emoji="🗡️" title="The Legend of Zelda" description="Explore the adventure and find treasures!" />
          <GameCard emoji="👻" title="Pac-Man" description="Eat the dots and avoid the ghosts!" />
          <GameCard emoji="🟥" title="Tetris" description="Stack the blocks and complete lines!" />
        </div>

        {/* Fun info */}
        <div className="mt-8 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-3xl p-6 md:p-8 border-4 border-white shadow-lg text-center">
          <p className="text-2xl md:text-3xl font-black text-purple-700">
            ⭐ These are CLASSIC games from the 1980s and 1990s! ⭐
          </p>
          <p className="text-lg font-bold text-blue-700 mt-4">
            They're super fun and challenging. You're going to LOVE them! 🎮
          </p>
        </div>
      </div>
    </div>
  )
}

function GameCard({ emoji, title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-purple-400 hover:shadow-3xl hover:scale-105 transition-all text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-2xl md:text-3xl font-black text-purple-600 mb-2">{title}</h3>
      <p className="text-lg font-bold text-gray-600">{description}</p>
      <div className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg text-sm">
        Coming Soon! 🚀
      </div>
    </div>
  )
}

function GameTease({ emoji, title }) {
  return (
    <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl p-4 border-4 border-purple-400">
      <div className="text-5xl mb-2">{emoji}</div>
      <p className="text-lg font-black text-purple-700">{title}</p>
    </div>
  )
}
