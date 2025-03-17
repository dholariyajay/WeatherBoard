const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'http://api.openweathermap.org/geo/1.0';

if (!WEATHER_API_KEY) {
  console.error('OpenWeather API key is not configured in server environment');
  process.exit(1);
}

// Search locations by query
const searchLocations = async (query, limit = 5) => {
  console.log('WeatherService: Searching locations:', {
    query,
    limit,
    apiKey: WEATHER_API_KEY ? '***' : 'missing'
  });

  try {
    const url = `${GEO_BASE_URL}/direct`;
    console.log('WeatherService: Making request to:', url);

    const response = await axios.get(url, {
      params: {
        q: query,
        limit,
        appid: WEATHER_API_KEY
      }
    });

    console.log('WeatherService: Search successful:', {
      status: response.status,
      resultsCount: response.data.length
    });

    return response.data;
  } catch (error) {
    console.error('WeatherService: Geocoding error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Error searching locations: ${error.response?.data?.message || error.message}`);
  }
};

// Get current weather
const getCurrentWeather = async (lat, lon) => {
  console.log('WeatherService: Getting current weather:', { lat, lon });

  try {
    const url = `${WEATHER_BASE_URL}/weather`;
    console.log('WeatherService: Making request to:', url);

    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    console.log('WeatherService: Current weather successful:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error) {
    console.error('WeatherService: Current weather error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Error fetching current weather: ${error.response?.data?.message || error.message}`);
  }
};

// Get 5-day forecast
const getForecast = async (lat, lon) => {
  console.log('WeatherService: Getting forecast:', { lat, lon });

  try {
    const url = `${WEATHER_BASE_URL}/forecast`;
    console.log('WeatherService: Making request to:', url);

    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    console.log('WeatherService: Forecast successful:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error) {
    console.error('WeatherService: Forecast error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Error fetching forecast: ${error.response?.data?.message || error.message}`);
  }
};

// Get historical weather data
const getHistorical = async (lat, lon, dt) => {
  console.log('WeatherService: Getting historical weather:', { lat, lon, dt });

  try {
    const url = `${WEATHER_BASE_URL}/onecall/timemachine`;
    console.log('WeatherService: Making request to:', url);

    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        dt, // Unix timestamp
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });

    console.log('WeatherService: Historical weather successful:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error) {
    console.error('WeatherService: Historical weather error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Error fetching historical data: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  getHistorical,
  searchLocations
};