import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const CurrentWeather = ({ current, weather }) => {
  const { user } = useContext(AuthContext);
  const tempUnit = user?.preferences?.tempUnit || 'celsius';
  
  // Convert temperature based on user preference
  const convertTemp = (temp) => {
    if (tempUnit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };
  
  // Get weather icon
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  
  const getTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-3xl font-bold">{current.name}</h2>
            <p className="text-xl opacity-90">
              {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <img 
              src={getWeatherIcon(weather.weather[0].icon)} 
              alt={weather.weather[0].description} 
              className="w-16 h-16 mr-2"
            />
            <div>
              <div className="text-4xl font-bold">
                {convertTemp(weather.main.temp)}
              </div>
              <div className="capitalize text-lg">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Feels Like</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {convertTemp(weather.main.feels_like)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Humidity</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {weather.main.humidity}%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Wind</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {Math.round(weather.wind.speed * 3.6)} km/h
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Pressure</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {weather.main.pressure} hPa
            </span>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Sunrise</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {getTime(weather.sys.sunrise)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Sunset</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {getTime(weather.sys.sunset)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Min Temp</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {convertTemp(weather.main.temp_min)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Max Temp</span>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              {convertTemp(weather.main.temp_max)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;