import React, { createContext, useState, useEffect,type ReactNode } from 'react';
import {type LoanOfficer,type AuthContextType } from '../types/loanSystem';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_AUTH_URL = 'https://railway.app';


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<LoanOfficer | null>(null);

  // Rehydrate session from local parameters immediately on page render check
  useEffect(() => {
    const savedOfficer = localStorage.getItem('session_officer');
    if (savedOfficer) {
      setCurrentUser(JSON.parse(savedOfficer));
    }
  }, []);

  const registerUser = async (userData: any) => {
    try {
      const response = await fetch(`${API_AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const err = await response.json();
        return { success: false, message: err.message || 'Registration failure.' };
      }

      const data = await response.json();
      
      // Persist access parameters inside local memory layers
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('session_officer', JSON.stringify(data.user));
      setCurrentUser(data.user);

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Network exception.' };
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const err = await response.json();
        return { success: false, message: err.message || 'Invalid credentials validation.' };
      }

      const data = await response.json();

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('session_officer', JSON.stringify(data.user));
      setCurrentUser(data.user);

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Backend server connection error.' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session_officer');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, registerUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
