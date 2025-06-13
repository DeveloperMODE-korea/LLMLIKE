import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppProvider from '../AppProvider';

// Mock child components
vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  )
}));

vi.mock('../common/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  )
}));

describe('AppProvider', () => {
  it('renders children wrapped in providers', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    render(
      <AppProvider>
        <TestChild />
      </AppProvider>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('maintains correct provider nesting order', () => {
    const TestChild = () => <div data-testid="test-child">Test</div>;
    
    render(
      <AppProvider>
        <TestChild />
      </AppProvider>
    );

    const errorBoundary = screen.getByTestId('error-boundary');
    const authProvider = screen.getByTestId('auth-provider');
    const testChild = screen.getByTestId('test-child');

    // ErrorBoundary should contain AuthProvider
    expect(errorBoundary).toContainElement(authProvider);
    // AuthProvider should contain the test child
    expect(authProvider).toContainElement(testChild);
  });
}); 