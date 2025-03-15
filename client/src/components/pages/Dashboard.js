import { useContext, useEffect } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import LocationList from '../weather/LocationList';
import CurrentWeather from '../weather/CurrentWeather.js';
import WeatherForecast from '../weather/WeatherForecast';
import LocationSearch from '../weather/LocationSearch';

const Dashboard = () => {
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

  useEffect(() => {
    getLocations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (current) {
      getWeather(current.lat, current.lon);
      getForecast(current.lat, current.lon);
    }
    // eslint-disable-next-line
  }, [current]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Locations</h2>
        <LocationSearch />
        {locations.length > 0 ? (
          <LocationList locations={locations} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No saved locations. Add one to get started!</p>
        )}
      </div>
      
      <div className="md:col-span-3">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : current && weatherData ? (
          <div className="grid grid-cols-1 gap-6">
            <CurrentWeather current={current} weather={weatherData} />
            {forecast && <WeatherForecast forecast={forecast} />}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Welcome to Weather Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a location from your saved list or search for a new one to view weather information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;