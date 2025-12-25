import React from 'react'

export default function Navigation({ currentPage, setCurrentPage }) {
  const navItems = [
    { id: 'home', emoji: '🏠', label: 'Home' },
    { id: 'games', emoji: '🎮', label: 'Games' },
    { id: 'puzzles', emoji: '🧩', label: 'Puzzles' },
    { id: 'pokemon', emoji: '🔴', label: 'Pokemon' },
    { id: 'hotwheels', emoji: '🏎️', label: 'Hot Wheels' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-blue-900 shadow-2xl z-50 border-b border-cyan-500">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="text-3xl hover:scale-110 transition-transform drop-shadow-lg"
          >
            🎮
          </button>

          {/* Nav Items */}
          <div className="flex gap-2 justify-center flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg transition-all text-sm md:text-base font-semibold ${
                  currentPage === item.id
                    ? 'bg-cyan-500 text-slate-900 shadow-lg'
                    : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                }`}
                title={item.label}
              >
                <span className="inline md:hidden">{item.emoji}</span>
                <span className="hidden md:inline">{item.emoji} {item.label}</span>
              </button>
            ))}
          </div>

          <div className="w-12"></div>
        </div>
      </div>
    </nav>
  )
}
