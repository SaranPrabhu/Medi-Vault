// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser as apiRegisterUser, setAuthToken } from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // minimal user object persisted
  const [loading, setLoading] = useState(true);

  // load persisted user on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('medi_user');
      const token = localStorage.getItem('medi_token');
      if (token) {
        // set default Authorization header for axios
        setAuthToken(token);
      }
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to parse persisted user', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistUser = (u) => {
    if (!u) {
      localStorage.removeItem('medi_user');
      setUser(null);
      return;
    }
    const minimal = {
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      role: u.role
    };
    localStorage.setItem('medi_user', JSON.stringify(minimal));
    setUser(minimal);
  };

  // LOGIN: call backend auth endpoint, persist minimal user and token
  const login = async (identifier, password) => {
    try {
      if (!identifier || !password) {
        return { success: false, error: 'Missing credentials' };
      }

      // backend expects an email field; try to send identifier as email
      const payload = { email: identifier, password };
      const res = await loginUser(payload);

      if (!res || !res.data) {
        return { success: false, error: 'Invalid response from server' };
      }

      if (!res.data.success) {
        return { success: false, error: res.data.message || 'Login failed' };
      }

      const { user: userData, token } = res.data.data;
      if (!token) {
        return { success: false, error: 'No token returned from server' };
      }

      // persist token and set default header
      localStorage.setItem('medi_token', token);
      setAuthToken(token);

      // persist user minimal details
      persistUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.error('login unexpected', err.response || err.message || err);
      const msg = err.response?.data?.message || err.message || 'Unexpected error';
      return { success: false, error: msg };
    }
  };

  // REGISTER: call backend register endpoint and persist token/user on success
  const registerUser = async ({ name, email, password, role = 'patient', ...rest }) => {
    try {
      if (!name || !email || !password || !role) {
        return { success: false, error: 'Missing required fields' };
      }

      const payload = { name, email, password, role, ...rest };
      const res = await apiRegisterUser(payload);

      if (!res || !res.data) {
        return { success: false, error: 'Invalid response from server' };
      }

      if (!res.data.success) {
        return { success: false, error: res.data.message || 'Registration failed' };
      }

      const { user: userData, token } = res.data.data;
      if (!token) {
        return { success: false, error: 'No token returned from server' };
      }

      localStorage.setItem('medi_token', token);
      setAuthToken(token);
      persistUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.error('registerUser error', err.response || err.message || err);
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    persistUser(null);
    localStorage.removeItem('medi_token');
    setAuthToken(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    registerUser,
    setUser: persistUser
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
