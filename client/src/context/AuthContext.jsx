import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: loggedUser } = response.data;
    setAccessToken(token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (formData) => {
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { token, user: registeredUser } = response.data;
    setAccessToken(token);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setAccessToken('');
      setUser(null);
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const token = response.data.token;
        setAccessToken(token);
        const decoded = decodeToken(token);
        if (decoded) {
          // Fetch fresh profile data to get follower counts
          const profileResponse = await api.get(`/users/profile/${decoded.username}`);
          setUser(profileResponse.data.user);
        }
      } catch (e) {
        console.log('No active session on boot.');
      } finally {
        setLoading(false);
      }
    };

    verifySession();

    const handleRequiredLogout = () => {
      setUser(null);
      setAccessToken('');
    };

    window.addEventListener('auth-logout-required', handleRequiredLogout);
    return () => window.removeEventListener('auth-logout-required', handleRequiredLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
