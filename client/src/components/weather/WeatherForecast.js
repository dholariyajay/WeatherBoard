import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const WeatherForecast = ({ forecast }) => {
  const { user } = useContext(AuthContext);
  const tempUnit = user?.preferences?.tempUnit || 'celsius';
  
  const convertTemp = (temp) => {
    if (tempUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };
  
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const chartData = forecast.list.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(convertTemp(item.main.temp)),
    feels: Math.round(convertTemp(item.main.feels_like)),
  }));
  
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
      const temps = items.map(item => item.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      
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
      
      const weatherIcon = items.find(item => 
        item.weather[0].main === mostFrequentWeather
      ).weather[0].icon;
      
      return {
        day,
        minTemp: Math.round(convertTemp(minTemp)),
        maxTemp: Math.round(convertTemp(maxTemp)),
        weather: mostFrequentWeather,
        weatherIcon,
        description: items.find(item => 
          item.weather[0].main === mostFrequentWeather
        ).weather[0].description
      };
    });
  };
  
  const dailyForecast = groupByDay(forecast.list);

  return (
    <div className="p-6">
      <motion.h3 
        className="text-2xl font-bold mb-8 text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        5-Day Forecast
      </motion.h3>
      
      <div className="relative overflow-hidden">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {dailyForecast.map((day, index) => (
            <motion.div 
              key={index}
              className="relative overflow-hidden flex flex-col items-center p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <span className="font-bold text-lg text-gray-800 dark:text-white mb-1">{day.day}</span>
              <motion.img 
                src={getWeatherIcon(day.weatherIcon)} 
                alt={day.weather} 
                className="w-16 h-16 my-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ 
                  scale: { duration: 0.5, delay: index * 0.1 + 0.3 },
                  rotate: { duration: 2, repeat: Infinity, repeatDelay: 5 }
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 capitalize mb-2">{day.description}</span>
              <div className="flex justify-between w-full mt-auto">
                <span className="text-blue-500 font-medium">{day.minTemp}°</span>
                <div className="w-full mx-2 h-1 bg-gray-200 dark:bg-gray-600 self-center rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
                <span className="text-red-500 font-medium">{day.maxTemp}°</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">24-Hour Forecast</h3>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-8">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#aaa" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickLine={{ stroke: '#888' }}
                  axisLine={{ stroke: '#888' }}
                />
                <YAxis 
                  label={{ 
                    value: tempUnit === 'celsius' ? '°C' : '°F', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#888' }
                  }} 
                  tick={{ fontSize: 12, fill: '#888' }}
                  tickLine={{ stroke: '#888' }}
                  axisLine={{ stroke: '#888' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}°`, '']}
                  labelFormatter={(label) => `Time: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#3B82F6', strokeWidth: 0 }}
                  activeDot={{ r: 8, fill: '#3B82F6', strokeWidth: 0 }}
                  name="Temperature"
                  animationDuration={2000}
                />
                <Line 
                  type="monotone" 
                  dataKey="feels" 
                  stroke="#9333EA" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#9333EA', strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#9333EA', strokeWidth: 0 }}
                  name="Feels Like"
                  animationDuration={2000}
                  animationBegin={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <motion.div 
          className="overflow-hidden rounded-xl shadow-sm bg-white dark:bg-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weather</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Temp</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Humidity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wind</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {forecast.list.slice(0, 8).map((item, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(item.dt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={getWeatherIcon(item.weather[0].icon)} 
                          alt={item.weather[0].description}
                          className="w-10 h-10 mr-2"
                        />
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {item.weather[0].description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {Math.round(convertTemp(item.main.temp))}°
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        feels {Math.round(convertTemp(item.main.feels_like))}°
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full mr-2">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${item.main.humidity}%` }}
                          />
                        </div>
                        {item.main.humidity}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <svg 
                          className="w-4 h-4 mr-1 text-gray-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          style={{ 
                            transform: `rotate(${item.wind.deg}deg)` 
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        {Math.round(item.wind.speed * 3.6)} km/h
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
      </div>
 );
};

export default WeatherForecast;