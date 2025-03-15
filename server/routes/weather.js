const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const auth = require('../middleware/auth');

// Get current weather for a location
router.get('/current', auth, async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }
  
  try {
    const weatherData = await weatherService.getCurrentWeather(lat, lon);
    res.json(weatherData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get 5-day forecast for a location
router.get('/forecast', auth, async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }
  
  try {
    const forecastData = await weatherService.getForecast(lat, lon);
    res.json(forecastData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get historical weather for a location
router.get('/historical', auth, async (req, res) => {
  const { lat, lon, dt } = req.query;
  
  if (!lat || !lon || !dt) {
    return res.status(400).json({ 
      message: 'Latitude, longitude, and date (Unix timestamp) are required' 
    });
  }
  
  try {
    const historicalData = await weatherService.getHistorical(lat, lon, dt);
    res.json(historicalData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;