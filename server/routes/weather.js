const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const auth = require('../middleware/auth');

// Search for locations
router.get('/search', auth, async (req, res) => {
  const { q, limit } = req.query;
  
  console.log('Location search request received:', {
    query: q,
    limit: limit || 5
  });
  
  if (!q) {
    console.log('Search request rejected: No query provided');
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  try {
    console.log('Calling weather service searchLocations...');
    const locations = await weatherService.searchLocations(q, limit);
    console.log('Search successful:', {
      query: q,
      resultsCount: locations.length
    });
    res.json(locations);
  } catch (err) {
    console.error('Location search error:', {
      error: err.message,
      stack: err.stack,
      query: q
    });
    res.status(500).json({ message: err.message });
  }
});

// Get current weather for a location
router.get('/current', auth, async (req, res) => {
  const { lat, lon } = req.query;
  
  console.log('Current weather request received:', {
    lat: lat,
    lon: lon
  });
  
  if (!lat || !lon) {
    console.log('Current weather request rejected: No latitude or longitude provided');
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }
  
  try {
    console.log('Calling weather service getCurrentWeather...');
    const weatherData = await weatherService.getCurrentWeather(lat, lon);
    console.log('Current weather retrieved:', {
      lat: lat,
      lon: lon,
      weather: weatherData
    });
    res.json(weatherData);
  } catch (err) {
    console.error('Current weather error:', {
      error: err.message,
      stack: err.stack,
      lat: lat,
      lon: lon
    });
    res.status(500).json({ message: err.message });
  }
});

// Get 5-day forecast for a location
router.get('/forecast', auth, async (req, res) => {
  const { lat, lon } = req.query;
  
  console.log('Forecast request received:', {
    lat: lat,
    lon: lon
  });
  
  if (!lat || !lon) {
    console.log('Forecast request rejected: No latitude or longitude provided');
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }
  
  try {
    console.log('Calling weather service getForecast...');
    const forecastData = await weatherService.getForecast(lat, lon);
    console.log('Forecast retrieved:', {
      lat: lat,
      lon: lon,
      forecast: forecastData
    });
    res.json(forecastData);
  } catch (err) {
    console.error('Forecast error:', {
      error: err.message,
      stack: err.stack,
      lat: lat,
      lon: lon
    });
    res.status(500).json({ message: err.message });
  }
});

// Get historical weather for a location
router.get('/historical', auth, async (req, res) => {
  const { lat, lon, dt } = req.query;
  
  console.log('Historical weather request received:', {
    lat: lat,
    lon: lon,
    dt: dt
  });
  
  if (!lat || !lon || !dt) {
    console.log('Historical weather request rejected: No latitude, longitude, or date provided');
    return res.status(400).json({ 
      message: 'Latitude, longitude, and date (Unix timestamp) are required' 
    });
  }
  
  try {
    console.log('Calling weather service getHistorical...');
    const historicalData = await weatherService.getHistorical(lat, lon, dt);
    console.log('Historical weather retrieved:', {
      lat: lat,
      lon: lon,
      dt: dt,
      weather: historicalData
    });
    res.json(historicalData);
  } catch (err) {
    console.error('Historical weather error:', {
      error: err.message,
      stack: err.stack,
      lat: lat,
      lon: lon,
      dt: dt
    });
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;