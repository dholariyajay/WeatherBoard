import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WeatherContext } from '../../context/WeatherContext';
import LocationList from '../weather/LocationList';
import CurrentWeather from '../weather/CurrentWeather.js';
import WeatherForecast from '../weather/WeatherForecast';
import LocationSearch from '../weather/LocationSearch';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const location = useLocation();
  const { 
    locations, 
    current, 
    weatherData, 
    forecast,
    loading, 
    getLocations,
    getWeather,
    getForecast
  } = useContext(WeatherContext);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    getLocations();
    if (current) {
      getWeather(current.lat, current.lon);
      getForecast(current.lat, current.lon);
    }
  }, [location, current]);

  const getWeatherBackground = () => {
    if (!weatherData) return 'from-blue-400 to-blue-600';
    
    const condition = weatherData.weather[0].main.toLowerCase();
    const isDay = weatherData.weather[0].icon.includes('d');
    
    if (condition.includes('clear')) {
      return isDay ? 'from-blue-400 to-blue-600' : 'from-indigo-900 to-purple-900';
    } else if (condition.includes('cloud')) {
      return isDay ? 'from-blue-300 to-gray-400' : 'from-gray-700 to-gray-900';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return isDay ? 'from-blue-400 to-gray-600' : 'from-gray-800 to-gray-900';
    } else if (condition.includes('thunder')) {
      return 'from-gray-700 to-gray-900';
    } else if (condition.includes('snow')) {
      return isDay ? 'from-blue-100 to-gray-200' : 'from-blue-900 to-gray-800';
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return isDay ? 'from-gray-300 to-gray-400' : 'from-gray-700 to-gray-800';
    }
    
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Weather Dashboard</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Sidebar */}
        <motion.div 
          className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-80 lg:w-96 bg-white dark:bg-gray-800 shadow-lg z-20 md:min-h-screen overflow-y-auto`}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Locations</h2>
            <LocationSearch />
            {locations.length > 0 ? (
              <LocationList locations={locations} currentId={current?._id} />
            ) : (
              <div className="mt-6 text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="mt-4 text-gray-600 dark:text-gray-400">No saved locations. Search and add locations to get started!</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Main content */}
        <motion.div 
          className="flex-1 p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
            </div>
          ) : current && weatherData ? (
            <motion.div 
              className="grid grid-cols-1 gap-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className={`bg-gradient-to-r ${getWeatherBackground()} rounded-xl shadow-xl overflow-hidden`}>
                <CurrentWeather current={current} weather={weatherData} />
              </div>
              
              {forecast && (
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <WeatherForecast forecast={forecast} />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-40 h-40 mb-8">
                <motion.div 
                  className="absolute inset-0"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 8,
                    ease: "easeInOut"
                  }}
                >
                  <svg viewBox="0 0 64 64" className="w-full h-full text-blue-500">
                    <path fill="currentColor" d="M43.112,22.417c-0.474-4.474-4.1-7.917-8.612-7.917c-3.451,0-6.555,2.095-7.891,5.263c-0.321-0.054-0.644-0.093-0.973-0.093c-3.279,0-5.971,2.649-6.072,5.91C15.835,26.54,13,29.884,13,33.75c0,4.556,3.694,8.25,8.25,8.25H42.75c4.556,0,8.25-3.694,8.25-8.25C51,28.167,47.556,23.75,43.112,22.417z" />
                  </svg>
                </motion.div>
                <motion.div 
                  className="absolute top-16 left-1/2 transform -translate-x-1/2"
                  animate={{ 
                    y: [0, 5, 0],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                >
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3V4M12 20V21M21 12H20M4 12H3M18.364 5.636L17.657 6.343M6.343 17.657L5.636 18.364M18.364 18.364L17.657 17.657M6.343 6.343L5.636 5.636" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" className="text-yellow-400" />
                  </svg>
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to Weather Dashboard</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Select a location from your saved list or search for a new one to view detailed weather information.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;