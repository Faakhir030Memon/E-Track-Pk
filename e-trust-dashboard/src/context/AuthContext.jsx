import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('etpk_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('etpk_token');
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, store } = res.data.data;
    localStorage.setItem('etpk_token', token);
    setUser(store);
    return res.data;
  };

  const register = async (storeData) => {
    const res = await api.post('/auth/register', storeData);
    const { token, store } = res.data.data;
    localStorage.setItem('etpk_token', token);
    setUser(store);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('etpk_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
