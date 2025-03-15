import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { user, loadUser } = useContext(AuthContext);
  const [preferences, setPreferences] = useState({
    tempUnit: 'celsius',
    theme: 'light'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const onChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/preferences', preferences);
      setMessage('Preferences updated successfully!');
      setError('');
      
      // Reload user data to get updated preferences
      loadUser();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage('');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Temperature Unit
          </label>
          <div className="mt-2">
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="celsius"
                name="tempUnit"
                value="celsius"
                checked={preferences.tempUnit === 'celsius'}
                onChange={onChange}
                className="mr-2"
              />
              <label htmlFor="celsius" className="text-gray-700 dark:text-gray-300">
                Celsius (°C)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="fahrenheit"
                name="tempUnit"
                value="fahrenheit"
                checked={preferences.tempUnit === 'fahrenheit'}
                onChange={onChange}
                className="mr-2"
              />
              <label htmlFor="fahrenheit" className="text-gray-700 dark:text-gray-300">
                Fahrenheit (°F)
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Theme
          </label>
          <div className="mt-2">
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="light"
                name="theme"
                value="light"
                checked={preferences.theme === 'light'}
                onChange={onChange}
                className="mr-2"
              />
              <label htmlFor="light" className="text-gray-700 dark:text-gray-300">
                Light
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="dark"
                name="theme"
                value="dark"
                checked={preferences.theme === 'dark'}
                onChange={onChange}
                className="mr-2"
              />
              <label htmlFor="dark" className="text-gray-700 dark:text-gray-300">
                Dark
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;