import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { WiDaySunny } from 'react-icons/wi';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-bar">
      <div className="container">
        <div className="nav-bar">
          <Link to="/" className="brand">
            <WiDaySunny size={32} />
            <span>WeatherBoard</span>
          </Link>
          
          <div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline">
                  Welcome, {user?.username || 'User'}
                </span>
                <Link to="/dashboard" className="button">
                  Dashboard
                </Link>
                <Link to="/settings" className="button">
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link 
                  to="/login" 
                  className="button"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="button"
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