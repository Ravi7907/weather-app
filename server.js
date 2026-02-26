// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'app')));

// This is the API route the frontend will call
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'Please provide a city name' });
  }

  try {
    // Call OpenWeatherMap API
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: 'metric' // Celsius
      }
    });

    // Send weather data back to frontend
    res.json(response.data);

  } catch (error) {
    res.status(404).json({ error: 'City not found. Please check the spelling.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});