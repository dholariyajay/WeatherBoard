import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeatherForecast = ({ forecast }) => {
  const { user } = useContext(AuthContext);
  const tempUnit = user?.preferences?.tempUnit || 'celsius';
  
  // Convert temperature based on user preference
  const convertTemp = (temp) => {
    if (tempUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };
  
  // Get weather icon
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };
  
  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Process forecast data for chart
  const chartData = forecast.list.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(convertTemp(item.main.temp)),
    feels: Math.round(convertTemp(item.main.feels_like)),
  }));
  
  // Group forecast by day
  const groupByDay = (list) => {
    const grouped = {};
    
    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString([], { weekday: 'short' });
      
      if (!grouped[day]) {
        grouped[day] = [];
      }
      
      grouped[day].push(item);
    });
    
    return Object.entries(grouped).map(([day, items]) => {
      // Calculate min and max temp for the day
      const temps = items.map(item => item.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      
      // Get most frequent weather condition
      const weatherCounts = {};
      items.forEach(item => {
        const condition = item.weather[0].main;
        weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
      });
      
      let mostFrequentWeather = null;
      let maxCount = 0;
      
      Object.entries(weatherCounts).forEach(([condition, count]) => {
        if (count > maxCount) {
          mostFrequentWeather = condition;
          maxCount = count;
        }
      });
      
      // Get icon for most frequent weather
      const weatherIcon = items.find(item => 
        item.weather[0].main === mostFrequentWeather
      ).weather[0].icon;
      
      return {
        day,
        minTemp: Math.round(convertTemp(minTemp)),
        maxTemp: Math.round(convertTemp(maxTemp)),
        weather: mostFrequentWeather,
        weatherIcon
      };
    });
  };
  
  const dailyForecast = groupByDay(forecast.list);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">5-Day Forecast</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {dailyForecast.map((day, index) => (
          <div 
            key={index}
            className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <span className="font-medium text-gray-800 dark:text-white">{day.day}</span>
            <img 
              src={getWeatherIcon(day.weatherIcon)} 
              alt={day.weather} 
              className="w-12 h-12 my-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">{day.weather}</span>
            <div className="flex justify-between w-full mt-2">
              <span className="text-blue-500">{day.minTemp}°</span>
              <span className="text-red-500">{day.maxTemp}°</span>
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">24-Hour Forecast</h3>
      
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis 
              label={{ 
                value: tempUnit === 'celsius' ? '°C' : '°F', 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip 
              formatter={(value) => [`${value}°`, '']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#3B82F6" 
              activeDot={{ r: 8 }}
              name="Temperature"
            />
            <Line 
              type="monotone" 
              dataKey="feels" 
              stroke="#9333EA" 
              strokeDasharray="5 5"
              name="Feels Like"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weather</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Temp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Humidity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wind</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {forecast.list.slice(0, 8).map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(item.dt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={getWeatherIcon(item.weather[0].icon)} 
                      alt={item.weather[0].description}
                      className="w-8 h-8 mr-2"
                    />
                    <span className="text-sm text-gray-900 dark:text-white capitalize">
                      {item.weather[0].description}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {Math.round(convertTemp(item.main.temp))}°
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    (feels {Math.round(convertTemp(item.main.feels_like))}°)
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.main.humidity}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {Math.round(item.wind.speed * 3.6)} km/h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherForecast;