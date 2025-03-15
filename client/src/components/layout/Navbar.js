import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Weather Dashboard</Link>
          
          <div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline">
                  Welcome, {user?.username || 'User'}
                </span>
                <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-blue-700">
                  Dashboard
                </Link>
                <Link to="/settings" className="px-3 py-2 rounded hover:bg-blue-700">
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded hover:bg-blue-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-2 bg-white text-blue-600 rounded hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;