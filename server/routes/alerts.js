const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const weatherService = require('../services/weatherService');

// GET all alerts for a user
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user.id })
                              .populate('location', 'name lat lon');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new alert
router.post('/', auth, async (req, res) => {
  const { locationId, condition, threshold } = req.body;
  
  try {
    // Verify location belongs to user
    const location = await Location.findOne({ 
      _id: locationId, 
      user: req.user.id 
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    const alert = new Alert({
      user: req.user.id,
      location: locationId,
      condition,
      threshold
    });
    
    const savedAlert = await alert.save();
    
    // Populate location info for response
    const populatedAlert = await Alert.findById(savedAlert._id)
                                     .populate('location', 'name lat lon');
    
    res.status(201).json(populatedAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an alert
router.put('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('location', 'name lat lon');
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHECK alerts for a location
router.get('/check/:locationId', auth, async (req, res) => {
  try {
    const location = await Location.findOne({ 
      _id: req.params.locationId, 
      user: req.user.id 
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Get current weather data
    const weatherData = await weatherService.getCurrentWeather(
      location.lat, 
      location.lon
    );
    
    // Get all active alerts for this location
    const alerts = await Alert.find({ 
      location: location._id, 
      user: req.user.id,
      active: true
    });
    
    // Check each alert against current conditions
    const alertResults = alerts.map(alert => {
      let triggered = false;
      
      switch (alert.condition) {
        case 'temp_above':
          triggered = weatherData.main.temp > alert.threshold;
          break;
        case 'temp_below':
          triggered = weatherData.main.temp < alert.threshold;
          break;
        case 'rain':
          triggered = weatherData.weather[0].main.toLowerCase() === 'rain';
          break;
        case 'snow':
          triggered = weatherData.weather[0].main.toLowerCase() === 'snow';
          break;
        case 'wind_above':
          triggered = weatherData.wind.speed > alert.threshold;
          break;
        default:
          break;
      }
      
      return {
        alert: alert._id,
        condition: alert.condition,
        threshold: alert.threshold,
        triggered
      };
    });
    
    res.json({
      location: location._id,
      currentConditions: {
        temp: weatherData.main.temp,
        weather: weatherData.weather[0].main,
        wind: weatherData.wind.speed
      },
      alerts: alertResults
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;