import axios from 'axios';

// Create an instance for our backend API
export const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create an instance for OpenWeather API
export const weatherApi = axios.create({
  baseURL: 'http://api.openweathermap.org',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Ensure credentials aren't sent
  withCredentials: false
});

// Add response interceptor to handle errors
const handleError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('Response error:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
  } else if (error.request) {
    // Request was made but no response
    console.error('Request error:', {
      message: error.message,
      config: error.config
    });
  } else {
    // Something else went wrong
    console.error('Error:', error.message);
  }
  return Promise.reject(error);
};

api.interceptors.response.use(response => response, handleError);
weatherApi.interceptors.response.use(response => response, handleError);

// Add request interceptor to handle auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add request interceptor for OpenWeather API to log requests
weatherApi.interceptors.request.use(
  (config) => {
    console.log('OpenWeather API Request:', {
      method: config.method,
      url: config.url,
      params: { ...config.params, appid: '***' }
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
