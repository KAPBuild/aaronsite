-- Database schema for Aaron's Site - D1 Only
-- Run this to create the D1 database tables

-- Drawings table (stores images as base64)
CREATE TABLE IF NOT EXISTS drawings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image_data TEXT NOT NULL,
  thumbnail_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hot Wheels catalog table (stores photos as base64)
CREATE TABLE IF NOT EXISTS hotwheels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT,
  year INTEGER,
  rarity TEXT,
  value REAL,
  condition TEXT,
  notes TEXT,
  photo_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_drawings_created ON drawings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hotwheels_created ON hotwheels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hotwheels_name ON hotwheels(name);
