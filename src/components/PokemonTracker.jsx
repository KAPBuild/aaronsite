import React, { useState, useEffect } from 'react'

const POKEAPI_URL = 'https://pokeapi.co/api/v2'

export default function PokemonTracker() {
  const [collection, setCollection] = useState(() => {
    const saved = localStorage.getItem('aaronPokemonCollection')
    return saved ? JSON.parse(saved) : []
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('aaronPokemonCollection', JSON.stringify(collection))
  }, [collection])

  const searchPokemon = async (term) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${POKEAPI_URL}/pokemon?limit=1000`)
      const data = await response.json()

      const filtered = data.results
        .filter(p => p.name.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 6)

      const pokemonData = await Promise.all(
        filtered.map(async (p) => {
          const res = await fetch(p.url)
          return res.json()
        })
      )

      setSearchResults(pokemonData)
    } catch (error) {
      console.error('Error searching Pokemon:', error)
    }
    setLoading(false)
  }

  const addPokemon = (pokemon) => {
    if (!collection.some(p => p.id === pokemon.id)) {
      setCollection([...collection, {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        type: pokemon.types[0].type.name,
      }])
      setSearchResults([])
      setSearchTerm('')
    }
  }

  const removePokemon = (id) => {
    setCollection(collection.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-300 via-yellow-300 to-red-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-4 animate-bounce">
            🔴 POKEMON! 🔴
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-white drop-shadow">
            You have {collection.length} Pokemon! 🎉
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-8 border-red-400">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                searchPokemon(e.target.value)
              }}
              placeholder="Search Pokemon..."
              className="flex-1 px-4 py-3 border-4 border-red-300 rounded-xl focus:outline-none focus:border-red-500 text-xl font-bold"
            />
            <button
              onClick={() => searchPokemon(searchTerm)}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black text-xl rounded-xl border-4 border-red-600 shadow-lg"
            >
              🔍
            </button>
          </div>

          {loading && <p className="text-2xl font-black text-red-600">Loading... 🔄</p>}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => addPokemon(pokemon)}
                  className="bg-gradient-to-br from-yellow-100 to-red-100 rounded-2xl p-4 text-center border-4 border-yellow-400 hover:shadow-lg hover:scale-105 transition-all"
                >
                  <img
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-20 h-20 mx-auto mb-2"
                  />
                  <p className="font-black text-red-700 capitalize text-lg">{pokemon.name}</p>
                  <p className="text-sm text-red-600">#{pokemon.id}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Collection */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-8 border-red-400">
          <h2 className="text-3xl font-black text-red-600 mb-6">🎒 MY POKEMON ({collection.length})</h2>

          {collection.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl font-bold text-gray-500 mb-4">No Pokemon yet!</p>
              <p className="text-lg text-gray-600">Search above to add your first Pokemon! 🔍</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collection.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="bg-gradient-to-br from-yellow-100 to-red-100 rounded-2xl p-4 border-4 border-yellow-400 hover:shadow-lg transition-all text-center"
                >
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-full aspect-square object-contain mb-2"
                  />
                  <p className="font-black text-red-700 capitalize mb-1">{pokemon.name}</p>
                  <p className="text-xs text-gray-600 mb-2 capitalize">{pokemon.type}</p>
                  <button
                    onClick={() => removePokemon(pokemon.id)}
                    className="btn bg-red-500 w-full py-2 text-sm rounded-lg font-black text-white hover:bg-red-600"
                  >
                    🗑️ Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
