const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const auth = require('../middleware/auth');

// GET all locations for a user
router.get('/', auth, async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user.id });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single location
router.get('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findOne({ 
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new location
router.post('/', auth, async (req, res) => {
  const { name, lat, lon, isFavorite } = req.body;
  
  try {
    const newLocation = new Location({
      user: req.user.id,
      name,
      lat,
      lon,
      isFavorite
    });
    
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a location
router.put('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a location
router.delete('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;