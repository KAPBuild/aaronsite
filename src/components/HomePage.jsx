import React, { useState, useEffect } from 'react'
import SimpleDrawingCanvas from './SimpleDrawingCanvas'

export default function HomePage() {
  const [showGreeting, setShowGreeting] = useState(() => {
    // Only show greeting once per session
    const shown = sessionStorage.getItem('greetingShown')
    return !shown
  })

  useEffect(() => {
    if (showGreeting) {
      sessionStorage.setItem('greetingShown', 'true')
      const timer = setTimeout(() => setShowGreeting(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [showGreeting])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-4">
      {/* Welcome message */}
      {showGreeting && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 md:p-12 text-center max-w-2xl mx-4 shadow-2xl border-2 border-cyan-400 relative">
            <button
              onClick={() => setShowGreeting(false)}
              className="absolute top-4 right-4 text-white text-3xl hover:scale-110 transition-transform font-bold"
              aria-label="Close"
            >
              ✕
            </button>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
              Welcome, Aaron! 🎮
            </h1>
            <p className="text-2xl font-bold text-cyan-300 mb-6">
              Merry Christmas from Uncle Nick 🎄
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8 pt-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Aaron's Gaming Lab
          </h2>
          <p className="text-lg text-cyan-300">
            Games, Puzzles, and Creative Fun
          </p>
        </div>

        {/* Canvas Section */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8 mb-8 border border-cyan-500">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
            Draw & Create
          </h3>
          <SimpleDrawingCanvas />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <FeatureCard emoji="🎮" title="Games" description="Pac-Man, Flappy Bird, more" />
          <FeatureCard emoji="🧩" title="Puzzles" description="Sudoku, Sliding Puzzle" />
          <FeatureCard emoji="🔴" title="Pokemon" description="Collect them all" />
          <FeatureCard emoji="🏎️" title="Hot Wheels" description="Showcase your cars" />
          <FeatureCard emoji="🎨" title="Draw" description="Create art above" />
          <FeatureCard emoji="⭐" title="More Coming" description="Stay tuned!" />
        </div>

        {/* Info */}
        <div className="text-center bg-slate-800 rounded-xl p-6 border border-cyan-500">
          <p className="text-cyan-300 font-semibold">
            Explore the games at the top - hours of fun await! 🚀
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ emoji, title, description }) {
  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 text-center border border-purple-500 hover:border-cyan-400 hover:shadow-lg transition-all">
      <div className="text-3xl mb-2">{emoji}</div>
      <h4 className="font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-cyan-300">{description}</p>
    </div>
  )
}
