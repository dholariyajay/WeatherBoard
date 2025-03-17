import { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import { motion } from 'framer-motion';

const LocationList = ({ locations, currentId }) => {
  const { setCurrent, deleteLocation, updateLocation } = useContext(WeatherContext);

  const handleFavorite = (e, location) => {
    e.stopPropagation();
    updateLocation({
      ...location,
      isFavorite: !location.isFavorite
    });
  };

  const sortedLocations = [...locations].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.ul 
      className="space-y-3 mt-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sortedLocations.map(location => (
        <motion.li 
          key={location._id}
          variants={item}
          whileHover={{ scale: 1.02 }}
          className={`flex justify-between items-center p-4 rounded-lg cursor-pointer transition-all shadow-sm hover:shadow
            ${location._id === currentId 
              ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500' 
              : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
          onClick={() => setCurrent(location)}
        >
          <div className="flex items-center overflow-hidden">
            <button
              className={`mr-3 flex-shrink-0 transition-all duration-300 
                ${location.isFavorite 
                  ? 'text-yellow-500 dark:text-yellow-400' 
                  : 'text-gray-400 dark:text-gray-500'}`}
              onClick={(e) => handleFavorite(e, location)}
            >
              <motion.svg 
                className="w-6 h-6 fill-current" 
                viewBox="0 0 24 24"
                animate={{ 
                  scale: location.isFavorite ? [1, 1.2, 1] : 1,
                  rotate: location.isFavorite ? [0, 15, 0, -15, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill={location.isFavorite ? "currentColor" : "none"}
                />
              </motion.svg>
            </button>
            <div className="overflow-hidden">
              <div className="truncate text-gray-800 dark:text-white font-medium">{location.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°</div>
            </div>
          </div>
          <motion.button
            className="text-red-500 hover:text-red-700 ml-2 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              deleteLocation(location._id);
            }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none" 
              />
            </svg>
          </motion.button>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default LocationList;