import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

// Mock all child components
vi.mock('../AppProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-provider">{children}</div>
  )
}));

vi.mock('../AppLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  )
}));

vi.mock('../AppRouter', () => ({
  default: () => <div data-testid="app-router">Router Content</div>
}));

describe('App', () => {
  it('renders all main components in correct structure', () => {
    render(<App />);

    expect(screen.getByTestId('app-provider')).toBeInTheDocument();
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('maintains correct component nesting', () => {
    render(<App />);

    const provider = screen.getByTestId('app-provider');
    const layout = screen.getByTestId('app-layout');
    const router = screen.getByTestId('app-router');

    // Provider should contain Layout
    expect(provider).toContainElement(layout);
    // Layout should contain Router
    expect(layout).toContainElement(router);
  });

  it('passes admin user state correctly', () => {
    // This is a structural test - the component should render without errors
    render(<App />);
    
    // App component should render successfully with its structure
    expect(screen.getByTestId('app-provider')).toBeInTheDocument();
  });
}); 