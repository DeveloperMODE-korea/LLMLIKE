import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ErrorBoundary } from './common/ErrorBoundary';

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * AppProvider wraps the entire application with necessary providers
 * - AuthProvider for authentication context
 * - ErrorBoundary for global error handling
 * - Zustand store is self-contained and doesn't need a provider
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default AppProvider; 