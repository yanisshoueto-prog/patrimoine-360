import { createContext, useState, useEffect } from 'react';
import api from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [artisanId, setArtisanId] = useState(localStorage.getItem('artisanId'));
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const login = async (username, password) => {
    const res = await api.post('/api/auth/login/', { username, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/api/auth/register/', userData);
    setToken(res.data.token);
    setArtisanId(res.data.artisan_id);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('artisanId', res.data.artisan_id);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setArtisanId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('artisanId');
  };

  return (
    <AuthContext.Provider value={{ token, artisanId, login, register, logout, darkMode, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};
