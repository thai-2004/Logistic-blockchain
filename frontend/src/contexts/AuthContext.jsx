import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const INACTIVITY_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('logistics_user');
      const storedToken = localStorage.getItem('logistics_token');
      const lastActivityStr = localStorage.getItem('logistics_last_activity');
      const lastActivity = lastActivityStr ? Number(lastActivityStr) : 0;
      const now = Date.now();

      if (storedUser && storedToken && lastActivity && now - lastActivity < INACTIVITY_LIMIT_MS) {
        const parsedUser = JSON.parse(storedUser);
        // Đảm bảo không có password trong stored user
        const { password, ...safeUser } = parsedUser;
        setUser(safeUser);
        setToken(storedToken);
      } else {
        // Clear expired session
        localStorage.removeItem('logistics_user');
        localStorage.removeItem('logistics_token');
        localStorage.removeItem('logistics_last_activity');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Track user activity for auto-logout
  useEffect(() => {
    if (!user) return;

    let inactivityTimerId;

    const recordActivity = () => {
      localStorage.setItem('logistics_last_activity', String(Date.now()));
      resetInactivityTimer();
    };

    const resetInactivityTimer = () => {
      if (inactivityTimerId) {
        clearTimeout(inactivityTimerId);
      }
      const lastActivityStr = localStorage.getItem('logistics_last_activity');
      const lastActivity = lastActivityStr ? Number(lastActivityStr) : Date.now();
      const elapsed = Date.now() - lastActivity;
      const remaining = Math.max(INACTIVITY_LIMIT_MS - elapsed, 0);
      inactivityTimerId = setTimeout(() => {
        logout();
      }, remaining);
    };

    // Set initial activity timestamp if not exists
    if (!localStorage.getItem('logistics_last_activity')) {
      localStorage.setItem('logistics_last_activity', String(Date.now()));
    }
    resetInactivityTimer();

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'visibilitychange'];
    events.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));

    return () => {
      if (inactivityTimerId) clearTimeout(inactivityTimerId);
      events.forEach((evt) => window.removeEventListener(evt, recordActivity));
    };
  }, [user]);

  const login = (userData, authToken = null) => {
    // Chỉ lưu minimal user info - KHÔNG lưu password
    const { password, ...safeUserData } = userData;
    setUser(safeUserData);
    
    // Store token if provided, otherwise generate a session token
    const sessionToken = authToken || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setToken(sessionToken);
    
    localStorage.setItem('logistics_user', JSON.stringify(safeUserData));
    localStorage.setItem('logistics_token', sessionToken);
    localStorage.setItem('logistics_last_activity', String(Date.now()));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('logistics_user');
    localStorage.removeItem('logistics_token');
    localStorage.removeItem('logistics_last_activity');
  };

  const isAuthenticated = () => !!user && !!token;
  const isOwner = () => user?.role === 'Owner';
  const isCustomer = () => user?.role === 'Customer';

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isOwner,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

