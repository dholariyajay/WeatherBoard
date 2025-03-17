import { createContext, useReducer } from 'react';
import { api } from '../utils/axios';

const WeatherContext = createContext();

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'GET_LOCATIONS':
      return {
        ...state,
        locations: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [...state.locations, action.payload],
        loading: false,
        error: null
      };
    case 'DELETE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter(
          location => location._id !== action.payload
        ),
        loading: false,
        error: null
      };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map(location =>
          location._id === action.payload._id ? action.payload : location
        ),
        loading: false,
        error: null
      };
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload,
        loading: false,
        error: null
      };
    case 'GET_WEATHER':
      return {
        ...state,
        weatherData: action.payload,
        loading: false,
        error: null
      };
    case 'GET_FORECAST':
      return {
        ...state,
        forecast: action.payload,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'WEATHER_ERROR':
      console.error('Weather error:', action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const WeatherProvider = ({ children }) => {
  const initialState = {
    locations: [],
    current: null,
    weatherData: null,
    forecast: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // Get user's saved locations
  const getLocations = async () => {
    try {
      setLoading();
      const res = await api.get('/api/locations');
      dispatch({ type: 'GET_LOCATIONS', payload: res.data });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching locations';
      console.error('Error fetching locations:', errorMessage);
      dispatch({
        type: 'WEATHER_ERROR',
        payload: errorMessage
      });
    }
  };

  // Add new location
  const addLocation = async location => {
    try {
      setLoading();
      const res = await api.post('/api/locations', location);
      dispatch({ type: 'ADD_LOCATION', payload: res.data });
      return res.data; // Return the added location
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add location';
      console.error('Error adding location:', errorMessage);
      dispatch({
        type: 'WEATHER_ERROR',
        payload: errorMessage
      });
      throw err; // Re-throw to handle in the component
    }
  };

  // Delete location
  const deleteLocation = async id => {
    try {
      await api.delete(`/api/locations/${id}`);
      dispatch({ type: 'DELETE_LOCATION', payload: id });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete location';
      console.error('Error deleting location:', errorMessage);
      dispatch({
        type: 'WEATHER_ERROR',
        payload: errorMessage
      });
    }
  };

  // Update location
  const updateLocation = async location => {
    try {
      const res = await api.put(`/api/locations/${location._id}`, location);
      dispatch({ type: 'UPDATE_LOCATION', payload: res.data });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update location';
      console.error('Error updating location:', errorMessage);
      dispatch({
        type: 'WEATHER_ERROR',
        payload: errorMessage
      });
    }
  };

  // Set current location
  const setCurrent = location => {
    dispatch({ type: 'SET_CURRENT', payload: location });
  };

  // Get current weather
  const getWeather = async (lat, lon) => {
    try {
      setLoading();
      const res = await api.get(`/api/weather/current`, {
        params: { lat, lon }
      });
      dispatch({ type: 'GET_WEATHER', payload: res.data });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching weather';
      console.error('Error fetching weather:', errorMessage);
      dispatch({
        type: 'WEATHER_ERROR',
        payload: errorMessage
      });
    }
  };

  // Get weather forecast
  const getForecast = async (lat, lon) => {
    try {
      setLoading();
      const res = await api.get(`/api/weather/forecast`, {
        params: { lat, lon }
      });
      dispatch({ type: 'GET_FORECAST', payload: res.data });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error fetching forecast';
      console.error('Error fetching forecast:', errorMessage);
      dispatch({
        type: 'WEATHER_ERROR',
        payload: errorMessage
      });
    }
  };

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  // Clear error
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <WeatherContext.Provider
      value={{
        locations: state.locations,
        current: state.current,
        weatherData: state.weatherData,
        forecast: state.forecast,
        loading: state.loading,
        error: state.error,
        getLocations,
        addLocation,
        deleteLocation,
        updateLocation,
        setCurrent,
        getWeather,
        getForecast,
        clearError
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export { WeatherContext, WeatherProvider };