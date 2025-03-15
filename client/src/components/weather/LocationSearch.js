import { useState, useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import axios from 'axios';

const LocationSearch = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const { addLocation } = useContext(WeatherContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (search.trim() === '') return;
    
    try {
      setSearching(true);
      // Using OpenWeatherMap's Geocoding API
      const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: search,
          limit: 5,
          appid: process.env.REACT_APP_OPENWEATHER_API_KEY
        }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddLocation = (location) => {
    addLocation({
      name: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
      lat: location.lat,
      lon: location.lon
    });
    setSearchResults([]);
    setSearch('');
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch}>
        <div className="flex">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {searching ? (
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
      
      {searchResults.length > 0 && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          <ul>
            {searchResults.map((result, index) => (
              <li 
                key={index}
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                onClick={() => handleAddLocation(result)}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {result.name}{result.state ? `, ${result.state}` : ''}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {result.country}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;