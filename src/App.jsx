import { useState } from 'react'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import GamesSection from './components/Games/GamesSection'
import PokemonTracker from './components/PokemonTracker'
import HotWheelsGallery from './components/HotWheelsGallery'
import EmulatorSection from './components/Emulator/EmulatorSection'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage />
      case 'games':
        return <GamesSection />
      case 'pokemon':
        return <PokemonTracker />
      case 'hotwheels':
        return <HotWheelsGallery />
      case 'emulator':
        return <EmulatorSection />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-24">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
