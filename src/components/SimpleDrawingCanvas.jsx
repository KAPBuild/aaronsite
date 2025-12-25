import React, { useRef, useState, useEffect } from 'react'
import { playPopSound, playClickSound } from '../utils/sounds'
import confetti from 'canvas-confetti'

export default function SimpleDrawingCanvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#FF0000')
  const [brushSize, setBrushSize] = useState(15)
  const contextRef = useRef(null)
  const [isErasing, setIsErasing] = useState(false)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = Math.min(600, window.innerWidth - 40)
    canvas.height = 400

    const context = canvas.getContext('2d')
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    contextRef.current = context

    // Handle resize
    const handleResize = () => {
      const newWidth = Math.min(600, window.innerWidth - 40)
      const oldCanvas = canvas
      const newCanvas = document.createElement('canvas')
      newCanvas.width = newWidth
      newCanvas.height = 400

      const newContext = newCanvas.getContext('2d')
      newContext.fillStyle = 'white'
      newContext.fillRect(0, 0, newWidth, 400)
      newContext.drawImage(oldCanvas, 0, 0)

      canvas.width = newWidth
      canvas.height = 400
      contextRef.current = newContext
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Start drawing
  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
    playClickSound()
  }

  // Draw on canvas
  const draw = (e) => {
    if (!isDrawing) return

    const { offsetX, offsetY } = e.nativeEvent
    const context = contextRef.current

    if (isErasing) {
      context.clearRect(offsetX - brushSize / 2, offsetY - brushSize / 2, brushSize, brushSize)
    } else {
      context.strokeStyle = color
      context.lineWidth = brushSize
      context.lineJoin = 'round'
      context.lineCap = 'round'
      context.lineTo(offsetX, offsetY)
      context.stroke()
    }
  }

  // Stop drawing
  const stopDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  // Clear canvas with celebration
  const clearCanvas = async () => {
    const canvas = canvasRef.current
    contextRef.current.fillStyle = 'white'
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height)
    await playPopSound()
  }

  // Save drawing
  const saveDrawing = async () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `aaron-drawing-${new Date().getTime()}.png`
    link.href = canvas.toDataURL()
    link.click()
    await playPopSound()
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    })
  }

  // Rainbow colors!
  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#FF1493', '#000000']

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-4 border-gray-800 bg-white rounded-2xl shadow-lg max-w-full cursor-crosshair"
        />
      </div>

      {/* Color Picker - Big colorful buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c)
              setIsErasing(false)
              playClickSound()
            }}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 transition-all hover:scale-125 active:scale-100 shadow-lg ${
              color === c && !isErasing ? 'border-black scale-125 shadow-2xl' : 'border-gray-400'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Brush Size */}
      <div className="flex justify-center items-center gap-6 bg-yellow-100 rounded-2xl p-6 border-4 border-yellow-300">
        <span className="text-3xl font-black text-blue-600">Brush Size:</span>
        <input
          type="range"
          min="3"
          max="40"
          value={brushSize}
          onChange={(e) => {
            setBrushSize(Number(e.target.value))
            playClickSound()
          }}
          className="w-48 h-4 bg-gradient-to-r from-red-400 to-blue-400 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-4xl font-black text-purple-600">{brushSize}px</span>
      </div>

      {/* Tools - BIG BUTTONS */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => {
            setIsErasing(!isErasing)
            playClickSound()
          }}
          className={`px-6 md:px-8 py-4 md:py-6 rounded-2xl font-black text-xl md:text-2xl transition-all hover:scale-110 active:scale-95 shadow-lg border-4 text-white ${
            isErasing
              ? 'bg-red-600 scale-110 border-white shadow-2xl'
              : 'bg-orange-500 border-orange-600 hover:bg-orange-600'
          }`}
        >
          🧹 {isErasing ? 'ERASING' : 'ERASER'}
        </button>

        <button
          onClick={clearCanvas}
          className="px-6 md:px-8 py-4 md:py-6 rounded-2xl font-black text-xl md:text-2xl bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110 active:scale-95 shadow-lg border-4 border-red-600"
        >
          🗑️ CLEAR
        </button>

        <button
          onClick={saveDrawing}
          className="px-6 md:px-8 py-4 md:py-6 rounded-2xl font-black text-xl md:text-2xl bg-green-500 hover:bg-green-600 text-white transition-all hover:scale-110 active:scale-95 shadow-lg border-4 border-green-600"
        >
          💾 SAVE
        </button>
      </div>

      <div className="text-center text-lg md:text-xl font-black text-white drop-shadow-lg bg-blue-500 rounded-2xl p-4 border-4 border-white">
        🖌️ Tap & drag to draw! Choose colors and brush size! Have FUN! 🎨
      </div>
    </div>
  )
}
