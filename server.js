require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'app')));

// ─── Current Weather by City ───────────────────────────────
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, appid: process.env.WEATHER_API_KEY, units: 'metric' }
    });
    res.json(response.data);
  } catch {
    res.status(404).json({ error: 'City not found. Please check the spelling.' });
  }
});

// ─── 5-Day / 3-Hour Forecast ───────────────────────────────
app.get('/api/forecast', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: { q: city, appid: process.env.WEATHER_API_KEY, units: 'metric', cnt: 40 }
    });
    res.json(response.data);
  } catch {
    res.status(404).json({ error: 'Forecast unavailable for this city.' });
  }
});

// ─── Weather by GPS Coordinates (Auto-detect location) ─────
app.get('/api/weather-by-coords', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Coordinates required' });
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric'
      }
    });
    res.json(response.data);
  } catch {
    res.status(404).json({ error: 'Could not get weather for your location.' });
  }
});

app.listen(PORT, () => console.log(`✅ SKYCAST running at http://localhost:${PORT}`));