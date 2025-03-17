import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Settings from './components/pages/Settings';
import axios from 'axios';
import './App.css';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

// If token exists in localStorage, set it in the headers
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </div>
            <footer className="footer">
              <p>Created with ❤️ by <a href="https://github.com/dholariyajay" target="_blank" rel="noopener noreferrer">Jay Dholariya</a></p>
            </footer>
          </div>
        </Router>
      </WeatherProvider>
    </AuthProvider>
  );
}

export default App;