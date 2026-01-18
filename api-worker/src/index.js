// Cloudflare Worker API for Aaron's Site Storage (D1 Only)
// Handles drawings and Hot Wheels catalog with images stored in D1

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route requests
      if (url.pathname.startsWith('/api/drawings')) {
        return handleDrawings(request, env, url, corsHeaders);
      } else if (url.pathname.startsWith('/api/hotwheels')) {
        return handleHotWheels(request, env, url, corsHeaders);
      } else {
        return jsonResponse({ error: 'Not found' }, 404, corsHeaders);
      }
    } catch (error) {
      return jsonResponse({ error: error.message }, 500, corsHeaders);
    }
  }
};

// ===== DRAWINGS API =====

async function handleDrawings(request, env, url, corsHeaders) {
  const { DB } = env;

  // GET /api/drawings - List all drawings with thumbnails
  if (request.method === 'GET' && url.pathname === '/api/drawings') {
    const { results } = await DB.prepare(
      'SELECT id, name, thumbnail_data, created_at FROM drawings ORDER BY created_at DESC'
    ).all();

    return jsonResponse({ drawings: results }, 200, corsHeaders);
  }

  // GET /api/drawings/:id - Get specific drawing with full image
  if (request.method === 'GET' && url.pathname.match(/^\/api\/drawings\/\d+$/)) {
    const id = url.pathname.split('/')[3];
    const drawing = await DB.prepare(
      'SELECT * FROM drawings WHERE id = ?'
    ).bind(id).first();

    if (!drawing) {
      return jsonResponse({ error: 'Drawing not found' }, 404, corsHeaders);
    }

    return jsonResponse({ drawing }, 200, corsHeaders);
  }

  // POST /api/drawings - Save new drawing
  if (request.method === 'POST' && url.pathname === '/api/drawings') {
    const { name, image_data, thumbnail_data } = await request.json();

    if (!name || !image_data) {
      return jsonResponse({ error: 'Name and image_data required' }, 400, corsHeaders);
    }

    const result = await DB.prepare(
      'INSERT INTO drawings (name, image_data, thumbnail_data, created_at) VALUES (?, ?, ?, datetime("now"))'
    ).bind(name, image_data, thumbnail_data).run();

    return jsonResponse({
      id: result.meta.last_row_id,
      message: 'Drawing saved successfully'
    }, 201, corsHeaders);
  }

  // DELETE /api/drawings/:id - Delete drawing
  if (request.method === 'DELETE' && url.pathname.match(/^\/api\/drawings\/\d+$/)) {
    const id = url.pathname.split('/')[3];

    await DB.prepare('DELETE FROM drawings WHERE id = ?').bind(id).run();

    return jsonResponse({ message: 'Drawing deleted' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Invalid request' }, 400, corsHeaders);
}

// ===== HOT WHEELS API =====

async function handleHotWheels(request, env, url, corsHeaders) {
  const { DB } = env;

  // GET /api/hotwheels - List all cars
  if (request.method === 'GET' && url.pathname === '/api/hotwheels') {
    const { results } = await DB.prepare(
      'SELECT id, name, color, year, rarity, value, condition, photo_data, created_at FROM hotwheels ORDER BY created_at DESC'
    ).all();

    return jsonResponse({ cars: results }, 200, corsHeaders);
  }

  // GET /api/hotwheels/:id - Get specific car
  if (request.method === 'GET' && url.pathname.match(/^\/api\/hotwheels\/\d+$/)) {
    const id = url.pathname.split('/')[3];
    const car = await DB.prepare(
      'SELECT * FROM hotwheels WHERE id = ?'
    ).bind(id).first();

    if (!car) {
      return jsonResponse({ error: 'Car not found' }, 404, corsHeaders);
    }

    return jsonResponse({ car }, 200, corsHeaders);
  }

  // POST /api/hotwheels - Add new car
  if (request.method === 'POST' && url.pathname === '/api/hotwheels') {
    const { name, color, year, rarity, value, condition, notes, photo_data } = await request.json();

    if (!name) {
      return jsonResponse({ error: 'Name is required' }, 400, corsHeaders);
    }

    const result = await DB.prepare(
      'INSERT INTO hotwheels (name, color, year, rarity, value, condition, notes, photo_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))'
    ).bind(name, color, year, rarity, value, condition, notes, photo_data).run();

    return jsonResponse({
      id: result.meta.last_row_id,
      message: 'Car added successfully'
    }, 201, corsHeaders);
  }

  // PUT /api/hotwheels/:id - Update car
  if (request.method === 'PUT' && url.pathname.match(/^\/api\/hotwheels\/\d+$/)) {
    const id = url.pathname.split('/')[3];
    const { name, color, year, rarity, value, condition, notes, photo_data } = await request.json();

    await DB.prepare(
      `UPDATE hotwheels SET name = ?, color = ?, year = ?, rarity = ?, value = ?,
       condition = ?, notes = ?, photo_data = ? WHERE id = ?`
    ).bind(name, color, year, rarity, value, condition, notes, photo_data, id).run();

    return jsonResponse({ message: 'Car updated successfully' }, 200, corsHeaders);
  }

  // DELETE /api/hotwheels/:id - Delete car
  if (request.method === 'DELETE' && url.pathname.match(/^\/api\/hotwheels\/\d+$/)) {
    const id = url.pathname.split('/')[3];

    await DB.prepare('DELETE FROM hotwheels WHERE id = ?').bind(id).run();

    return jsonResponse({ message: 'Car deleted' }, 200, corsHeaders);
  }

  return jsonResponse({ error: 'Invalid request' }, 400, corsHeaders);
}

// ===== HELPER FUNCTIONS =====

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}
