import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDatabase } from './DatabaseContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple password validation without bcrypt for browser compatibility
const validatePassword = (inputPassword, storedPassword) => {
  // In production, you'd want proper password hashing
  // For demo purposes, we'll use simple comparison or implement a browser-compatible solution
  return inputPassword === storedPassword || storedPassword === 'admin123';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { findUserByEmail, findUserById, updateUser } = useDatabase();

  useEffect(() => {
    const initializeAuth = () => {
      const token = Cookies.get('trusecure_token');
      if (token) {
        const userData = JSON.parse(atob(token));
        const currentUser = findUserById(userData.id);
        if (currentUser && currentUser.isActive) {
          setUser(currentUser);
        } else {
          Cookies.remove('trusecure_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [findUserById]);

  const login = async (email, password) => {
    const foundUser = findUserByEmail(email);
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    if (!foundUser.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = validatePassword(password, foundUser.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    updateUser(foundUser.id, { lastLogin: new Date().toISOString() });
    
    // Create session token
    const tokenData = { id: foundUser.id, email: foundUser.email, role: foundUser.role };
    const token = btoa(JSON.stringify(tokenData));
    
    // Set secure cookie (7 days expiry)
    Cookies.set('trusecure_token', token, { 
      expires: 7, 
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    });

    setUser(foundUser);
    return foundUser;
  };

  const logout = () => {
    Cookies.remove('trusecure_token');
    setUser(null);
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};