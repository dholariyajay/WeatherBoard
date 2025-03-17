import { useState, useContext, useEffect } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import { api } from '../../utils/axios';

const LocationSearch = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const { addLocation, error: contextError, clearError } = useContext(WeatherContext);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [search, clearError]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setSearchResults([]);
    clearError();
    
    if (search.trim() === '') {
      setError('Please enter a location to search');
      return;
    }
    
    try {
      setSearching(true);
      
      const res = await api.get('/api/weather/search', {
        params: {
          q: search,
          limit: 5
        }
      });
      
      if (!res.data || !Array.isArray(res.data)) {
        console.error('Invalid response format:', res.data);
        throw new Error('Invalid response from weather service');
      }
      
      setSearchResults(res.data);
      
      if (res.data.length === 0) {
        setError(`No locations found for "${search}". Try a different search term.`);
      }
    } catch (err) {
      console.error('Search error:', err);
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
      } else if (err.response?.status === 401) {
        setError('Please log in to search for locations.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please try again later.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Error searching for location. Please try again.');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleAddLocation = async (location) => {
    try {
      setError(null);
      clearError();
      const formattedLocation = {
        name: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
        lat: location.lat,
        lon: location.lon
      };
      
      await addLocation(formattedLocation);
      setSearchResults([]);
      setSearch('');
    } catch (err) {
      setError('Failed to add location. Please try again.');
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="mb-4">
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
            disabled={searching}
          >
            {searching ? (
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
      
      {(error || contextError) && (
        <div className="mt-2 text-red-500 text-sm">
          {error || contextError}
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          <ul>
            {searchResults.map((result, index) => (
              <li 
                key={`${result.lat}-${result.lon}-${index}`}
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