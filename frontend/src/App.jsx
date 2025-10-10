// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('logistics_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setCurrentView(userData.role === 'Customer' ? 'customer' : 'owner');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('logistics_user', JSON.stringify(userData));
    setCurrentView(userData.role === 'Customer' ? 'customer' : 'owner');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('logistics_user');
    setCurrentView('home');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // Render different views based on current state
  if (currentView === 'home') {
    return <HomePage onLoginClick={handleLoginClick} />;
  }

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onBackToHome={handleBackToHome} />;
  }

  if (currentView === 'customer' && user) {
    return <CustomerDashboard user={user} onLogout={handleLogout} />;
  }

  if (currentView === 'owner' && user) {
    return <OwnerDashboard user={user} onLogout={handleLogout} />;
  }

  // Fallback to home
  return <HomePage onLoginClick={handleLoginClick} />;
}

export default App;