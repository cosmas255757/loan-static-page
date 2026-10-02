import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {type AuthContextType } from '../types/loanSystem';

/**
 * Custom hook to safely consume the authentication context.
 * Provides access to `currentUser`, `loginUser`, `registerUser`, and `logoutUser`.
 * 
 * @returns {AuthContextType} The type-safe authentication context methods and state.
 * @throws {Error} If called from outside an `<AuthProvider>` wrapper element.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // Safety check: Throw a descriptive runtime boundary error if context returns undefined
  if (!context) {
    throw new Error('useAuth must be consumed strictly within an <AuthProvider> wrapper tree hierarchy.');
  }

  return context;
};
