
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check localStorage for existing user session on initial load
    try {
      const storedUser = localStorage.getItem('labUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('labUser'); // Clear corrupted data
    } finally {
      setLoading(false); // Set loading to false after checking localStorage
    }
  }, []);

  const login = (username, password) => {
    // Simple hardcoded credentials for demo
    // IMPORTANT: Replace with a secure authentication method for production!
    if (username === 'admin' && password === 'admin123') {
      const userData = { username, role: 'Profesor' };
      localStorage.setItem('labUser', JSON.stringify(userData));
      setUser(userData);
      return true;
    } else if (username === 'estudiante1' && password === 'est123') {
      const userData = { username, role: 'Estudiante' };
      localStorage.setItem('labUser', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('labUser');
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};
