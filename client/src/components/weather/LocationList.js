import { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';

const LocationList = ({ locations }) => {
  const { setCurrent, deleteLocation, updateLocation } = useContext(WeatherContext);

  const handleFavorite = (location) => {
    updateLocation({
      ...location,
      isFavorite: !location.isFavorite
    });
  };

  // Sort locations with favorites first
  const sortedLocations = [...locations].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <ul className="space-y-2 mt-4">
      {sortedLocations.map(location => (
        <li 
          key={location._id}
          className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition"
          onClick={() => setCurrent(location)}
        >
          <div className="flex items-center">
            <button
              className="mr-2 text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite(location);
              }}
            >
              {location.isFavorite ? (
                <svg className="w-5 h-5 fill-current text-yellow-500" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
            <span className="text-gray-800 dark:text-white">{location.name}</span>
          </div>
          <button
            className="text-red-500 hover:text-red-700 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              deleteLocation(location._id);
            }}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default LocationList;