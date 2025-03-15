// Desc: Service to fetch weather data from OpenWeatherMap API
const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.cd361c17a3ae4aa0023faaf855ee02d6;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather
const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching current weather: ${error.message}`);
  }
};

// Get 5-day forecast
const getForecast = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching forecast: ${error.message}`);
  }
};

// Get historical weather data
const getHistorical = async (lat, lon, dt) => {
  try {
    const response = await axios.get(`${BASE_URL}/onecall/timemachine`, {
      params: {
        lat,
        lon,
        dt, // Unix timestamp
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching historical data: ${error.message}`);
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  getHistorical
};