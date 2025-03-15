import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to the Weather Dashboard
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Get real-time weather updates, save your favorite locations, and track weather conditions all in one place.
        </p>
        
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
            >
              Create an Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition-colors w-full sm:w-auto text-center"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        )}
      </div>
      
      <div className="w-full bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Real-time Weather
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get accurate, up-to-date weather information for any location worldwide.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Saved Locations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Save your favorite locations for quick access to weather conditions.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Weather Alerts
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set up custom alerts for specific weather conditions in your saved locations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;