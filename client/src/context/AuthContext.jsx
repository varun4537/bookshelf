import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { showToast } from '../utils/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate token here
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Starting login attempt with:', credentials);
      const data = await authService.login(credentials);
      console.log('AuthContext: Received response:', data);
      
      if (!data || !data.token) {
        console.error('AuthContext: Invalid response - no token received');
        throw new Error('Invalid login response');
      }
      
      setUser(data.user);
      localStorage.setItem('token', data.token);
      console.log('AuthContext: Login successful, user state updated');
      showToast.success('Successfully logged in');
      return data;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      showToast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      showToast.success('Successfully registered');
      return data;
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    showToast.success('Successfully logged out');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;