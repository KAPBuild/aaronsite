import React, { useState, useEffect } from 'react'

export default function HotWheelsGallery() {
  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('aaronHotWheels')
    return saved ? JSON.parse(saved) : []
  })
  const [carName, setCarName] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    localStorage.setItem('aaronHotWheels', JSON.stringify(gallery))
  }, [gallery])

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files.length === 0 || !carName.trim()) {
      alert('Please enter a car name!')
      return
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newCar = {
          id: Date.now() + Math.random(),
          name: carName,
          image: event.target.result,
        }
        setGallery([newCar, ...gallery])
        setCarName('')
        setShowForm(false)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeCar = (id) => {
    setGallery(gallery.filter(car => car.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-yellow-300 to-red-400 p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg mb-2 md:mb-4">
            🏎️ HOT WHEELS! 🏎️
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow">
            You have {gallery.length} car{gallery.length !== 1 ? 's' : ''}! 🚗
          </p>
        </div>

        {/* Add Car */}
        <div className="mb-6 md:mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm md:text-base font-bold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              ➕ Add Car
            </button>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-2 border-orange-300">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-black text-orange-600">📸 Add Your Car!</h2>

                <div>
                  <label className="block text-sm md:text-base font-bold text-gray-700 mb-2">Car Name:</label>
                  <input
                    type="text"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                    placeholder="e.g., Red Speed Demon"
                    className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm md:text-base font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base font-bold text-gray-700 mb-2">📷 Upload Photo:</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg bg-yellow-50 font-medium text-sm"
                  />
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm rounded-lg shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border-4 md:border-8 border-orange-400">
          <h2 className="text-2xl md:text-3xl font-black text-orange-600 mb-4 md:mb-6">🏆 MY COLLECTION ({gallery.length})</h2>

          {gallery.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-xl md:text-2xl font-bold text-gray-500 mb-3 md:mb-4">No cars yet! 🏎️</p>
              <p className="text-base md:text-lg text-gray-600">Add your first Hot Wheels car above! 📸</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {gallery.map((car) => (
                <div
                  key={car.id}
                  className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 md:border-4 border-orange-300 hover:scale-105"
                >
                  <div className="relative bg-gray-200 aspect-[4/3] flex items-center justify-center overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>

                  <div className="p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-black text-orange-700 mb-2 md:mb-3 truncate" title={car.name}>
                      {car.name}
                    </h3>
                    <button
                      onClick={() => removeCar(car.id)}
                      className="w-full py-2 rounded-lg font-black text-xs md:text-sm text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
