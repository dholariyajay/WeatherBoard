import { useState, useContext, useEffect } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import { api } from '../../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-4 bg-blue-500 hover:bg-blue-600 rounded-r-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
      
      <AnimatePresence>
        {(error || contextError) && (
          <motion.div 
            className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error || contextError}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div 
            className="mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-72 overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ul>
              {searchResults.map((result, index) => (
                <motion.li 
                  key={`${result.lat}-${result.lon}-${index}`}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    onClick={() => handleAddLocation(result)}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.name}{result.state ? `, ${result.state}` : ''}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {result.country}
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearch;