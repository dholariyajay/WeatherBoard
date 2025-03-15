import { createContext, useReducer } from 'react';
import axios from 'axios';

const WeatherContext = createContext();

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'GET_LOCATIONS':
      return {
        ...state,
        locations: action.payload,
        loading: false
      };
    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [...state.locations, action.payload],
        loading: false
      };
    case 'DELETE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter(
          location => location._id !== action.payload
        ),
        loading: false
      };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map(location =>
          location._id === action.payload._id ? action.payload : location
        ),
        loading: false
      };
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload,
        loading: false
      };
    case 'GET_WEATHER':
      return {
        ...state,
        weatherData: action.payload,
        loading: false
      };
    case 'GET_FORECAST':
      return {
        ...state,
        forecast: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'WEATHER_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
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
      const res = await axios.get('/api/locations');
      dispatch({ type: 'GET_LOCATIONS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'WEATHER_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Add new location
  const addLocation = async location => {
    try {
      setLoading();
      const res = await axios.post('/api/locations', location);
      dispatch({ type: 'ADD_LOCATION', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'WEATHER_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Delete location
  const deleteLocation = async id => {
    try {
      await axios.delete(`/api/locations/${id}`);
      dispatch({ type: 'DELETE_LOCATION', payload: id });
    } catch (err) {
      dispatch({
        type: 'WEATHER_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Update location
  const updateLocation = async location => {
    try {
      const res = await axios.put(`/api/locations/${location._id}`, location);
      dispatch({ type: 'UPDATE_LOCATION', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'WEATHER_ERROR',
        payload: err.response.data.message
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
      const res = await axios.get(`/api/weather/current?lat=${lat}&lon=${lon}`);
      dispatch({ type: 'GET_WEATHER', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'WEATHER_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Get weather forecast
  const getForecast = async (lat, lon) => {
    try {
      setLoading();
      const res = await axios.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
      dispatch({ type: 'GET_FORECAST', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'WEATHER_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });

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
        getForecast
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export { WeatherContext, WeatherProvider };