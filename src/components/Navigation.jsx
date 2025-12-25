import React from 'react'

export default function Navigation({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'home', emoji: '🏠' },
    { id: 'games', emoji: '🎮' },
    { id: 'pokemon', emoji: '🔴' },
    { id: 'hotwheels', emoji: '🏎️' },
    { id: 'emulator', emoji: '🕹️' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 shadow-2xl z-50 border-b-8 border-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="text-5xl hover:scale-125 transition-transform active:scale-95 drop-shadow-lg"
          >
            🧪
          </button>

          {/* Nav Items - BIG BUTTONS FOR SMALL HANDS */}
          <div className="flex gap-4 justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-5xl p-3 rounded-2xl transition-all duration-200 transform hover:scale-120 active:scale-100 drop-shadow-lg ${
                  currentPage === item.id
                    ? 'bg-white scale-125 shadow-2xl border-4 border-yellow-300'
                    : 'hover:scale-110'
                }`}
              >
                {item.emoji}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="w-20"></div>
        </div>
      </div>
    </nav>
  )
}
