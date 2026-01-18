import React, { useState, useEffect } from 'react'
import { addHotWheelsCar, getHotWheelsCars, updateHotWheelsCar, deleteHotWheelsCar } from '../utils/storage'
import { playPopSound, playClickSound } from '../utils/sounds'

export default function HotWheelsGallery() {
  const [cars, setCars] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRarity, setFilterRarity] = useState('all')
  const [selectedCar, setSelectedCar] = useState(null)

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    year: '',
    rarity: 'Common',
    value: '',
    condition: 'Good',
    notes: '',
    photo_data: ''
  })

  // Load cars on mount
  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    setIsLoading(true)
    try {
      const { cars } = await getHotWheelsCars()
      setCars(cars)
    } catch (error) {
      console.error('Failed to load cars:', error)
      setCars([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData({ ...formData, photo_data: event.target.result })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Please enter a car name!')
      return
    }

    setIsLoading(true)

    try {
      if (editingCar) {
        await updateHotWheelsCar(editingCar.id, formData)
        await playPopSound()
      } else {
        await addHotWheelsCar(formData)
        await playPopSound()
      }

      resetForm()
      await loadCars()
    } catch (error) {
      console.error('Failed to save car:', error)
      alert('Failed to save car. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (car) => {
    setEditingCar(car)
    setFormData({
      name: car.name || '',
      color: car.color || '',
      year: car.year || '',
      rarity: car.rarity || 'Common',
      value: car.value || '',
      condition: car.condition || 'Good',
      notes: car.notes || '',
      photo_data: car.photo_data || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this car from your collection?')) return

    setIsLoading(true)

    try {
      await deleteHotWheelsCar(id)
      await playPopSound()
      await loadCars()
    } catch (error) {
      console.error('Failed to delete car:', error)
      alert('Failed to delete car')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      color: '',
      year: '',
      rarity: 'Common',
      value: '',
      condition: 'Good',
      notes: '',
      photo_data: ''
    })
    setEditingCar(null)
    setShowForm(false)
  }

  // Filter cars
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.color?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRarity = filterRarity === 'all' || car.rarity === filterRarity
    return matchesSearch && matchesRarity
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-yellow-300 to-red-400 p-3 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg mb-2 md:mb-4">
            🏎️ HOT WHEELS CATALOG 🏎️
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow">
            {cars.length} car{cars.length !== 1 ? 's' : ''} in your collection!
          </p>
        </div>

        {/* Add/Edit Car Button */}
        {!showForm && (
          <div className="mb-6 md:mb-8">
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm md:text-base font-bold rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              ➕ Add Car
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border-4 md:border-8 border-orange-400">
            <h2 className="text-2xl md:text-3xl font-black text-orange-600 mb-4 md:mb-6">
              {editingCar ? '✏️ Edit Car' : '➕ Add New Car'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-base md:text-lg font-black text-gray-700 mb-2">
                  Car Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 2023 Dodge Charger"
                  className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base md:text-lg font-black text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Red"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-base md:text-lg font-black text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 2023"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base md:text-lg font-black text-gray-700 mb-2">Rarity</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
                  >
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Ultra Rare">Ultra Rare</option>
                    <option value="Treasure Hunt">Treasure Hunt</option>
                    <option value="Super Treasure Hunt">Super Treasure Hunt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-black text-gray-700 mb-2">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
                  >
                    <option value="Mint">Mint (In Package)</option>
                    <option value="Near Mint">Near Mint</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base md:text-lg font-black text-gray-700 mb-2">Estimated Value ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., 5.99"
                  className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-black text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows="3"
                  className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg font-black text-gray-700 mb-2">📷 Car Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl bg-yellow-50 font-bold"
                />
                {formData.photo_data && (
                  <div className="mt-3">
                    <img src={formData.photo_data} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-4 border-orange-300" />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-lg md:text-xl rounded-xl border-4 border-green-600 shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingCar ? '✅ Update Car' : '✅ Add Car'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-black text-lg md:text-xl rounded-xl border-4 border-gray-600 shadow-lg active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border-4 md:border-8 border-orange-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base md:text-lg font-black text-gray-700 mb-2">🔍 Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or color..."
                className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-base md:text-lg font-black text-gray-700 mb-2">Filter by Rarity</label>
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="w-full px-3 py-2 md:px-4 md:py-3 border-4 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-base md:text-lg font-bold"
              >
                <option value="all">All Rarities</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Ultra Rare">Ultra Rare</option>
                <option value="Treasure Hunt">Treasure Hunt</option>
                <option value="Super Treasure Hunt">Super Treasure Hunt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Car Gallery */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border-4 md:border-8 border-orange-400">
          <h2 className="text-2xl md:text-3xl font-black text-orange-600 mb-4 md:mb-6">
            🏆 MY COLLECTION ({filteredCars.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-2xl font-bold text-gray-500">Loading...</div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-xl md:text-2xl font-bold text-gray-500 mb-3 md:mb-4">
                {searchQuery || filterRarity !== 'all' ? 'No cars match your filters!' : 'No cars yet! 🏎️'}
              </p>
              <p className="text-base md:text-lg text-gray-600">
                {searchQuery || filterRarity !== 'all' ? 'Try different search terms' : 'Add your first Hot Wheels car above! 📸'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-4 border-orange-300 hover:scale-105"
                >
                  <div
                    className="relative bg-gray-200 aspect-[4/3] flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => setSelectedCar(car)}
                  >
                    {car.photo_data ? (
                      <img
                        src={car.photo_data}
                        alt={car.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="text-6xl">🏎️</div>
                    )}
                    {car.rarity && car.rarity !== 'Common' && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-black border-2 border-yellow-600">
                        ⭐ {car.rarity}
                      </div>
                    )}
                  </div>

                  <div className="p-3 md:p-4 space-y-2">
                    <h3 className="text-base md:text-lg font-black text-orange-700 truncate" title={car.name}>
                      {car.name}
                    </h3>

                    <div className="text-sm space-y-1">
                      {car.color && <p className="text-gray-700 font-bold">🎨 {car.color}</p>}
                      {car.year && <p className="text-gray-700 font-bold">📅 {car.year}</p>}
                      {car.value && <p className="text-green-600 font-black">💰 ${parseFloat(car.value).toFixed(2)}</p>}
                      {car.condition && <p className="text-gray-600 font-bold">📦 {car.condition}</p>}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(car)}
                        className="flex-1 py-2 rounded-lg font-black text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="py-2 px-3 rounded-lg font-black text-sm text-white bg-red-500 hover:bg-red-600 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Car Detail Modal */}
      {selectedCar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCar(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl md:text-3xl font-black text-orange-600">{selectedCar.name}</h2>
              <button
                onClick={() => setSelectedCar(null)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
              >
                ✕ Close
              </button>
            </div>

            {selectedCar.photo_data && (
              <div className="mb-4">
                <img
                  src={selectedCar.photo_data}
                  alt={selectedCar.name}
                  className="w-full rounded-lg border-4 border-orange-300"
                />
              </div>
            )}

            <div className="space-y-3 text-lg">
              {selectedCar.color && (
                <p><span className="font-black">Color:</span> <span className="font-bold">{selectedCar.color}</span></p>
              )}
              {selectedCar.year && (
                <p><span className="font-black">Year:</span> <span className="font-bold">{selectedCar.year}</span></p>
              )}
              {selectedCar.rarity && (
                <p><span className="font-black">Rarity:</span> <span className="font-bold">{selectedCar.rarity}</span></p>
              )}
              {selectedCar.value && (
                <p><span className="font-black">Value:</span> <span className="font-bold text-green-600">${parseFloat(selectedCar.value).toFixed(2)}</span></p>
              )}
              {selectedCar.condition && (
                <p><span className="font-black">Condition:</span> <span className="font-bold">{selectedCar.condition}</span></p>
              )}
              {selectedCar.notes && (
                <div>
                  <p className="font-black mb-1">Notes:</p>
                  <p className="font-bold text-gray-700 bg-gray-100 p-3 rounded-lg">{selectedCar.notes}</p>
                </div>
              )}
              {selectedCar.created_at && (
                <p className="text-sm text-gray-500">
                  <span className="font-black">Added:</span> {new Date(selectedCar.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
