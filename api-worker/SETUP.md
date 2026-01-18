# Cloudflare Storage Setup Guide

This guide will help you set up free cloud storage for Aaron's Site using Cloudflare Workers, D1 (database), and R2 (image storage).

## Prerequisites
- Cloudflare account (free tier is fine)
- Your site is already on Cloudflare Pages

## Step 1: Login to Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 2: Create D1 Database

```bash
npx wrangler d1 create aaronsite-db
```

**IMPORTANT:** Copy the `database_id` from the output and paste it in `wrangler.toml` where it says `YOUR_DATABASE_ID_HERE`.

## Step 3: Initialize Database Schema

```bash
npx wrangler d1 execute aaronsite-db --file=./schema.sql
```

This creates the tables for drawings and Hot Wheels cars.

## Step 4: Create R2 Bucket

```bash
npx wrangler r2 bucket create aaronsite-storage
```

This creates a bucket to store images (drawings and car photos).

## Step 5: Update wrangler.toml

Open `wrangler.toml` and:
1. Replace `YOUR_DATABASE_ID_HERE` with the database ID from Step 2
2. Update `ALLOWED_ORIGIN` to match your actual site URL (e.g., `https://aaronsite.pages.dev` or your custom domain)

## Step 6: Deploy the Worker

```bash
npx wrangler deploy
```

After deployment, you'll get a worker URL like: `https://aaronsite-api.YOURNAME.workers.dev`

**Copy this URL** - you'll need it for your React app.

## Step 7: Make R2 Bucket Public (for images)

1. Go to Cloudflare Dashboard → R2
2. Click on `aaronsite-storage`
3. Settings tab → Public Access → Enable
4. Copy the public bucket URL (something like `https://pub-XXXX.r2.dev`)
5. Update the `getImageUrl()` function in `src/index.js` to use this URL

## Step 8: Update React App

In your React app, create a file `src/utils/storage.js` with your worker URL:

```javascript
const API_URL = 'https://aaronsite-api.YOURNAME.workers.dev';

export async function saveDrawing(name, imageData, thumbnailData) {
  const response = await fetch(`${API_URL}/api/drawings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, image_data: imageData, thumbnail_data: thumbnailData })
  });
  return response.json();
}

export async function getDrawings() {
  const response = await fetch(`${API_URL}/api/drawings`);
  return response.json();
}

export async function saveHotWheelsCar(car) {
  const response = await fetch(`${API_URL}/api/hotwheels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car)
  });
  return response.json();
}

export async function getHotWheelsCars() {
  const response = await fetch(`${API_URL}/api/hotwheels`);
  return response.json();
}
```

## API Endpoints

### Drawings
- `GET /api/drawings` - List all drawings with thumbnails
- `GET /api/drawings/:id` - Get specific drawing
- `POST /api/drawings` - Save new drawing
- `DELETE /api/drawings/:id` - Delete drawing

### Hot Wheels
- `GET /api/hotwheels` - List all cars
- `GET /api/hotwheels/:id` - Get specific car
- `POST /api/hotwheels` - Add new car
- `PUT /api/hotwheels/:id` - Update car
- `DELETE /api/hotwheels/:id` - Delete car

## Free Tier Limits
- D1: 5GB storage, 5 million reads/day
- R2: 10GB storage, 10 million reads/month
- Workers: 100,000 requests/day

More than enough for personal use!

## Troubleshooting

**CORS errors?**
Make sure `ALLOWED_ORIGIN` in `wrangler.toml` matches your site URL exactly.

**Images not loading?**
Check that R2 bucket is public and the URL in `getImageUrl()` is correct.

**Database errors?**
Make sure you ran the schema.sql file in Step 3.

## Next Steps

After setup is complete, I'll help you:
1. Add "Save Drawing" button to your drawing canvas
2. Create a gallery to view saved drawings
3. Build the Hot Wheels catalog interface
