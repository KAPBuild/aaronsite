// Cloud storage utilities using Cloudflare Workers API
const API_URL = 'https://aaronsite-api.kapp-build.workers.dev';

// ===== DRAWINGS API =====

/**
 * Save a drawing with full image and thumbnail
 * @param {string} name - Drawing name
 * @param {string} imageData - Full size image as base64 data URL (e.g., "data:image/png;base64,...")
 * @param {string} thumbnailData - Thumbnail image as base64 data URL
 * @returns {Promise<{id: number, message: string}>}
 */
export async function saveDrawing(name, imageData, thumbnailData) {
  try {
    const response = await fetch(`${API_URL}/api/drawings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        image_data: imageData,
        thumbnail_data: thumbnailData
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to save drawing: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving drawing:', error);
    throw error;
  }
}

/**
 * Get list of all drawings with thumbnails
 * @returns {Promise<{drawings: Array}>}
 */
export async function getDrawings() {
  try {
    const response = await fetch(`${API_URL}/api/drawings`);

    if (!response.ok) {
      throw new Error(`Failed to fetch drawings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching drawings:', error);
    throw error;
  }
}

/**
 * Get a specific drawing with full image
 * @param {number} id - Drawing ID
 * @returns {Promise<{drawing: Object}>}
 */
export async function getDrawing(id) {
  try {
    const response = await fetch(`${API_URL}/api/drawings/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch drawing: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching drawing:', error);
    throw error;
  }
}

/**
 * Delete a drawing
 * @param {number} id - Drawing ID
 * @returns {Promise<{message: string}>}
 */
export async function deleteDrawing(id) {
  try {
    const response = await fetch(`${API_URL}/api/drawings/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete drawing: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting drawing:', error);
    throw error;
  }
}

// ===== HOT WHEELS API =====

/**
 * Add a new Hot Wheels car to the catalog
 * @param {Object} car - Car details
 * @param {string} car.name - Car name (required)
 * @param {string} [car.color] - Color
 * @param {number} [car.year] - Year
 * @param {string} [car.rarity] - Rarity (Common, Uncommon, Rare, Ultra Rare, etc.)
 * @param {number} [car.value] - Estimated value
 * @param {string} [car.condition] - Condition (Mint, Good, Fair, Poor)
 * @param {string} [car.notes] - Additional notes
 * @param {string} [car.photo_data] - Photo as base64 data URL
 * @returns {Promise<{id: number, message: string}>}
 */
export async function addHotWheelsCar(car) {
  try {
    const response = await fetch(`${API_URL}/api/hotwheels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car)
    });

    if (!response.ok) {
      throw new Error(`Failed to add car: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
}

/**
 * Get list of all Hot Wheels cars
 * @returns {Promise<{cars: Array}>}
 */
export async function getHotWheelsCars() {
  try {
    const response = await fetch(`${API_URL}/api/hotwheels`);

    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}

/**
 * Get a specific Hot Wheels car
 * @param {number} id - Car ID
 * @returns {Promise<{car: Object}>}
 */
export async function getHotWheelsCar(id) {
  try {
    const response = await fetch(`${API_URL}/api/hotwheels/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch car: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
}

/**
 * Update a Hot Wheels car
 * @param {number} id - Car ID
 * @param {Object} car - Updated car details
 * @returns {Promise<{message: string}>}
 */
export async function updateHotWheelsCar(id, car) {
  try {
    const response = await fetch(`${API_URL}/api/hotwheels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car)
    });

    if (!response.ok) {
      throw new Error(`Failed to update car: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
}

/**
 * Delete a Hot Wheels car
 * @param {number} id - Car ID
 * @returns {Promise<{message: string}>}
 */
export async function deleteHotWheelsCar(id) {
  try {
    const response = await fetch(`${API_URL}/api/hotwheels/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete car: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Convert canvas to base64 data URL
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} [quality=0.8] - Image quality (0-1)
 * @returns {string} Base64 data URL
 */
export function canvasToDataURL(canvas, quality = 0.8) {
  return canvas.toDataURL('image/png', quality);
}

/**
 * Create thumbnail from canvas
 * @param {HTMLCanvasElement} canvas - Original canvas
 * @param {number} [maxWidth=200] - Max thumbnail width
 * @param {number} [maxHeight=200] - Max thumbnail height
 * @returns {string} Thumbnail as base64 data URL
 */
export function createThumbnail(canvas, maxWidth = 200, maxHeight = 200) {
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  // Calculate thumbnail dimensions
  let width = canvas.width;
  let height = canvas.height;

  if (width > height) {
    if (width > maxWidth) {
      height = height * (maxWidth / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = width * (maxHeight / height);
      height = maxHeight;
    }
  }

  tempCanvas.width = width;
  tempCanvas.height = height;

  ctx.drawImage(canvas, 0, 0, width, height);

  return tempCanvas.toDataURL('image/png', 0.7);
}
