import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [userRole, setUserRole] = useState(''); 
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, role } = await response.json(); // Assuming the backend returns the user's role as 'role'
        // Set the authentication state, token, and userRole
        setIsAuthenticated(true);
        setToken(token);
        setUserRole(role);
        navigate('/');
      } else {
        // Handle authentication error
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      // Handle any other error occurred during login
      alert(error.message);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Reset the authentication state, token, and userRole
      setIsAuthenticated(false);
      setToken('');
      setUserRole('');
      navigate('/');
    } catch (error) {
      // Handle any error occurred during logout
      alert(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
