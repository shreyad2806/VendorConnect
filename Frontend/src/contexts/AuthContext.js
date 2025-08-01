import React, { createContext, useContext, useEffect, useState } from 'react';

// Backend API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  };

  // Sign up function
  const signup = async (email, password, userData) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name: userData.name,
          phone: userData.phone,
          role: userData.userType, // Backend uses 'role' instead of 'userType'
          businessName: userData.businessName,
          businessType: userData.businessType || 'general',
          address: userData.location,
          city: userData.city || '',
          state: userData.state || '',
          pincode: userData.pincode || '',
        }),
      });

      // Store token and user data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setCurrentUser(response.user);
        setUserProfile(response.user);
      }

      return response.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store token and user data
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setCurrentUser(response.user);
        setUserProfile(response.user);
      }

      return response.user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Get user profile from backend
  const getUserProfile = async () => {
    try {
      const response = await apiCall('/auth/profile');
      return response.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Verify token and get user profile
          const profile = await getUserProfile();
          if (profile) {
            setCurrentUser(profile);
            setUserProfile(profile);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          console.error('Auth check failed:', error);
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    logout,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
