import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { WiDaySunny, WiMoonAltWaxingCrescent3, WiCloud, WiRain, WiSnow } from 'react-icons/wi';

const Home = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const cardVariants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } }
  };

  const getTimeBasedBackground = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return 'bg-gradient-to-br from-sky-400 to-blue-500';
    }
    return 'bg-gradient-to-br from-indigo-900 to-blue-900';
  };

  useEffect(() => {
    // Handle any necessary updates when the route changes
  }, [location]);

  return (
    <div className={`min-h-screen ${getTimeBasedBackground()} text-white`}>
      <motion.div
        className="max-w-7xl mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="text-center space-y-8">
          <motion.div
            className="flex justify-center space-x-4 items-center"
            whileHover={{ scale: 1.05 }}
          >
            <WiDaySunny className="text-6xl animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to WeatherBoard
            </h1>
            <WiMoonAltWaxingCrescent3 className="text-6xl animate-pulse" />
          </motion.div>

          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Your personal weather companion. Stay informed, stay prepared, and enjoy the beauty of weather.
          </p>

          {!isAuthenticated ? (
            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8"
              variants={heroVariants}
            >
              <Link
                to="/register"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/20 transition-all"
              >
                Create an Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/20 transition-all"
              >
                Login
              </Link>
            </motion.div>
          ) : (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white/20 transition-all"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white/10 backdrop-blur-sm p-8 rounded-lg space-y-4 cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
          >
            <WiCloud className="text-6xl" />
            <h3 className="text-2xl font-bold">Real-time Weather</h3>
            <p className="text-gray-200">
              Get accurate, up-to-date weather information for any location worldwide.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm p-8 rounded-lg space-y-4 cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
          >
            <WiRain className="text-6xl" />
            <h3 className="text-2xl font-bold">Saved Locations</h3>
            <p className="text-gray-200">
              Save your favorite locations for quick access to weather conditions.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm p-8 rounded-lg space-y-4 cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
          >
            <WiSnow className="text-6xl" />
            <h3 className="text-2xl font-bold">Weather Alerts</h3>
            <p className="text-gray-200">
              Set up custom alerts for specific weather conditions in your saved locations.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;