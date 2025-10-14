// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Login from './components/Login';
import ModernDashboard from './components/ModernDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import './styles/App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [customerInitialTab, setCustomerInitialTab] = useState('dashboard');
  const [ownerInitialTab, setOwnerInitialTab] = useState('dashboard');

  // Khởi động ứng dụng: đăng xuất mọi phiên cũ và định tuyến theo URL hiện tại
  useEffect(() => {
    // Luôn đăng xuất khi khởi chạy (clear phiên cũ)
    localStorage.removeItem('logistics_user');
    setUser(null);

    // Định tuyến ban đầu dựa trên URL
    const { pathname } = window.location;
    if (pathname === '/Login') {
      setCurrentView('login');
    } else {
      // Hỗ trợ các route dashboard không yêu cầu đăng nhập trước (sẽ chuyển đến home nếu chưa login)
      if (pathname === '/dashboard' || pathname === '/shipments' || pathname === '/analytics' || pathname === '/create') {
        setCurrentView('customer');
        setCustomerInitialTab(
          pathname === '/dashboard'
            ? 'dashboard'
            : pathname === '/shipments'
            ? 'shipments'
            : pathname === '/create'
            ? 'create'
            : 'analytics'
        );
      } else if (pathname === '/owner' || pathname.startsWith('/owner/')) {
        setCurrentView('owner');
        const ownerTab = pathname === '/owner' ? 'dashboard' : pathname.replace('/owner/', '');
        setOwnerInitialTab(ownerTab);
      } else {
        setCurrentView('home');
        if (pathname !== '/home') {
          window.history.replaceState(null, '', '/home');
        }
      }
    }

    // Lắng nghe điều hướng back/forward của trình duyệt
    const handlePopState = () => {
      const { pathname } = window.location;
      if (pathname === '/Login') {
        setCurrentView('login');
        return;
      }
      if (pathname === '/dashboard' || pathname === '/shipments' || pathname === '/analytics' || pathname === '/create') {
        setCurrentView('customer');
        setCustomerInitialTab(
          pathname === '/dashboard'
            ? 'dashboard'
            : pathname === '/shipments'
            ? 'shipments'
            : pathname === '/create'
            ? 'create'
            : 'analytics'
        );
        return;
      }
      if (pathname === '/owner' || pathname.startsWith('/owner/')) {
        setCurrentView('owner');
        const ownerTab = pathname === '/owner' ? 'dashboard' : pathname.replace('/owner/', '');
        setOwnerInitialTab(ownerTab);
        return;
      }
      if (pathname === '/home') {
        setCurrentView('home');
        return;
      }
      // Bất kỳ route khác: điều chỉnh về /home
      setCurrentView('home');
      if (pathname !== '/home') {
        window.history.replaceState(null, '', '/home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('logistics_user', JSON.stringify(userData));
    setCurrentView(userData.role === 'Customer' ? 'customer' : 'owner');
    if (userData.role === 'Customer') {
      if (window.location.pathname !== '/dashboard') {
        window.history.pushState(null, '', '/dashboard');
      }
    } else {
      if (!window.location.pathname.startsWith('/owner')) {
        window.history.pushState(null, '', '/owner');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('logistics_user');
    setCurrentView('home');
    if (window.location.pathname !== '/home') {
      window.history.pushState(null, '', '/home');
    }
  };

  const handleLoginClick = () => {
    setCurrentView('login');
    if (window.location.pathname !== '/Login') {
      window.history.pushState(null, '', '/Login');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    if (window.location.pathname !== '/home') {
      window.history.pushState(null, '', '/home');
    }
  };

  // Render different views based on current state
  if (currentView === 'home') {
    return <HomePage onLoginClick={handleLoginClick} />;
  }

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onBackToHome={handleBackToHome} />;
  }

  const handleCustomerRouteChange = (tab) => {
    const path =
      tab === 'dashboard'
        ? '/dashboard'
        : tab === 'shipments'
        ? '/shipments'
        : tab === 'create'
        ? '/create'
        : '/analytics';
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  if (currentView === 'customer' && user) {
    return (
      <ModernDashboard 
        user={user} 
        onLogout={handleLogout} 
        initialTab={customerInitialTab}
        onRouteChange={handleCustomerRouteChange}
      />
    );
  }

  const handleOwnerRouteChange = (tab) => {
    const path = tab === 'dashboard' ? '/owner' : `/owner/${tab}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  if (currentView === 'owner' && user) {
    return (
      <OwnerDashboard 
        user={user} 
        onLogout={handleLogout} 
        initialTab={ownerInitialTab}
        onRouteChange={handleOwnerRouteChange}
      />
    );
  }

  // Fallback to home
  return <HomePage onLoginClick={handleLoginClick} />;
}

export default App;