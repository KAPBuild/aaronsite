import React, { useState, useEffect } from 'react'
import SimpleDrawingCanvas from './SimpleDrawingCanvas'
import confetti from 'canvas-confetti'

export default function HomePage() {
  const [showGreeting, setShowGreeting] = useState(true)

  useEffect(() => {
    // Show greeting for 6 seconds
    const timer = setTimeout(() => setShowGreeting(false), 6000)

    // Trigger confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-blue-300 p-4">
      {/* Big colorful greeting */}
      {showGreeting && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-4 shadow-2xl border-8 border-yellow-400 animate-bounce">
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              Hello Aaron! 👋
            </h1>
            <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 mb-4">
              🎄 MERRY CHRISTMAS! 🎄
            </p>
            <p className="text-2xl font-bold text-purple-600 mb-6">
              From Uncle Nick ❤️
            </p>
            <div className="text-5xl animate-pulse space-x-4 flex justify-center">
              🎮 🎨 🔴 🏎️ 🕹️
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8 pt-4">
          <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-4 animate-bounce">
            🎨 Draw Something AWESOME!
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-white drop-shadow">
            Use the canvas below to create your masterpiece!
          </p>
        </div>

        {/* Main Drawing Canvas */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 mb-8 border-8 border-yellow-400">
          <SimpleDrawingCanvas />
        </div>

        {/* Fun features grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <FeatureBox emoji="🎮" title="Games" description="Tap to play!" />
          <FeatureBox emoji="🔴" title="Pokemon" description="Catch them!" />
          <FeatureBox emoji="🏎️" title="Hot Wheels" description="Show off!" />
          <FeatureBox emoji="🕹️" title="Old Games" description="Super fun!" />
          <FeatureBox emoji="🎨" title="Draw" description="Be creative!" />
          <FeatureBox emoji="⭐" title="Have Fun" description="Always!" />
        </div>

        {/* Bottom tip */}
        <div className="text-center bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-6 md:p-8 border-4 border-white shadow-lg">
          <p className="text-2xl md:text-3xl font-black text-white">
            Explore everything! Tap the buttons at the top! 👆
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureBox({ emoji, title, description }) {
  return (
    <div className="bg-gradient-to-br from-yellow-200 to-pink-200 rounded-2xl p-4 md:p-6 text-center border-4 border-white shadow-lg hover:shadow-2xl hover:scale-110 transition-all cursor-pointer">
      <div className="text-4xl md:text-5xl mb-2">{emoji}</div>
      <h4 className="text-lg md:text-xl font-black text-blue-700 mb-1">{title}</h4>
      <p className="text-sm md:text-base font-bold text-purple-600">{description}</p>
    </div>
  )
}
