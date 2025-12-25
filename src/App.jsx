import { useState } from 'react'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import GamesSection from './components/Games/GamesSection'
import PuzzlesSection from './components/Puzzles/PuzzlesSection'
import PokemonTracker from './components/PokemonTracker'
import HotWheelsGallery from './components/HotWheelsGallery'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage />
      case 'games':
        return <GamesSection />
      case 'puzzles':
        return <PuzzlesSection />
      case 'pokemon':
        return <PokemonTracker />
      case 'hotwheels':
        return <HotWheelsGallery />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-20">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
