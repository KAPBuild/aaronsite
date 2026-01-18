import React, { useRef, useState, useEffect } from 'react'
import { playPopSound, playClickSound } from '../utils/sounds'
import { saveDrawing as saveToCloud, getDrawings, getDrawing, deleteDrawing, canvasToDataURL, createThumbnail } from '../utils/storage'

export default function SimpleDrawingCanvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState('brush') // brush, eraser, line, circle, rectangle, fill
  const [history, setHistory] = useState([])
  const [historyStep, setHistoryStep] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const contextRef = useRef(null)
  const [startPos, setStartPos] = useState(null)

  // Cloud storage states
  const [showGallery, setShowGallery] = useState(false)
  const [savedDrawings, setSavedDrawings] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const width = isFullscreen ? window.innerWidth : Math.min(700, window.innerWidth - 40)
    const height = isFullscreen ? window.innerHeight : 400

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)
    contextRef.current = context

    // Save initial state
    saveToHistory(canvas)
  }, [isFullscreen])

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  const saveToHistory = (canvas) => {
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(canvas.toDataURL())
    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    const { x, y } = getCoordinates(e)
    setStartPos({ x, y })
    setIsDrawing(true)

    if (tool === 'brush' || tool === 'eraser') {
      const context = contextRef.current
      context.beginPath()
      context.moveTo(x, y)
    }
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()

    const { x, y } = getCoordinates(e)
    const context = contextRef.current

    if (tool === 'brush') {
      context.strokeStyle = color
      context.lineWidth = brushSize
      context.lineJoin = 'round'
      context.lineCap = 'round'
      context.lineTo(x, y)
      context.stroke()
    } else if (tool === 'eraser') {
      context.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize)
    }
  }

  const stopDrawing = (e) => {
    if (!isDrawing) return
    e.preventDefault()

    const { x, y } = getCoordinates(e)
    const context = contextRef.current

    // Draw shapes on release
    if (tool === 'line' && startPos) {
      redrawCanvas()
      context.strokeStyle = color
      context.lineWidth = brushSize
      context.beginPath()
      context.moveTo(startPos.x, startPos.y)
      context.lineTo(x, y)
      context.stroke()
      saveToHistory(canvasRef.current)
    } else if (tool === 'circle' && startPos) {
      redrawCanvas()
      const radius = Math.sqrt((x - startPos.x) ** 2 + (y - startPos.y) ** 2)
      context.strokeStyle = color
      context.lineWidth = brushSize
      context.beginPath()
      context.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2)
      context.stroke()
      saveToHistory(canvasRef.current)
    } else if (tool === 'rectangle' && startPos) {
      redrawCanvas()
      context.strokeStyle = color
      context.lineWidth = brushSize
      context.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y)
      saveToHistory(canvasRef.current)
    } else if (tool === 'brush' || tool === 'eraser') {
      context.closePath()
      saveToHistory(canvasRef.current)
    }

    setIsDrawing(false)
    setStartPos(null)
  }

  const redrawCanvas = () => {
    if (historyStep >= 0 && history[historyStep]) {
      const canvas = canvasRef.current
      const context = contextRef.current
      const img = new Image()
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
      img.src = history[historyStep]
    }
  }

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1
      setHistoryStep(newStep)
      const canvas = canvasRef.current
      const context = contextRef.current
      const img = new Image()
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
      img.src = history[newStep]
    }
  }

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1
      setHistoryStep(newStep)
      const canvas = canvasRef.current
      const context = contextRef.current
      const img = new Image()
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
      }
      img.src = history[newStep]
    }
  }

  const clearCanvas = async () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory(canvas)
    await playPopSound()
  }

  const saveDrawing = async () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `drawing-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
    await playPopSound()
  }

  // Save drawing to cloud
  const saveDrawingToCloud = async () => {
    const drawingName = prompt('Enter a name for your drawing:')
    if (!drawingName) return

    setIsLoading(true)
    setSaveMessage('')

    try {
      const canvas = canvasRef.current
      const imageData = canvasToDataURL(canvas)
      const thumbnailData = createThumbnail(canvas)

      await saveToCloud(drawingName, imageData, thumbnailData)
      await playPopSound()
      setSaveMessage('✅ Drawing saved to cloud!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save drawing:', error)
      setSaveMessage('❌ Failed to save. Try again.')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Load saved drawings gallery
  const loadGallery = async () => {
    setIsLoading(true)
    setShowGallery(true)

    try {
      const { drawings } = await getDrawings()
      setSavedDrawings(drawings)
    } catch (error) {
      console.error('Failed to load gallery:', error)
      setSavedDrawings([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load a specific drawing
  const loadDrawing = async (id) => {
    setIsLoading(true)

    try {
      const { drawing } = await getDrawing(id)
      const canvas = canvasRef.current
      const context = contextRef.current
      const img = new Image()

      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
        saveToHistory(canvas)
        setShowGallery(false)
        playPopSound()
      }

      img.src = drawing.image_data
    } catch (error) {
      console.error('Failed to load drawing:', error)
      alert('Failed to load drawing')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a drawing
  const handleDeleteDrawing = async (id) => {
    if (!confirm('Delete this drawing?')) return

    setIsLoading(true)

    try {
      await deleteDrawing(id)
      await loadGallery() // Refresh gallery
      await playPopSound()
    } catch (error) {
      console.error('Failed to delete drawing:', error)
      alert('Failed to delete drawing')
    } finally {
      setIsLoading(false)
    }
  }

  const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB']

  const toolButtonClass = (toolName) => `
    px-4 py-2 rounded-lg font-semibold transition-all text-sm
    ${tool === toolName
      ? 'bg-cyan-500 text-white shadow-lg scale-105'
      : 'bg-slate-700 text-cyan-300 hover:bg-slate-600'}
  `

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Top Exit Bar */}
        <div className="bg-red-600 p-2 flex items-center justify-between border-b-4 border-red-700">
          <div className="text-white font-bold">Drawing Mode - Fullscreen</div>
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-red-700 hover:bg-red-800 text-white text-2xl font-bold py-2 px-4 rounded transition-all hover:scale-110 active:scale-95"
            title="Exit Fullscreen (or press Escape)"
          >
            ✕ EXIT
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 overflow-y-auto max-h-24">
          <div className="space-y-3">
            {/* Tool Selection */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTool('brush')} className={toolButtonClass('brush')} title="Brush">
                🖌️
              </button>
              <button onClick={() => setTool('eraser')} className={toolButtonClass('eraser')} title="Eraser">
                🧹
              </button>
              <button onClick={() => setTool('line')} className={toolButtonClass('line')} title="Line">
                📏
              </button>
              <button onClick={() => setTool('circle')} className={toolButtonClass('circle')} title="Circle">
                ⭕
              </button>
              <button onClick={() => setTool('rectangle')} className={toolButtonClass('rectangle')} title="Rectangle">
                ▭
              </button>
            </div>

            {/* Colors */}
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c)
                    setTool('brush')
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c && tool === 'brush' ? 'border-white scale-110' : 'border-gray-400'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Brush Size and Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 text-sm font-semibold">Size:</span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-32 h-2 bg-slate-600 rounded-lg"
                />
                <span className="text-cyan-300 text-sm w-8">{brushSize}</span>
              </div>

              <button onClick={undo} className="bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-1 rounded text-sm">↶ Undo</button>
              <button onClick={redo} className="bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-1 rounded text-sm">↷ Redo</button>
              <button onClick={clearCanvas} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold">Clear</button>
              <button onClick={saveDrawing} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold">💾 Save</button>
              <button onClick={saveDrawingToCloud} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold disabled:opacity-50">☁️ Cloud</button>
              <button onClick={loadGallery} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-bold disabled:opacity-50">🖼️ Gallery</button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-white overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-slate-700 rounded-lg p-4 space-y-3">
        {/* Tool Selection */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTool('brush')} className={toolButtonClass('brush')} title="Brush">
            🖌️ Brush
          </button>
          <button onClick={() => setTool('eraser')} className={toolButtonClass('eraser')} title="Eraser">
            🧹 Eraser
          </button>
          <button onClick={() => setTool('line')} className={toolButtonClass('line')} title="Line">
            📏 Line
          </button>
          <button onClick={() => setTool('circle')} className={toolButtonClass('circle')} title="Circle">
            ⭕ Circle
          </button>
          <button onClick={() => setTool('rectangle')} className={toolButtonClass('rectangle')} title="Rectangle">
            ▭ Rectangle
          </button>
        </div>

        {/* Colors */}
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c)
                setTool('brush')
              }}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                color === c && tool === 'brush' ? 'border-white scale-110' : 'border-gray-400'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Size Control */}
        <div className="flex items-center gap-3">
          <span className="text-cyan-300 font-semibold text-sm">Brush Size:</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-600 rounded-lg"
          />
          <span className="text-cyan-300 font-bold w-8">{brushSize}</span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <button onClick={undo} className="bg-slate-600 hover:bg-slate-500 text-cyan-300 px-3 py-2 rounded font-semibold text-sm">↶ Undo</button>
          <button onClick={redo} className="bg-slate-600 hover:bg-slate-500 text-cyan-300 px-3 py-2 rounded font-semibold text-sm">↷ Redo</button>
          <button onClick={clearCanvas} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-bold text-sm">🗑️ Clear</button>
          <button onClick={saveDrawing} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-bold text-sm">💾 Save</button>
          <button onClick={saveDrawingToCloud} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-bold text-sm disabled:opacity-50">☁️ Save to Cloud</button>
          <button onClick={loadGallery} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded font-bold text-sm disabled:opacity-50">🖼️ Gallery</button>
          <button
            onClick={() => setIsFullscreen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded font-bold text-sm"
          >
            ⛶ Fullscreen
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`text-center p-2 rounded font-bold ${saveMessage.includes('✅') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {saveMessage}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="flex justify-center bg-slate-800 rounded-lg p-2">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-2 border-cyan-500 bg-white cursor-crosshair rounded"
          style={{ touchAction: 'none', maxWidth: '100%' }}
        />
      </div>

      <div className="text-center text-sm text-cyan-300 font-semibold">
        Choose a tool and start drawing! Use the fullscreen button for more space.
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowGallery(false)}>
          <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-300">🖼️ Saved Drawings</h2>
              <button onClick={() => setShowGallery(false)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold">
                ✕ Close
              </button>
            </div>

            {isLoading ? (
              <div className="text-center text-cyan-300 text-lg py-8">Loading...</div>
            ) : savedDrawings.length === 0 ? (
              <div className="text-center text-cyan-300 text-lg py-8">No saved drawings yet. Create and save one!</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {savedDrawings.map((drawing) => (
                  <div key={drawing.id} className="bg-slate-700 rounded-lg p-3 hover:bg-slate-600 transition">
                    {/* Thumbnail */}
                    <div className="aspect-square bg-white rounded mb-2 overflow-hidden cursor-pointer" onClick={() => loadDrawing(drawing.id)}>
                      {drawing.thumbnail_data ? (
                        <img src={drawing.thumbnail_data} alt={drawing.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No preview</div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="text-cyan-300 font-semibold text-sm mb-2 truncate" title={drawing.name}>
                      {drawing.name}
                    </div>

                    {/* Date */}
                    <div className="text-gray-400 text-xs mb-2">
                      {new Date(drawing.created_at).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadDrawing(drawing.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteDrawing(drawing.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-bold"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
